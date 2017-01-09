// sockets.js
var socketio = require('socket.io')
var connect = require('spotify-local-control');
var client = connect();
var fs = require('fs');
var path = require('path');
var log = require('electron-log');


module.exports.listen = function(app){



    io = socketio.listen(app);

    io.on('connection', function (socket) {


      clearStatus();


      console.log('client connected');

      // Client has connected
      //console.log('Sockets started up on the server.');

      socket.on('disconnect', function (socket) {
      	console.log('client disconnected');
  	  	//clearStatus();
  	  });

      socket.on('reset_track', function(){
      	// Clear the status.json
        clearStatus();
      });
 	});



function clearStatus(){
  try {
    fs.writeFileSync(path.join(__dirname, '/../../data/spotify_status.json'), JSON.stringify({online: false}));
    console.log('Spotify Status File Cleared');
  } catch (err) {
    console.log('Error Clearing Status File');
    console.log(err);
  }
}





  return io;
}



