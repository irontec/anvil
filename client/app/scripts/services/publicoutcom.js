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
    
    var _sendMessage = function(domIframe, msg) {
        domIframe.contentWindow.postMessage(msg, "*");
    }

    // Public API here
    return {
        injectMessage : function (tabTarget, message) {
            var theIframe = _getIframe(tabTarget);
            console.log("INJECTING TO", theIframe);
            if (theIframe) {
                _sendMessage(theIframe, "injectMessage:" + message);
            }
        },
        beforeShow : function (tabTarget) {
            var theIframe = _getIframe(tabTarget);
            
            console.log("BeforeShow to", theIframe);
            if (theIframe) {
                _sendMessage(theIframe, 'beforeShow:' + tabTarget);
            }
        },
        afterShow : function (tabTarget) {
            var theIframe = _getIframe(tabTarget);
            if (theIframe) {
                _sendMessage(theIframe, 'afterShow:' + tabTarget);
            }
        },
        backButton : function (tabTarget) {
            var theIframe = _getIframe(tabTarget);
            if (theIframe) {
                _sendMessage(theIframe, 'backButton:' + tabTarget);
            }
        },
    };
  });
