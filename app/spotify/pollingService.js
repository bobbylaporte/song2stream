const SpotifyWebHelper = require('@jonny/spotify-web-helper');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

var helper = SpotifyWebHelper();
var pollingTimer;

module.exports = function(io){

  helper.connect();


  helper.player.on('error', err => {
    console.log('SPOTIFY ERROR');
    console.log(err);
    if(err.type === '4110'){
      console.log('User Not Logged in');

      goOffline(err);

      // Call init again in 5 seconds
      pollingTimer = setTimeout(function(){
        console.log('Call Connect Again');
        helper.connect();
      }, 5000);
    }
  });


  helper.player.on('play', () => {
    console.log('PLAY');
    io.emit('play_track');
  });
  helper.player.on('pause', () => {
    console.log('PAUSE');
    io.emit('pause_track');
  });


  helper.player.on('ready', () => {

    console.log('BOOYAH WE HAVE SPOTIFY');

    // Playback events

    // helper.player.on('end', () => {
    //   console.log('END');
    // });
    // helper.player.on('track-will-change', track => {
    //   console.log('TRACK WILL CHANGE');
    //   console.log(track);
    // });
    helper.player.on('status-will-change', status => {
      console.log('STATUS WILL CHANGE');
      console.log(status);


      // READ THE EXISTING STATUS FILE
      try {
        existingStatus = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/spotify_status.json'), 'utf8'));
        console.log('existingStatus set');
        console.log(existingStatus);
      } catch (err) {
        console.log('Error Reading Status File');
        console.log(err);
      }

      if(status.error !== undefined){ // we have en error object

        // WE HAVE A ERROR, BUT WHAT TYPE?
        // 4110 === Bad CRFS Token
        // 4170 === No User Logged In

        if(status.error.type === '4107'){
          // Try refreshing spotify client connection
          console.log('bad bad CRFS Token');
          helper.connect();
        }else if(status.error.type === '4110'){
          console.log('User Not Logged in 2');
          if(existingStatus.running){
            console.log('going offline two');

            // Not Logged In
            goOffline(status);
          }
        }


      }else{ // no error object



        if(_.isEmpty(status.track) || status.track === undefined || status.track.track_resource === undefined){


          console.log('CALLING NO SONG FROM POLLING SERVICE');

          io.emit('no_song');

          // TODO: Clear the spotify_status.json track variable
          try {
            fs.writeFileSync(path.join(__dirname, '/../../data/spotify_status.json'), JSON.stringify(status));
            console.log('Spotify Status File Updated');


          } catch (err) {
            console.log('Error Updating Status File');
            console.log(err);
          }

        }else{

          console.log('Current Track:' + status.track.track_resource.name);


          // If we we were offline before, let's send to connected event

          if(!existingStatus.online || !existingStatus.running || _.isEmpty(existingStatus.track)){
            io.emit('spotify_connected');
          }


          if(!existingStatus.track || !existingStatus.track.track_resource || existingStatus.track.track_resource.name !== status.track.track_resource.name){
            //console.log('updating this shit burger');
            //console.log('update the track');
            //console.log(track);
            // currentTrack = track;
            try {
              fs.writeFileSync(path.join(__dirname, '/../../data/spotify_status.json'), JSON.stringify(status));
              console.log('Spotify Status File Updated');
            } catch (err) {
              console.log('Error Updating Status File');
              console.log(err);
            }



            var track_name = status.track.track_resource.name;
            var track_link = status.track.track_resource.location.og;
            var artist_name = status.track.artist_resource.name;
            var album_name = status.track.album_resource.name;
            var playing = status.playing;

            var track = { name: track_name, link: track_link, artist: artist_name, album_name: album_name, playing: playing };

            io.emit('update_track', track);

          }
        }



      } //end no error object

    });


  });


  function goOffline(status){
    console.log('Going Offline')
    try {
      fs.writeFileSync(path.join(__dirname, '/../../data/spotify_status.json'), JSON.stringify(status));
      console.log('Spotify Status File Updated');
    } catch (err) {
      console.log('Error Updating Status File');
      console.log(err);
    }

    //io.emit('go_offline');
    io.emit('spotify_disconnected');


    //helper.connect();
  }

};




return helper;
