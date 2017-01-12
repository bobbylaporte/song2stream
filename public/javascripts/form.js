// window.setTimeout(function(){
//  location.reload();
// }, 4000);



$(document).ready(function(){



    // Fire up sockets
    socket = io('http://localhost:1337', { 'forceNew': true, 'reconnection': false });

    socket.on('connect', function () {
      console.log('Form is connected to socket.');
    });


    socket.on('check_auth_file', function () {
      checkForAuthFile();
    });

    socket.on('disconnect', function () {
      offline = true;
      console.log('Form disconnected from socket.');
      //goOffline('song2stream not detected');
    });


    socket.on('user_just_authed', function(track){
      console.log('User Just Authed with Twitch');
      startBotServer();
    });


    socket.on('bot_connected', function(track){ // Will run when server has new track info
      console.log('BOT HAS STARTED');
      $('.bot-status').html('<i class="fa"></i><span></span>');
      $('.bot-status').removeClass('disconnected').addClass('connected').find('span').html('Twitch Bot is Connected <a class="stop-bot"><i class="fa fa-stop"></i>Stop Bot</a>');
      //updateTrack(track);
    });


    socket.on('spotify_connected', function(track){ // Will run when server has new track info
      console.log('SPOTIFY CONNECTED');
      $('.spotify-status').removeClass('disconnected').addClass('connected').find('span').text('Spotify is Connected');
      //updateTrack(track);
    });


    socket.on('spotify_disconnected', function(track){ // Will run when server has new track info
      console.log('SPOTIFY DIS_CONNECTED');
      $('.spotify-status').removeClass('connected').addClass('disconnected').find('span').text('Spotify is Disconnected');
      //updateTrack(track);
    });

    $('.color').colorPicker();

    checkForAuthFile();


    $('.save-button').on('click', function(e){

      e.preventDefault();

      $.ajax({
        method: "POST",
        url: "http://localhost:1337/api/user_preferences",
        data: $('form').serialize()
      }).done(function( msg ) {
        console.log( "Data Saved: " + msg );

      }).fail(function( jqXHR, textStatus ) {
        alert( "Error Saving: " + textStatus);
      });
    });


    $('body').on('click', '.delete-twitch-user', function(e){

      e.preventDefault();
      stopBotServer();

      $.ajax({
        method: "POST",
        url: "http://localhost:1337/auth/twitch/delete_user"
      }).done(function( msg ) {
        var html = '<a href="http://twitch-toad.rhcloud.com/auth/twitch" class="big-twitch-button" target="_blank"><i class="fa fa-twitch"></i>Connect with Twitch</a>';
        $('.bot-status').html(html);
      }).fail(function( jqXHR, textStatus ) {
        alert( "Error Deleting: " + textStatus);
      });
    });


    $('body').on('click', '.stop-bot', function(e){

      e.preventDefault();
      stopBotServer();
    });


    $('body').on('click', '.start-bot', function(e){
      e.preventDefault();
      startBotServer();
    });


    $('.tab').on('click', function(e){
      if($(this).hasClass('form')){
        $('ul.song-requests').hide();
        $('form').show();

        $('.tab').removeClass('active');
        $(this).addClass('active');
      }

      if($(this).hasClass('requests')){

        getSongRequests();

        $('ul.song-requests').show();
        $('form').hide();

        $('.tab').removeClass('active');
        $(this).addClass('active');
      }
    });



    $('body').on('click', '.add-track', function(e){
      var $track = $(this);
      $.ajax({
        method: "POST",
        url: "http://localhost:1337/api/add_track_to_playlist",
        data: {'track': $track.data('trackuri')}
      }).done(function( msg ) {

        console.log(msg);
        switch(msg){
          case 'success':
            console.log('added track to playlist. Now clear it away.');
            // Remove item from song request file at index $track.data('index')
            removeSongRequest($track);
          break;
          case 'try_again':
            console.log('was not added. try again.');
          break;
          case 'error':
          case 'failed':
            console.log('error requesting new token');
          break;
        }


      }).fail(function( jqXHR, textStatus ) {
        alert( "Error Deleting: " + textStatus);
      });
    });


    $('body').on('click', '.remove-track', function(e){
      var $track = $(this);
      removeSongRequest($track);
    });

});


function checkForAuthFile(){
  // Check for exiting twitch auth data
  $.ajax({
    method: "GET",
    url: "http://localhost:1337/api/check_auth_file"
  }).done(function( msg ) {

    startBotServer();


  }).fail(function( jqXHR, textStatus ) {

    var html = '<a href="http://twitch-toad.rhcloud.com/auth/twitch" class="big-twitch-button" target="_blank"><i class="fa fa-twitch"></i>Connect with Twitch</a>';
    $('.bot-status').html(html);

  });
}


function getSongRequests(){
  // Check for exiting twitch auth data
  $.ajax({
    method: "GET",
    url: "http://localhost:1337/api/get_song_requests"
  }).done(function( data ) {

    console.log('song requests');
    console.log(data);
    var array = JSON.parse(data);

    $('ul.song-requests').html('');

    array.forEach(function(track){
      var html =  '<li>';
            html += '<span class="track-detail">'+ track.name +' - '+ track.artist +'</span>';
            html += '<span class="requested-by">Requested by '+ track.requested_by +'</span>';
            html += '<a class="add-track" data-trackuri="'+ track.uri +'">ADD</a>';
            html += '<a class="remove-track" data-trackuri="'+ track.uri +'">REMOVE</a>';
          html += '</li>';

      $('ul.song-requests').append(html);
    });

  }).fail(function( jqXHR, textStatus ) {



  });
}

function removeSongRequest($track){
  // Check for exiting twitch auth data
  $.ajax({
    method: "POST",
    url: "http://localhost:1337/api/remove_song_request",
    data: {'index': $track.data('index') }
  }).done(function( data ) {

    console.log('song deleted');
    $track.parent().slideUp().remove();

  }).fail(function( jqXHR, textStatus ) {
    console.log('song not deleted');

  });
}


function startBotServer(){
  $.ajax({
    method: "GET",
    url: "http://localhost:1337/api/start_bot"
  }).done(function( msg ) {
    $('.bot-status span').text('Starting Bot');
  }).fail(function( jqXHR, textStatus ) {
    $('.bot-status span').text('Bot is Dead. Damn.');
  });
};


function stopBotServer(){
  $.ajax({
    method: "GET",
    url: "http://localhost:1337/api/stop_bot"
  }).done(function( msg ) {
    var html = 'Bot Stopped. <a class="start-bot"><i class="fa fa-play"></i>Start Bot</a> <a class="delete-twitch-user"><i class="fa fa-sign-out"></i>Logout</a>';
    $('.bot-status').removeClass('connected').addClass('disconnected').find('span').html(html);
  }).fail(function( jqXHR, textStatus ) {
    $('.bot-status span').text('Bot is Dead. Damn.');
  });
};
