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
  .controller('MainCtrl',function ($window, $location, $rootScope, $scope, $timeout, $http, localStorageService, masterOutCom, publicOutCom, inCom) {

      var _ = $window._;

      $scope.master = {url:'about:blank'};
      $scope.webviews = [];
      $scope.menu = [];
      $scope.loading = false;
      $scope.loadingMessage = '';

      $scope.lang = 'es';

      $scope.mainConfig = {
        JSONMenu : './menu.json',
        autoInit : true,
        lang: 'es',
        imeiCheck : true,
        imei: '',
        imsiCheck : true,
        imsi: ''
      };

      if (localStorageService.get('mainConfig')) {
        $scope.mainConfig = localStorageService.get('mainConfig');
      }


      $scope.$watchCollection('mainConfig',function() {
        localStorageService.set('mainConfig', $scope.mainConfig);
      });

      if ($location.search()['jsonURL']) {
        $scope.mainConfig.JSONMenu = $location.search()['jsonURL'];
      }
      masterOutCom._setLoadCallback(function() {
        if ($scope.mainConfig.autoInit === true) {
          $scope.launchInit();
        }
      });

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


      $scope.calculateURL = function(view) {
        if (view.type === 'browser') {
          return view.location[$scope.lang];
        }
        if (view.type === 'map') {
          return 'about:blank;';
        }
        if (!view.url) {
          return 'about:blank';
        }

        return view.url;
      };

      /* Si en la carga del conrtolador tenemos autoinit === true, cargamos el también el menú */
      if ($scope.mainConfig.autoInit === true) {
        $scope.loadCurrentMenu();
      }


      $scope.launchResume = function() {
          masterOutCom.resume();
      };

      $scope.launchInit = function() {
          var config = null;
          var data = {
            lang : $scope.mainConfig.lang
          };

          if ($scope.mainConfig.imeiCheck == 1) {
            data.imei = $scope.mainConfig.imei;
          }
          if ($scope.mainConfig.imsiCheck == 1) {
            data.imsi = $scope.mainConfig.imsi;
          }
          $scope.lang = data.lang;
          config = encodeURIComponent(angular.toJson(data));
          masterOutCom.init(config);
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
        $scope.loadingMessage = decodeURIComponent(message);
        $scope.$apply();
      });

      inCom.registerAction('hideLoading', function(message) {
        $scope.loading = false;
        $scope.loadingMessage = '';
        $scope.$apply();
      });

  });
