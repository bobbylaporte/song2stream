/**
 * @ngdoc function
 * @name offersUiApp.services:authServices
 * @description
 * # authServices
 * Services for authentication and setting
 * and getting user credentials.
 */

(function() {
  'use strict';

  function authService($http, $q, $window, $location, $timeout, $mdToast, $cookies) {
    return {
      isLoggedIn: function checkCreds() {
        return angular.isDefined($cookies.get('access_token'));
      },
      getToken: function getToken() {
        return $cookies.get('access_token') || '';
      },
      setToken: function setToken(token) {
        //$window.localStorage.access_token = token;
        $cookies.put('access_token', token);
        //$http.defaults.headers.common.Authorization = 'Bearer ' + token;
      },
      setUser: function setUser(user){
        //$window.localStorage.user = user;
        $cookies.put('user', user);
      },
      getUser: function getUser(){
        //return JSON.parse($window.localStorage.user);
        return JSON.parse($cookies.get('user'));
      },
      redirectToLogin: function redirectToLogin() {
        $location.path('login');
      },
      logOut: function logOut() {
        //delete $window.localStorage.user;
        // delete $window.localStorage.access_token;
        $cookies.remove('user');
        $cookies.remove('access_token');
        $mdToast.show(
            $mdToast.simple()
              .content('User Logged Out')
              .position('top right')
              .hideDelay(5000)
          );
        $location.path('user/dashboard');
      }
    };
  }

  authService.$inject = ['$http', '$q', '$window', '$location', '$timeout', '$mdToast', '$cookies'];

  angular
    .module('uiApp')
    .factory('authService', authService);

})();
