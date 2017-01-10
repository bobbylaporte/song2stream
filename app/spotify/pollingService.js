const SpotifyWebHelper = require('@jonny/spotify-web-helper');
const fs = require('fs');
const path = require('path');

let helper = SpotifyWebHelper();
let pollingTimer;

module.exports = function(io){

  helper.connect();


  helper.player.on('error', err => {
    console.log('SPOTIFY ERROR');
    console.log(err);
    if(err.type === '4110'){
      console.log('User Not Logged in');
      // Call init again in 5 seconds
      pollingTimer = setTimeout(function(){
        helper.connect();
      }, 5000);
    }
  });
  helper.player.on('ready', () => {

    console.log('BOOYAH WE HAVE SPOTIFY');

    // Playback events
    helper.player.on('play', () => {
      console.log('PLAY');
      io.emit('play_track');
    });
    helper.player.on('pause', () => {
      console.log('PAUSE');
      io.emit('pause_track');
    });
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



      try {
        existingStatus = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/spotify_status.json'), 'utf8'));
        console.log('existingStatus set');
        console.log(existingStatus);
      } catch (err) {
        console.log('Error Reading Status File');
        console.log(err);
      }

      if(status.error !== undefined){

        if(status.online === false || status.running === false){

          if(existingStatus.online){
            goOffline(status);
          }

        }else{

          if(status.error.type === '4107'){
            // Try refreshing spotify client connection
            console.log('bad bad CRFS Token');
            init();
          }else if(status.error.type === '4110'){

            if(existingStatus.online){
              goOffline(status);
            }

          }
        }




      }else{ // no error object


        if(status.track === undefined || status.track.track_resource === undefined){
          // Offline
          if(existingStatus.online){
            goOffline(status);
          }
        }else{

          console.log('Current Track:' + status.track.track_resource.name);


          // SUCCESS
          if(!existingStatus.online || !existingStatus.running){
            io.emit('spotify_connected');
          }


          if(!existingStatus.track || existingStatus.track.track_resource.name !== status.track.track_resource.name){
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

    io.emit('go_offline');
    io.emit('spotify_disconnected');


    helper.connect();
  }

};




return helper;
