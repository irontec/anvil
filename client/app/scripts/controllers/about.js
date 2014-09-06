'use strict';

/**
 * @ngdoc function
 * @name anvil2App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the anvil2App
 */
angular.module('anvil2App')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
