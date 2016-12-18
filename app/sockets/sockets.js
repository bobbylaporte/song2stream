// sockets.js
var socketio = require('socket.io')
var connect = require('spotify-local-control');
var client = connect();
var pollingTimer;

var previousTrack = { name: '', artist: ''};

module.exports.listen = function(app){


	var first_connection = true;

    io = socketio.listen(app);

    io.on('connection', function (socket) {


      previousTrack = { name: '', artist: ''};


      console.log('client connected');

    	console.log('first connection?');
    	console.log(first_connection);

      clearTimeout(pollingTimer);

      // Client has connected
      //console.log('Sockets started up on the server.');

      socket.on('disconnect', function (socket) {
      	console.log('client disconnected');
  	  	first_connection = false;
  	  	previousTrack = { name: '', artist: ''}
  	  });

      socket.on('start_polling', function(){
      	console.log('start polling');
      	poll();
      });

      socket.on('reset_track', function(){
      	console.log('reset track');
      	previousTrack = { name: '', artist: ''}
      });




      function poll(){

	    	// console.log('currentTrack');
      //   console.log(currentTrack);

      //   console.log('previousTrack');
      //   console.log(previousTrack);

      //   console.log('offline?');
      //   console.log(spotifyOffline);

        if((currentTrack.name !== previousTrack.name) || first_connection){
          first_connection = false;
          previousTrack = currentTrack;
          console.log('update track');
          io.emit('update_track', currentTrack);
        }

        pollingTimer = setTimeout(function(){
          //wait 3 seconds and try again
          poll();
        }, 3000);

		  }




 	});








  return io;
}



