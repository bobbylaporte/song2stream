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

        vm.loggedIntoSpotify = false;
        vm.loggedIntoTwitch = false;

        vm.localSpotifyStatus = '';
        vm.localSpotifyStatusText = 'Detecting...';

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

    socket.on('disconnect', function () {
      offline = true;
      console.log('Form disconnected from socket.');
      //goOffline('song2stream not detected');
    });


    socket.on('check_twitch_auth_file', function () {
      console.log('check_twitch_auth_file');
      vm.checkTwitchAuthFile();
    });

    socket.on('twitch_user_just_authed', function(track){
      console.log('User Just Authed with Twitch');
      vm.checkTwitchAuthFile()
    });


    socket.on('check_spotify_auth_file', function () {
      console.log('check_spotify_auth_file');
      vm.checkSpotifyAuthFile();
    });

    socket.on('spotify_user_just_authed', function(track){
      console.log('User Just Authed with Spotify');
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
      console.log('LOCAL SPOTIFY CONNECTED');
      vm.localSpotifyStatus = 'connected';
      vm.localSpotifyStatusText = 'Connected';
      //$('.spotify-status').removeClass('disconnected').addClass('connected').find('span').text('Spotify is Connected');
      //updateTrack(track);
    });


    socket.on('spotify_disconnected', function(track){ // Will run when server has new track info
      console.log('LOCAL SPOTIFY DIS_CONNECTED');
      vm.localSpotifyStatus = 'disconnected';
      vm.localSpotifyStatusText = 'Disconnected';
      //$('.spotify-status').removeClass('connected').addClass('disconnected').find('span').text('Spotify is Disconnected');
      //updateTrack(track);
    });






    vm.connect = function(){
      console.log('check twitch auth file function');
      songRequestService
        .connect()
        .then(function() {
          console.log('we called connect');
        })
        .catch(function(err) {
          console.log('failed to call connect');
        });
    }






    vm.checkTwitchAuthFile = function(){
      console.log('check twitch auth file function');
      songRequestService
        .checkForTwitchAuthFile()
        .then(function() {
          console.log('we have a twich auth file, start the bot');
          vm.loggedIntoTwitch = true;
          vm.startBotServer();
        })
        .catch(function(err) {
          console.log('error in auth service');
          vm.loggedIntoTwitch = false;
        });
    }

    vm.checkTwitchAuthFile();



    vm.checkSpotifyAuthFile = function(){
      console.log('check spotify auth file function');
      songRequestService
        .checkForSpotifyAuthFile()
        .then(function() {
          console.log('we have a spotify auth file');
          vm.loggedIntoSpotify = true;
        })
        .catch(function(err) {
          console.log('error in spotify auth service');
          vm.loggedIntoSpotify = false;
        });
    }

    vm.checkSpotifyAuthFile();




    vm.openAuthWindow = function(service){
      window.open('http://twitch-toad.rhcloud.com/auth/' + service, 'Log In', 'width=300,height=600,resizable,scrollbars=no,status=0');
    }



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


    // Test Initial Connection
    songRequestService
      .getTrack()
      .then(function() {
        vm.localSpotifyStatus = 'connected';
        vm.localSpotifyStatusText = 'Connected';
      })
      .catch(function(err) {
        vm.localSpotifyStatus = 'disconnected';
        vm.localSpotifyStatusText = 'Disconnected';
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


    vm.logout = function(service){
      // $.ajax({
      //   method: "POST",
      //   url: "http://localhost:1337/auth/twitch/delete_user"
      // }).done(function( msg ) {
      //   var html = '<a href="http://twitch-toad.rhcloud.com/auth/twitch" class="big-twitch-button" target="_blank"><i class="fa fa-twitch"></i>Connect with Twitch</a>';
      //   $('.bot-status').html(html);
      // }).fail(function( jqXHR, textStatus ) {
      //   alert( "Error Deleting: " + textStatus);
      // });


      songRequestService
        .logout(service)
        .then(function() {
          console.log('logged out');
        })
        .catch(function(err) {
          console.log('error loggin out');
        });
    }


  }
  DashboardController.$inject = ['_', '$q', '$timeout', '$location', 'songRequestService', 'errorService', 'socket'];

  angular
    .module('uiApp')
    .controller('DashboardController', DashboardController);

})();
