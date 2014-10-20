'use strict';

/**
 * @ngdoc overview
 * @name anvil2App
 * @description
 * # anvil2App
 *
 * Main module of the application.
 */
angular
  .module('anvil2App', [
	'LocalStorageModule',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]);