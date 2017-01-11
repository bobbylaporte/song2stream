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


      console.log('client connected');


      socket.on('disconnect', function (socket) {
      	console.log('client disconnected');
  	  	//clearStatus();
  	  });



      // Update the overlay when it first connects


      try {
        var status = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/spotify_status.json'), 'utf8'));

        console.log('Read Status File');
        console.log('Initial Update for Overlay.');

        var track_name = status.track.track_resource.name;
        var track_link = status.track.track_resource.location.og;
        var artist_name = status.track.artist_resource.name;
        var album_name = status.track.album_resource.name;
        var playing = status.playing;

        var track = { name: track_name, link: track_link, artist: artist_name, album_name: album_name, playing: playing };

        io.emit('update_track', track);

      } catch (err) {
        console.log('Error Reading Status File');
        console.log(err);
      }





 	});






  return io;
}



