'use strict';

/**
 * @ngdoc service
 * @name anvil2App.publicOutCom
 * @description
 * # publicOutCom
 * Service in the anvil2App.
 */
angular.module('anvil2App')
  .service('publicOutCom', function publicOutCom() {

    var _getIframe = function(tabName) {
        var theIframe = angular.element("iframe[data-tabName="+tabName+"]:eq(0)");
        if (theIframe.length > 0) {
            return theIframe[0];
        } else {
            return false;
        }
        
    }
    
    var _sendMessage = function(tabTarget, msg) {
        var domIframe = _getIframe(tabTarget);
        domIframe.contentWindow.postMessage("public:" + msg, "*");
    }

    // Public API here
    return {
        injectMessage : function (tabTarget, message) {
            _sendMessage(tabTarget, "injectMessage:" + message);
        },
        beforeShow : function (tabTarget) {
            _sendMessage(tabTarget, 'beforeShow:' + tabTarget);
        },
        afterShow : function (tabTarget) {
            _sendMessage(tabTarget, 'afterShow:' + tabTarget);
        },
        backButton : function (tabTarget) {
            _sendMessage(tabTarget, 'backButton:' + tabTarget);
        },
    };
  });
