/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function InviteModalController(authService, $q, $http, $location, $log, $scope, $timeout, $mdDialog, teamService, inviteService) {

    var vm = this;

    console.log($scope.title);
    console.log($scope.invitee);
    console.log($scope.roles);
    console.log($scope.destination);

    vm.roles = $scope.roles;
    vm.title = $scope.title;

    // Default to Lowest possible role
    vm.selectedRole = $scope.roles[$scope.roles.length];

    vm.isLoggedIn = authService.isLoggedIn();
    if(!vm.isLoggedIn){
      $location.path('login');
    }

    if(vm.isLoggedIn){
      vm.user = authService.getUser();
    }


   vm.querySearch = function(query) {
      var deferred = $q.defer();


      console.log($scope.destination_type);
      console.log($scope.invitee_type);

      if($scope.destination_type === 'team' || $scope.destination_type === 'organization'){
        teamService
          .findPlayer(query)
          .then(function(players) {
            deferred.resolve(players);
          })
          .catch(function(err) {
            vm.saving = false;
            errorService.showError('There was finding the player', err, { title: 'Cannot save' });
          });
      }

      console.log($scope);

      if($scope.destination_type === 'tournament'){
        if($scope.invitee_type === 'team'){
        teamService
          .findTeam(query)
          .then(function(teams) {
            deferred.resolve(teams);
          })
          .catch(function(err) {
            vm.saving = false;
            errorService.showError('There was finding the team', err, { title: 'Cannot save' });
          });
        }
        if($scope.invitee_type === 'user'){
          teamService
            .findPlayer(query)
            .then(function(players) {
              deferred.resolve(players);
            })
            .catch(function(err) {
              vm.saving = false;
              errorService.showError('There was finding the player', err, { title: 'Cannot save' });
            });
        }
      }

      return deferred.promise;

    }


    vm.selectUser = function(user){
      vm.userSelected = true;
      //vm.selectedUser is our current user
      vm.player = vm.selectedUser;
    };

    vm.save = function(ev){

      var invite = {
        invitee_type : $scope.invitee_type,
        role : vm.selectedRole,
        destination_type: $scope.destination_type,
        destination: $scope.destination,
        sender: vm.user._id,
        recipient: vm.player._id
      };


      inviteService
        .send(invite)
        .then(function(team) {
          console.log('invite was sent');
          $mdDialog.cancel();
        })
        .catch(function(err) {
          vm.saving = false;
          errorService.showError('There was an error sending the invite', err, { title: 'Cannot save' });
        });
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };


  }
  InviteModalController.$inject = ['authService', '$q', '$http', '$location', '$log', '$scope', '$timeout', '$mdDialog', 'teamService', 'inviteService'];

  angular
    .module('uiApp')
    .controller('InviteModalController', InviteModalController);

})();
