/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function ViewersModalController(authService, $q, $http, $location, $log, $scope, $timeout, $mdDialog, songRequestService, moment) {

    var vm = this;

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.getViewers = function(){
      console.log('get viewers');
      songRequestService
        .getViewers()
        .then(function(response) {
          console.log('got our viewers');
          vm.viewers = response;

        })
        .catch(function(err) {
          console.log('error getting viewers');
        });
    }

    vm.getViewers();




    vm.removeSongRequest = function(index){
      if(vm.viewers[index].song_request_count !== 0){
        vm.viewers[index].song_request_count = vm.viewers[index].song_request_count - 1;
        vm.saveViewers();
      }
    };

    vm.addSongRequest = function(index){
      if(vm.viewers[index].song_request_count !== 99){
        vm.viewers[index].song_request_count = vm.viewers[index].song_request_count + 1;
        vm.saveViewers();
      }
    };




    vm.saveViewers = function(){
      songRequestService
        .saveViewers(vm.viewers)
        .then(function() {
          console.log('saved viewers');
        })
        .catch(function(err) {
          //vm.saving = false;
          console.log('error saving viewers');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    };


    // on any update to the game scores, check that this is a valid score set.
    $scope.$watch('modalCtrl.searchText', function(newSettings, oldSettings) {

      console.log('BOT SETTINGS HAVE CHANGED');
      console.log(newSettings);

    }, true);



  }
  ViewersModalController.$inject = ['authService', '$q', '$http', '$location', '$log', '$scope', '$timeout', '$mdDialog', 'songRequestService', 'moment'];

  angular
    .module('uiApp')
    .controller('ViewersModalController', ViewersModalController);

})();
