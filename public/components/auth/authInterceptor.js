/**
 * @ngdoc function
 * @name uiApp.authInterceptor
 * @description
 * # authInterceptor
 * Interceptor on the HTTPRequest to route 403s responses to the login page.
 */

(function() {
  'use strict';

angular.module('uiApp').factory('authInterceptor', function ($log, $q, $injector, $window, $location, $cookies) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($cookies.get('access_token')) {
        config.headers.Authorization = 'Bearer ' + $cookies.get('access_token');
      }
      return config;
    }
  };
});

angular.module('uiApp').config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

}());
