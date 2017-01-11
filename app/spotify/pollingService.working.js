var pollingTimer;
var SpotifySDK = require('spotify-port-scanner-node');
var client = new SpotifySDK.SpotifyClient({ debug : true });
var fs = require('fs');
var path = require('path');

// Clear the status.json
try {
  fs.writeFileSync(path.join(__dirname, '/../../data/spotify_status.json'), JSON.stringify({online: false}));
  console.log('Spotify Status File Cleared');
} catch (err) {
  console.log('Error Clearing Status File');
  console.log(err);
}






module.exports = function(io){


  var firstLoop = true;

  function init(){

    client.connect({
      lowPort : 4370,
      highPort : 4379
    })
    .then(() => {
      console.log("client connected to host %s:%s", client.getHost(), client.getPort());

      host = client.getSpotifyHost();
      poll();


    }).catch(error => {
      console.log("client error", error);

      if(existingStatus.online){
        goOffline({online: false});
      }

      connectTimer = setTimeout(function(){
        init();
      }, 3000);

    });

  }

  init();

  function poll(){
    // get host status
    // get spotify application host
    host.getStatus(function (error, status) {
      if (error) {
          console.log("host error", error);

          console.log('error code');
          console.log(error.code);

          if(error.code === 'EAI_AGAIN'){
            // Temporary Error, don't worry about it.
            console.log('CAPTURED EAI_AGAIN error, skipping.');
          }else{
            if(existingStatus.online){
              goOffline({online: false});
            }
          }



      } else {
        //console.info("host status:", status);

        try {
          existingStatus = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/spotify_status.json'), 'utf8'));
          console.log('existingStatus set');
          console.log(existingStatus);
        } catch (err) {
          console.log('Error Reading Status File');
          console.log(err);
        }






        //console.log('is offline?: ' + spotifyOffline);
        console.log('status');
        console.log(status);


        if(status.error !== undefined){

          console.log('status error');

          console.log(status.running);

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




        }else{ // success


          if(status.track === undefined || status.track.track_resource === undefined){
            // Offline
            if(existingStatus.online){
              goOffline(status);
            }
          }else{

            console.log('Current Track:' + status.track.track_resource.name);


            // SUCCESS
            if(!existingStatus.online){
              io.emit('spotify_connected');
            }


            if(!existingStatus.track || existingStatus.track.track_resource.name !== status.track.track_resource.name  || existingStatus.playing !== status.playing || firstLoop){
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

              firstLoop = false;
            }
          }



        } //end sucess






      }


      startTimer();


    });
  }

  function startTimer(){
    console.log('START 3 SECOND TIMER');
    clearTimeout(pollingTimer);
      pollingTimer = setTimeout(function(){
      //wait 5 seconds and try again
      //console.log('Recalling pollingService.poll');
      console.log('POLL');
      poll();
    }, 3000);
  }


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
  }

  return client;


};

