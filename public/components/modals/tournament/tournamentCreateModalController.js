/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function TournamentCreateModalController(authService, $q, $http, $location, $log, $scope, $timeout, $mdDialog) {

    var vm = this;


    vm.cancel = function() {
      $mdDialog.cancel();
    };


  }
  TournamentCreateModalController.$inject = ['authService', '$q', '$http', '$location', '$log', '$scope', '$timeout', '$mdDialog'];

  angular
    .module('uiApp')
    .controller('TournamentCreateModalController', TournamentCreateModalController);

})();
