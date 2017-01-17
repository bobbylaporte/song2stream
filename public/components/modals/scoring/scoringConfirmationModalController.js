/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function ScoringConfirmationModalController($scope, $q, $timeout, $mdToast, $mdDialog, tournamentService, errorService) {
    var vm = this;

        var score_one = _.filter($scope.match.games, function(o) { return o.score_one > o.score_two; });
        var score_two = _.filter($scope.match.games, function(o) { return o.score_one < o.score_two; });

        if(score_one.length > score_two.length){
          $scope.winner = 'one';
          $scope.loser = 'two';
        }else{
          $scope.winner = 'two';
          $scope.loser = 'one';
        }


    vm.cancel = function() {
      $mdDialog.cancel();
    };
    console.log('in confirmation modal');

    console.log($scope);

    vm.saveMatchData = function() {
      $mdDialog.hide();
    };


  }
  ScoringConfirmationModalController.$inject = ['$scope', '$q', '$timeout', '$mdToast', '$mdDialog', 'tournamentService', 'errorService'];

  angular
    .module('uiApp')
    .controller('ScoringConfirmationModalController', ScoringConfirmationModalController);

})();
