'use strict';

/**
 * @ngdoc service
 * @name anvil2App.comwifiOutCom
 * @description
 * # comwifiOutCom
 * Service in the anvil2App.
 */
angular.module('anvil2App')
  .service('comwifiOutCom', function ($window) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	var masterIframe = angular.element("iframe.master:eq(0)");
    
    var _sendMessage = function(msg) {
        masterIframe[0].contentWindow.postMessage("master:" + msg, "*");
    }
		
	
	var encodeParam = function(param) {
          return encodeURIComponent(param).
                    replace(/['()]/g, $window.escape).
                        replace(/\*/g, '%2A').
                            replace(/%(?:7C|60|5E)/g, $window.unescape);

      };
      
    var prepareMessage = function(msg) {
      return encodeParam(angular.toJson(msg, false));
    };

    // Public API here
    return {
      notifySMSArrived : function (data) {
          _sendMessage('notifySMSArrived:' + prepareMessage(data));
      },
      notifyWiFiConnectionSuccess : function (ssid) {
          _sendMessage('notifyWiFiConnectionSuccess:' + ssid);
      },
      notifyWiFiConnectionError : function(error) {
          _sendMessage('notifyWiFiConnectionError:' + prepareMessage(error));
      },
      notifyWiFiSignalStrength : function(data) {
          _sendMessage('notifyWiFiSignalStrength:' + prepareMessage(data));
      }
      
    };

  });
