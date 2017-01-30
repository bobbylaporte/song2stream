/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function TournamentCreateModalController(authService, $q, $http, $location, $log, $scope, $timeout, $mdDialog, songRequestService) {

    var vm = this;

    vm.cancel = function() {
      $mdDialog.cancel();
    };


    vm.getBotSettings = function(){
      console.log('get bot settings function');
      songRequestService
        .getBotSettings()
        .then(function(response) {
          console.log('got our settings');
          console.log(response);
          vm.settings = response;

          if(angular.isDefined(vm.settings.playlistURI)){
            vm.playlistStatus = 'valid';
          }
        })
        .catch(function(err) {
          console.log('error getting settings file, set some defaults');
          // Defaults
          vm.settings = {
            viewerType: "subscriber",
            numberOfRequests: 1,
            requestInterval: "hour"
          };
        });
    }

    vm.getBotSettings();

    vm.saveBotSettings = function(){
      songRequestService
        .saveBotSettings(vm.settings)
        .then(function() {
          console.log('saved bot settings');
        })
        .catch(function(err) {
          //vm.saving = false;
          console.log('error saving bot settings');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    };



    vm.getBlacklist = function(){
      console.log('get bot settings function');
      songRequestService
        .getBlacklist()
        .then(function(response) {
          console.log('got our blacklist');
          vm.blacklist = response;

        })
        .catch(function(err) {
          console.log('error getting blacklist');
        });
    }

    vm.getBlacklist();

    vm.saveBlacklist = function(){
      songRequestService
        .saveBlacklist(vm.blacklist)
        .then(function() {
          console.log('saved blacklist');
          vm.blacklistSongStatus = 'valid';
          // Set timer to clear status after a few seconds.

          vm.blacklistSong = '';
        })
        .catch(function(err) {
          //vm.saving = false;
          console.log('error saving blacklist');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    };


    vm.removeSongFromBlacklist = function(index, uri){
      console.log('remove this URI');
      console.log(uri);
      songRequestService
        .removeSongFromBlacklist(index)
        .then(function() {
          console.log('removed song from blacklist');
          console.log('refresh list');
          vm.getBlacklist();

        })
        .catch(function(err) {
          //vm.saving = false;

          console.log('error');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    }





    vm.getPlaylist = function(playlistID){
      console.log('get playlist function');
      songRequestService
        .getPlaylist(playlistID)
        .then(function(response) {
          if(angular.isDefined(response.name)){

            vm.settings.playlistURI = response.uri;
            vm.settings.playlistName = response.name;

            vm.playlistStatus = 'valid';
            //vm.playlist = response;
          }
        })
        .catch(function(err) {
          console.log('not a valid playlist URI');
          //vm.loggedIntoTwitch = false;
          vm.playlistStatus = 'invalid';
        });
    }


    vm.checkPlaylist = function(){
      // console.log('$scope');
      // console.log($scope);
      // console.log('vm');
      // console.log(vm);
      // vm.settings.playlistURI
      // e.g. spotify:user:ominoustoad:playlist:5hWjRuejrECK9Cb7B6V9QN
      if(angular.isDefined(vm.settings.playlistURI)){
        var arr = vm.settings.playlistURI.split(':');
        var username = arr[2];
        //TODO: Check that this username matches users logged in Spotify username
        var playlistID = arr[4];

        console.log(playlistID);
        vm.getPlaylist(playlistID);
      }else{
        vm.playlistStatus = 'invalid';
        //vm.playlist = null;
      }
    }


    vm.getSong = function(songID){
      var id = songID;
      console.log('get song function');
      songRequestService
        .getSong(songID)
        .then(function(response) {

          console.log('get song response');
          console.log(response);

          if(angular.isDefined(response.name)){
            //vm.settings.playlistURI = response.uri;
            //vm.settings.playlistName = response.name;
            //vm.blacklistSongStatus = 'valid';


            // [{"name":"Never Gonna Give You Up",
            //   "artist":"Rick Astley",
            //   "id":"7GhIk7Il098yCjg4BQjzvb",
            //   "uri":"spotify:track:7GhIk7Il098yCjg4BQjzvb"}]

            var newSong = {};

            newSong.name = response.name;
            newSong.artist = response.artists[0].name;
            newSong.id = response.id;
            newSong.uri = response.uri;

            if(angular.isDefined(vm.blacklist)){
              vm.blacklist.push(newSong);
            }else{
              vm.blacklist = [];
              vm.blacklist.push(newSong);
            }

            // Verified that it's a real song. Now add it.
            console.log('save blacklist');
            vm.saveBlacklist();


            //vm.playlist = response;
          }
        })
        .catch(function(err) {
          console.log('not a valid song URI');
          //vm.loggedIntoTwitch = false;
          vm.blacklistSongStatus = 'invalid';
        });
    }


    vm.checkSong = function(){
      // spotify:track:7GhIk7Il098yCjg4BQjzvb


      if(angular.isDefined(vm.blacklistSong) && vm.blacklistSong !== ''){
        var arr = vm.blacklistSong.split(':');
        var songID = arr[2];


        if(angular.isDefined(songID)){
          vm.getSong(songID);
        }else{
          vm.blacklistSongStatus = 'invalid';
        }

      }else{
        vm.blacklistSongStatus = 'invalid';
        //vm.playlist = null;
      }
    }

    vm.disconnectPlaylist = function(){
      vm.playlistStatus = '';
      delete vm.settings.playlistURI;
      delete vm.settings.playlistName;
    }


    // on any update to the game scores, check that this is a valid score set.
    $scope.$watch('modalCtrl.settings', function(newSettings, oldSettings) {

      console.log('BOT SETTINGS HAVE CHANGED');
      console.log(newSettings);

    }, true);



  }
  TournamentCreateModalController.$inject = ['authService', '$q', '$http', '$location', '$log', '$scope', '$timeout', '$mdDialog', 'songRequestService'];

  angular
    .module('uiApp')
    .controller('TournamentCreateModalController', TournamentCreateModalController);

})();
