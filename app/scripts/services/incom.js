'use strict';

/**
 * @ngdoc service
 * @name anvil2App.inCom
 * @description
 * # inCom
 * Factory in the anvil2App.
 */
angular.module('anvil2App')
  .factory('inCom', function ($window) {

    var actions = {};
      
    angular.element($window).bind('message', function(e)  {
        
        var action = e.originalEvent.data.split(":")[0];
        if (typeof actions[action] == 'function') {
            actions[action](e.originalEvent.data.split(":")[1] || undefined);
        } 
    });
      
    return {
      registerAction: function (action, fn) {
        actions[action] = fn;
        return this;
      },
      triggerAction : function(action, args) {
          actions[action].apply(this, args);
      }
    };
  });

  