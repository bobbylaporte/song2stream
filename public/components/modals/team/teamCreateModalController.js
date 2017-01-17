/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function TeamCreateModalController(authService, $q, $http, $location, $log, $scope, $timeout, $mdDialog, teamService) {

    var vm = this;

    $scope.isLoggedIn = authService.isLoggedIn();
    if(!$scope.isLoggedIn){
      $location.path('login');
    }


    vm.save = function(ev){
      // Save The Team
      console.log('vm team');
      console.log(vm.team);

      teamService
        .createTeam(vm.team)
        .then(function(team) {
          // console.log('team saved');
          // console.log(team);
          //$mdDialog.hide();
          // Redirect to the Editing Page for this Team
          $location.path('/team/' + team._id +  '/edit');

        })
        .catch(function(err) {
          vm.saving = false;
          errorService.showError('There was an error saving the team', err, { title: 'Cannot save' });
        });
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };


  }
  TeamCreateModalController.$inject = ['authService', '$q', '$http', '$location', '$log', '$scope', '$timeout', '$mdDialog', 'teamService'];

  angular
    .module('uiApp')
    .controller('TeamCreateModalController', TeamCreateModalController);

})();
