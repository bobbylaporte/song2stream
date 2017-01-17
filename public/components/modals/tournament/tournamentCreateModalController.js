/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function TournamentCreateModalController(authService, $q, $http, $location, $log, $scope, $timeout, $mdDialog, tournamentService) {

    var vm = this;

    $scope.isLoggedIn = authService.isLoggedIn();
    if(!$scope.isLoggedIn){
      $location.path('login');
    }


    vm.save = function(ev){
      // Save The Team
      console.log('vm tournament');
      console.log(vm.tournament);

      tournamentService
        .createTournament(vm.tournament)
        .then(function(tournament) {
          // console.log('team saved');
          // console.log(team);
          //$mdDialog.hide();
          // Redirect to the Editing Page for this Team
          $location.path('/tournament/' + tournament._id +  '/edit');

        })
        .catch(function(err) {
          vm.saving = false;
          errorService.showError('There was an error saving the tournament', err, { title: 'Cannot save' });
        });
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };


  }
  TournamentCreateModalController.$inject = ['authService', '$q', '$http', '$location', '$log', '$scope', '$timeout', '$mdDialog', 'tournamentService'];

  angular
    .module('uiApp')
    .controller('TournamentCreateModalController', TournamentCreateModalController);

})();
