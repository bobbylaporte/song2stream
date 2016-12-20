// sockets.js
var socketio = require('socket.io')
var connect = require('spotify-local-control');
var client = connect();

var log = require('electron-log');


module.exports.listen = function(app){


	var first_connection = true;

    io = socketio.listen(app);

    io.on('connection', function (socket) {


      currentTrack = { name: '', artist: ''};


      console.log('client connected');

    	console.log('first connection?');
    	console.log(first_connection);

      // Client has connected
      //console.log('Sockets started up on the server.');

      socket.on('disconnect', function (socket) {
      	console.log('client disconnected');
  	  	first_connection = false;
  	  	currentTrack = { name: '', artist: ''}
  	  });

      socket.on('reset_track', function(){
      	console.log('reset track');
        //log.info('Start Polling');
      	currentTrack = { name: '', artist: ''}
      });


 	});








  return io;
}



