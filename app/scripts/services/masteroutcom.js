'use strict';

/**
 * @ngdoc service
 * @name anvil2App.outCom
 * @description
 * # outCom
 * Factory in the anvil2App.
 */
angular.module('anvil2App')
  .factory('masterOutCom', ['$timeout', function ($timeout) {
    // Service logic

    var masterIframe = angular.element("iframe.master:eq(0)");

    var _sendMessage = function(msg) {
        masterIframe[0].contentWindow.postMessage("master:" + msg, "*");
    }
    var autoInit = false;
    var loadCallback = false;

    masterIframe.bind('load', function() {
        if (angular.isFunction(loadCallback)) {
            $timeout(loadCallback, 500);
        }
    });

    // Public API here
    return {
      beforeShow : function (tabName) {
          _sendMessage('beforeShow:' + tabName);
      },
      afterShow : function (tabName) {
          _sendMessage('afterShow:' + tabName);
      },
      resume : function() {
          _sendMessage('resume');
      },
      init : function(data) {
          _sendMessage('init:' + data);
      },
      backButton : function() {
          _sendMessage('backButton');
      },
      menuButton : function(menuOp) {
          _sendMessage('menuButton:' + menuOp);
      },
      _setLoadCallback : function(callback) {
          loadCallback = callback;
      }
    };
  }]);
