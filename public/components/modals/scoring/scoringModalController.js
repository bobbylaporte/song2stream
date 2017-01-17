/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function ScoringModalController($rootScope, $scope, $document, $q, $timeout, $mdDialog, $mdToast, tournamentService, errorService) {
    var vm = this;

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    console.log($scope);

    // args are the game index, and the winner index (both zero based)
    vm.quickScore = function(game, winner){
      if(winner === 0){
        $scope.match.games[game].score_one = 1;
        $scope.match.games[game].score_two = 0;
      }
      if(winner === 1){
        $scope.match.games[game].score_one = 0;
        $scope.match.games[game].score_two = 1;
      }
    };

    vm.confirmScore = function(ev){

      var confirm = $mdDialog.show({
        controller: 'ScoringConfirmationModalController as modalCtrl',
        templateUrl: '/components/modals/scoring/scoringConfirmationModalView.html',
        parent: angular.element($document.body),
        scope: $scope,
        targetEvent: ev,
        clickOutsideToClose: true,
        disableParentScroll: true,
        preserveScope: true,
        onComplete: function() {
          // It's open
        }
      })
      .then(function() {
        // Score Data COnfirmed. Save it.
        tournamentService
          .scoreMatch($scope.match.tournament_id, $scope.match)
          .then(function() {
            vm.saving = false;

            $rootScope.$broadcast('match-scored');

            $mdToast.show(
              $mdToast.simple()
                .content('Match Completed')
                .position('top right')
                .hideDelay(5000)
            );
          })
          .catch(function(err) {
            vm.saving = false;
            errorService.showError('There was an error saving the tournament', err, { title: 'Cannot save' });
          });

      }, function() {
        // Cancelled, re-open the previous modal
        console.log('cancelled confirmation');
      });

    };

    vm.save = function(ev){
      // Save Scores
      tournamentService
        .saveMatch($scope.match.tournament_id, $scope.match)
        .then(function() {
          vm.saving = false;

          $mdDialog.hide();

          $mdToast.show(
            $mdToast.simple()
              .content('Saved Game Scores')
              .position('top right')
              .hideDelay(5000)
          );
        })
        .catch(function(err) {
          vm.saving = false;
          errorService.showError('There was an error saving the tournament', err, { title: 'Cannot save' });
        });
    };


    vm.disabledInput = function(index){

      var team_one_wins = _.filter($scope.match.games, function(o) { return (o.score_one > o.score_two) && (o.score_one !== null && o.score_two !== null); }).length;
      var team_two_wins = _.filter($scope.match.games, function(o) { return (o.score_one < o.score_two) && (o.score_one !== null && o.score_two !== null); }).length;

      if(index === 0){
        return false;
      }else{
        console.log($scope.match.games[index-1].score_one);
        console.log($scope.match.games[index-1].score_two);
        if(angular.isUndefined($scope.match.games[index-1].score_one) || $scope.match.games[index-1].score_one === null || angular.isUndefined($scope.match.games[index-1].score_two) || $scope.match.games[index-1].score_two === null){
          // delete $scope.match.games[index-1].score_one;
          // delete $scope.match.games[index-1].score_two;
          return true;
        }

        // if the minimum wins is met, disabled all unscored games
        if((team_one_wins === $scope.match.minimum_games) ||
           (team_two_wins === $scope.match.minimum_games)){

          if(angular.isUndefined($scope.match.games[index].score_one) || $scope.match.games[index].score_one === null || angular.isUndefined($scope.match.games[index].score_two) || $scope.match.games[index].score_two === null){
            return true;
          }

        }


      }
    };


    // on any update to the game scores, check that this is a valid score set.
    $scope.$watch('match', function(newMatch, oldMatch) {
      vm.valid = false;
      vm.errors = [];

      var team_one_wins = _.filter($scope.match.games, function(o) { return (o.score_one > o.score_two) && (o.score_one !== null && o.score_two !== null); }).length;
      var team_two_wins = _.filter($scope.match.games, function(o) { return (o.score_one < o.score_two) && (o.score_one !== null && o.score_two !== null); }).length;


      var tied_games = _.filter($scope.match.games, function(o) { return (o.score_one === o.score_two) && (o.score_one !== null && o.score_two !== null); }).length;
      // console.log($scope.match.games);
      if(tied_games !== 0){
       vm.errors.push('no games are allowed to be tied');
      }


      // firstly, no matches are allowed to tie
      if(team_one_wins !== team_two_wins){
        //now check if either team has the minimum games needed to win
        if((team_one_wins === $scope.match.minimum_games) ||
           (team_two_wins === $scope.match.minimum_games)){
          vm.valid = true;
        }else{
          if(team_one_wins < $scope.match.minimum_games && team_two_wins < $scope.match.minimum_games){
            vm.errors.push('Neither team has the minimum wins required ('+ $scope.match.minimum_games +')');
          }

          if(team_one_wins > $scope.match.minimum_games || team_two_wins > $scope.match.minimum_games){
            vm.errors.push('An additional game has been scored. remove that.');
          }
        }
      }else{
        vm.errors.push('The match is currently tied: ' + team_one_wins + ':' + team_two_wins );
      }
    }, true);






  }
  ScoringModalController.$inject = ['$rootScope','$scope', '$document', '$q', '$timeout', '$mdDialog', '$mdToast', 'tournamentService', 'errorService'];

  angular
    .module('uiApp')
    .controller('ScoringModalController', ScoringModalController);

})();
