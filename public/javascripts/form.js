// window.setTimeout(function(){
//  location.reload();
// }, 4000);



$(document).ready(function(){



    // Fire up sockets
    socket = io('http://localhost:1337', { 'forceNew': true, 'reconnection': false });

    socket.on('connect', function () {
      console.log('Form is connected to socket.');
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
      $('.bot-status').text('Bot is Connected');
      //updateTrack(track);
    });





    // Check for exiting twitch auth data
    $.ajax({
      method: "GET",
      url: "http://localhost:1337/api/check_auth_file"
    }).done(function( msg ) {

      startBotServer();


    }).fail(function( jqXHR, textStatus ) {

      var html = '<a href="http://localhost:1337/auth/twitch" class="big-twitch-button" target="_blank">Connect with Twitch</a>';
      $('.bot-status').html(html);

    });

    $('.save-button').on('click', function(e){

      e.preventDefault();

      $.ajax({
        method: "POST",
        url: "http://localhost:1337/api/user_preferences",
        data: $('form').serialize()
      }).done(function( msg ) {
        alert( "Data Saved: " + msg );
      }).fail(function( jqXHR, textStatus ) {
        alert( "Error Saving: " + textStatus);
      });
    });




});



function startBotServer(){
  $.ajax({
    method: "GET",
    url: "http://localhost:1337/api/start_bot"
  }).done(function( msg ) {
    $('.bot-status').text('Starting Bot');
  }).fail(function( jqXHR, textStatus ) {
    $('.bot-status').text('Bot is Dead. Damn.');
  });
};

