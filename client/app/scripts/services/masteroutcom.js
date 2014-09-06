'use strict';

/**
 * @ngdoc service
 * @name anvil2App.outCom
 * @description
 * # outCom
 * Factory in the anvil2App.
 */
angular.module('anvil2App')
  .factory('masterOutCom', function () {
    // Service logic

    var masterIframe = angular.element("iframe.master:eq(0)");
    
    var _sendMessage = function(msg) {
        masterIframe[0].contentWindow.postMessage(msg, "*");
    }
    
    masterIframe.bind('load', function() {
        _sendMessage('init');
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
      init : function() {
          _sendMessage('init');
      },
      backButton : function() {
          _sendMessage('backButton');
      },
      menuButton : function(menuOp) {
          _sendMessage('menuButton:' + menuOp);
      }
    };
  });
