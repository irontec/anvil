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
  .controller('MainCtrl',(function ($rootScope, $scope, $timeout, $http, localStorageService, masterOutCom, publicOutCom, inCom) {

      $scope.master = {url:'about:blank'};
      $scope.webviews = [];
      $scope.menu = [];
      $scope.mainConfig = {
        JSONMenu : 'http://test1.irontec.com/demo/menu.php?callback=JSON_CALLBACK',
        autoInit : true
      };
      
      if (localStorageService.get('mainConfig')) {
        $scope.mainConfig = localStorageService.get('mainConfig');
      }


      $scope.$watchCollection('mainConfig',function() {
        localStorageService.set('mainConfig', $scope.mainConfig);
        masterOutCom._setAutoInit($scope.mainConfig.autoInit);
      });

      masterOutCom._setAutoInit($scope.mainConfig.autoInit);

      $scope.loadCurrentMenu = function() {
        $scope.change = 0;
	      $http
	          .jsonp($scope.mainConfig.JSONMenu)
	          .success(function(data, status, headers, config) {
	              $scope.master = data.master;
	              $scope.webviews = data.webviews;
	              $scope.menu = data.menu;
	             
	          });
      };


      /* Si en la carga del conrtolador tenemos autoinit === true, cargamos el también el menú */
      if ($scope.mainConfig.autoInit != 0) {
        $scope.loadCurrentMenu();
      }


      $scope.launchResume = function() {
          masterOutCom.resume();
      }

      $scope.launchInit = function() {
          masterOutCom.init();
      }
      
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
          angular.forEach($scope.webviews, function(webview, index){
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
          publicOutCom.injectMessage(tabTarget, data);
          
      });
          
  }));
