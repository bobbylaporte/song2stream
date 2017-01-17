/**
 * @ngdoc function
 * @name uiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller for the dashboard.
 */

(function() {
  'use strict';

  function DashboardController(_, $q, $timeout, $location, songRequestService, errorService, socket) {
    var vm = this;
        vm.noticeText = [];



        // vm.loggedIntoTwitch = true;
        // vm.loggedIntoSpotify = true;


    // inviteService
    //   .listAll()
    //   .then(function(invites) {
    //     console.log('invites here');
    //     console.log(invites);
    //     vm.invites = invites;
    //   })
    //   .catch(function(err) {
    //     vm.saving = false;
    //     errorService.showError('There was an getting invites', err, { title: 'Cannot list' });
    //   });

    vm.selectOptions = {
      'alignText': [{label: 'Align Left', value: 'left'},{label: 'Align Right', value: 'right'}],
      'animationType': [{label: 'Fade Out', value: 'fade-out'}, {label: 'Slide Down from Top', value: 'slide-up'}, {label: 'Slide Up from Bottom', value: 'slide-down'}, {label: 'Slide In from the Left', value: 'slide-left'}, {label: 'Slide In from the Right', value: 'slide-right'}],
      'positionX': [{label: 'Align Left', value: 'left'}, {label: 'Align Right', value: 'right'}],
      'positionY': [{label: 'Align Top', value: 'top'}, {label: 'Align Bottom', value: 'bottom'}],
      'templateType': [{label: 'Single Line', value: 'single_line'}, {label: 'Two Lines', value: 'two_lines'}]
    };



    socket.emit('joined_match_lobby', {});
    // socket.on('update_match', function(data) {
    //   console.log(data);
    //   // console.log($('.chat-room').scrollHeight);



    //   // $('.chat-room').scrollTop = $('.chat-room').scrollHeight;
    //   // $('.task-list').scrollTop = $('.task-list').scrollHeight;

    //   // // if(angular.isDefined(vm.actionToast)){
    //   // //   $mdToast.hide(vm.actionToast);
    //   // // }

    //   // $mdToast.show(
    //   //   $mdToast.simple()
    //   //     .textContent(data.message)
    //   //     .position('top right')
    //   //     .hideDelay(2000)
    //   // );
    //   // console.log('load match data');
    //   // vm.loadMatch();
    // });





    socket.on('connect', function () {
      console.log('Form is connected to socket.');
    });


    socket.on('check_auth_file', function () {
      console.log('check_auth_file');
      vm.checkAuthFile();
    });

    socket.on('disconnect', function () {
      offline = true;
      console.log('Form disconnected from socket.');
      //goOffline('song2stream not detected');
    });


    socket.on('user_just_authed', function(track){
      console.log('User Just Authed with Twitch');
      vm.startBotServer();
    });


    socket.on('bot_connected', function(track){ // Will run when server has new track info
      console.log('BOT HAS STARTED');
      //$('.bot-status').html('<i class="fa"></i><span></span>');
      //$('.bot-status').removeClass('disconnected').addClass('connected').find('span').html('Twitch Bot is Connected <a class="stop-bot"><i class="fa fa-stop"></i>Stop Bot</a>');
      //updateTrack(track);
    });


    socket.on('song_request_added', function(track){ // Will run when server has new track info
      console.log('SONG REQUEST ADDED');
      vm.refreshList();
    });

    socket.on('spotify_connected', function(track){ // Will run when server has new track info
      console.log('SPOTIFY CONNECTED');
      //$('.spotify-status').removeClass('disconnected').addClass('connected').find('span').text('Spotify is Connected');
      //updateTrack(track);
    });


    socket.on('spotify_disconnected', function(track){ // Will run when server has new track info
      console.log('SPOTIFY DIS_CONNECTED');
      //$('.spotify-status').removeClass('connected').addClass('disconnected').find('span').text('Spotify is Disconnected');
      //updateTrack(track);
    });













    vm.checkAuthFile = function(){
      console.log('check auth file function');
      songRequestService
        .checkForAuthFile()
        .then(function() {
          console.log('we have an auth file, start the bot');
          vm.startBotServer();
        })
        .catch(function(err) {
          //vm.saving = false;
          console.log('error in auth service');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    }

    vm.checkAuthFile();




    vm.refreshList = function(){
      songRequestService
        .getSongRequests()
        .then(function(songs) {
          vm.songs = songs;
        })
        .catch(function(err) {
          //vm.saving = false;

          console.log('error');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    }

    vm.refreshList();


    vm.startBotServer = function(){
      songRequestService
        .startBotServer()
        .then(function() {
          console.log('bot started');
        })
        .catch(function(err) {
          //vm.saving = false;
          console.log('error');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    }


    vm.save = function(){
      songRequestService
        .saveUserPreferences(vm.config)
        .then(function() {
          console.log('bot started');
        })
        .catch(function(err) {
          //vm.saving = false;
          console.log('error');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    }



    songRequestService
      .getUserPreferences()
      .then(function(preferences) {
        vm.config = preferences;
      })
      .catch(function(err) {
        //vm.saving = false;
        console.log('error');
        //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
      });






    vm.addSong = function(index, uri){
      vm.noticeText[index] = 'Adding Song to Playlist...';
      console.log(uri);
      songRequestService
        .addRequestToPlaylist(uri)
        .then(function() {
          console.log('added song');
          vm.removeSong(index, uri, true);
        })
        .catch(function(err) {
          //vm.saving = false;

          console.log('error');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    }

    vm.removeSong = function(index, uri, skipNotice){
      if(!skipNotice){
        vm.noticeText[index] = 'Removing Song...';
      }
      console.log('remove this URI');
      console.log(uri);
      songRequestService
        .removeSongRequest(index)
        .then(function() {
          console.log('removed song');
          vm.noticeText[index] = '';
          console.log('refresh list');
          vm.refreshList();

        })
        .catch(function(err) {
          //vm.saving = false;

          console.log('error');
          //errorService.showError('There was an error getting the songs', err, { title: 'Cannot get Songs' });
        });
    }


  }
  DashboardController.$inject = ['_', '$q', '$timeout', '$location', 'songRequestService', 'errorService', 'socket'];

  angular
    .module('uiApp')
    .controller('DashboardController', DashboardController);

})();
