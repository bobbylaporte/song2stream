/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function LoginController($q, $timeout, $location, authService, Page, ENV) {
    var vm = this;
    if(authService.isLoggedIn()){
      $location.path("/user/dashboard");
    }

    vm.login = function(type){
      window.location = ENV.BASE_URL + '/user/auth/' + type;
    };

  }
  LoginController.$inject = ['$q', '$timeout', '$location', 'authService', 'Page', 'ENV'];

  angular
    .module('uiApp')
    .controller('LoginController', LoginController);

})();
