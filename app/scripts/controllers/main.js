'use strict';

/**
 * @ngdoc function
 * @name anvil2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the anvil2App
 */
angular.module('anvil2App')
  .config(function($sceProvider) {
      //  Completely disable SCE.  For demonstration purposes only!
      //  Do not use in new projects.
      $sceProvider.enabled(false);
  })
  .controller('MainCtrl',function ($window, $location, $rootScope, $scope, $timeout, $http, localStorageService, masterOutCom, publicOutCom, comwifiOutCom, inCom) {

      var _ = $window._;


      $scope.master = {url:'about:blank'};
      $scope.webviews = [];
      $scope.menu = [];
      $scope.loading = false;
      $scope.loadingMessage = '';
      $scope.appEnviroment = {
        'lang' : 'es',
        'ssid' : '',
        'fakeDevice' : 'ios',
        'gprs' : true,
        'wifi' : false,
        'sim' : true,
        'imsi': '',
        'imei': '',
        'removeStorage': false
      };

      var getEnviromentParam = function() {
        return encodeURIComponent(angular.toJson($scope.appEnviroment));
      };

      $scope.mainConfig = {
        JSONMenu : './menu.json',
        autoInit : true
      };
      
      if (localStorageService.get('mainConfig')) {
        $scope.mainConfig = localStorageService.get('mainConfig');
      }


      $scope.$watchCollection('mainConfig',function() {
        localStorageService.set('mainConfig', $scope.mainConfig);
        masterOutCom._setAutoInit($scope.mainConfig.autoInit, getEnviromentParam);
      });

      if ($location.search()['jsonURL']) {
        $scope.mainConfig.JSONMenu = $location.search()['jsonURL'];
      }

      masterOutCom._setAutoInit($scope.mainConfig.autoInit);

      $scope.loadCurrentMenu = function() {
        $scope.change = 0;
	      $http
	          .get($scope.mainConfig.JSONMenu)
	          .success(function(data) { // unused: status, headers, config
	              $scope.master = data.master;
	              $scope.webviews = data.webviews;
	              $scope.menu = data.menu;
	             
	          });
      };

      /* Si en la carga del conrtolador tenemos autoinit === true, cargamos el también el menú */
      if ($scope.mainConfig.autoInit !== 0) {
        $scope.loadCurrentMenu();
      }

      $scope.calculateURL = function(view) {
        if (view.type === 'browser') {
          return view.location[$scope.appEnviroment.lang];
        }
        if (view.type === 'map') {
          return 'about:blank;';
        }
        return view.url;
      };

      $scope.launchResume = function() {
        masterOutCom.resume(getEnviromentParam());
      };

      $scope.launchInit = function() {
        masterOutCom.init(getEnviromentParam());
      };
      
      $scope.changeUrl = function($event, index) {
          $scope.webviews[index].url = $event.target.value;
      };

      $scope.changeMasterUrl = function($event) {
          $scope.master.url = $event.target.value;
      };
      
      $scope.titleBar = {
        backLabel : '',
        title : '',
        showBackButton : false
      };

      $scope.menuTrigger = function(menuOp) {
          
          var found = false;
          angular.forEach($scope.webviews, function(webview){
              found = found || (webview.tabName === menuOp);
              
          });

          if (found) {
            inCom.triggerAction('showTab', [menuOp]);
          } else {
            masterOutCom.menuButton(menuOp);
          } 
      };
      
      $scope.backTrigger = function() {
          masterOutCom.backButton();
          publicOutCom.backButton(_.find($scope.webviews,function(webview) {
              return webview.active;
          }).tabName);
      };

      inCom.registerAction('showTab', function(targetTab) {
          
          masterOutCom.beforeShow(targetTab);
          publicOutCom.beforeShow(targetTab);

          angular.forEach($scope.webviews, function(webview, index){
              $scope.webviews[index].active = (webview.tabName === targetTab);
          });
          masterOutCom.afterShow(targetTab);
          publicOutCom.afterShow(targetTab);
          
          $timeout(function() {
              $scope.$apply();
            }, 0, false);
          
      });
      
      inCom.registerAction('showBackButton', function(label) {
          $scope.titleBar.backLabel = label || '';
          $scope.titleBar.showBackButton = true;
          $scope.$apply();
      });

      inCom.registerAction('hideBackButton', function() {
        $scope.titleBar.backLabel = '';
        $scope.titleBar.showBackButton = false;
        $scope.$apply();
      });
        
      inCom.registerAction('setTitle', function(title) {
        $scope.titleBar.title = decodeURIComponent(title);
        $scope.$apply();
      });
      
      inCom.registerAction('deliverMessage', function(args) {
        var tabTarget = args.split('|')[0];
        var data = args.split('|')[1] || null;
        publicOutCom.injectMessage(tabTarget, encodeURIComponent(data));
      });
      
      inCom.registerAction('showLoading', function(message) {
        $scope.loading = true;
        $scope.loadingMessage = message;
        $scope.$apply();
      });

      inCom.registerAction('showLoading', function(message) {
        $scope.loading = true;
        $scope.loadingMessage = decodeURIComponent(message);
        $scope.$apply();
      });
      
      inCom.registerAction('hideLoading', function(message) {
        $scope.loading = false;
        $scope.loadingMessage = '';
        $scope.$apply();
      });

      inCom.registerAction('requestEnviroment',function() {
        masterOutCom.notifyEnviroment(getEnviromentParam());
      });


      /* COMWIFI ESPECIFIC! */

      $scope.wifi = {
        requested : false,
        signal : false,
        reachable : true,
        signalValue : '0',
        configured: false,
        error : '',
        okAction : function() {
          comwifiOutCom.notifyWiFiConnectionSuccess($scope.appEnviroment.ssid);
        },
        koAction : function() {
          comwifiOutCom.notifyWiFiConnectionError({error : $scope.wifi.error});
        },
        signalAction : function() {
          comwifiOutCom.notifyWiFiSignalStrength({reachable:$scope.wifi.reachable, configured: $scope.wifi.configured, quality: $scope.wifi.signalValue});
        }
      };
      $scope.sms = {
        register : false,
        connData : '',
        deregister : false,
        sourceNumber : 'n/a',
        fromNumber : '',
        text : '',
        smsSend : function() {
          comwifiOutCom.notifySMSArrived({number: $scope.sms.fromNumber, text: $scope.sms.text});
        }

      };

      inCom.registerAction('requestWiFiConnection',function(data) {
        $scope.wifi.connData = data;
        $scope.wifi.requested = true;
        $timeout(function() {
          $scope.wifi.requested = false;
          $scope.$apply();
        },3000);
        $scope.$apply();
      });

      inCom.registerAction('requestWiFiSignalStrength',function() {
        $scope.wifi.signal = true;
        $timeout(function() {
          $scope.wifi.signal = false;
          $scope.$apply();
        },3000);
        $scope.wifi.signalAction();
        $scope.$apply();
      });

      inCom.registerAction('registerSMSSource',function(sourceNumber) {
        $scope.sms.sourceNumber = sourceNumber;
        $scope.sms.register = true;
        $timeout(function() {
          $scope.sms.register = false;
          $scope.$apply();
        },3000);
        $scope.$apply();
      });

      inCom.registerAction('deRegisterSMSSource',function(sourceNumber) {
        $scope.sms.deregister = true;
        $scope.sms.sourceNumber = sourceNumber;
        $timeout(function() {
          $scope.sms.deregister = false;
          $scope.$apply();
        },3000);
        $scope.$apply();

      });
      

          
  });
