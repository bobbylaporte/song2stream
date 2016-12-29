var pollingTimer;
var SpotifySDK = require('spotify-port-scanner-node');
var client = new SpotifySDK.SpotifyClient({ debug : true });
var host;

currentTrack = { name: '', artist: ''};
var spotifyOffline = false;

module.exports = function(io){


  function init(){

    client.connect({
      lowPort : 4370,
      highPort : 4379
    })
    .then(() => {
      console.log("client connected to host %s:%s", client.getHost(), client.getPort());

      host = client.getSpotifyHost();
      spotifyOffline = true;
      poll();


    }).catch(error => {
      console.log("client error", error);

      if(!spotifyOffline){
        currentTrack = { name: '', artist: ''};
        spotifyOffline = true;
        io.emit('go_offline');
        io.emit('spotify_disconnected');
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
          if(!spotifyOffline){
            currentTrack = { name: '', artist: ''};
            spotifyOffline = true;
            io.emit('go_offline');
            io.emit('spotify_disconnected');
          }
      }
      else {
        console.info("host status:", status);

        console.log('is offline?');
        console.log(spotifyOffline);


        if(status.error !== undefined || status.online === false){

          if(status.online === false){

            if(!spotifyOffline){
              currentTrack = { name: '', artist: ''};
              spotifyOffline = true;
              io.emit('go_offline');
              io.emit('spotify_disconnected');
            }

          }else{

            if(status.error.type === '4107'){
              // Try refreshing spotify client connection
              console.log('bad bad CRFS Token');
              init();
            }else if(status.error.type === '4110'){

              if(!spotifyOffline){
                currentTrack = { name: '', artist: ''};
                spotifyOffline = true;
                io.emit('go_offline');
                io.emit('spotify_disconnected');
              }

            }
          }




        }else{ // success


          if(status.track === undefined || status.track.track_resource === undefined){
            // Offline
            if(!spotifyOffline){
              currentTrack = { name: '', artist: ''};
              spotifyOffline = true;
              io.emit('go_offline');
              io.emit('spotify_disconnected');
            }
          }else{

            console.log('SUCESSS');
            console.log('is offline?');
            console.log(spotifyOffline);


            // SUCCESS
            if(spotifyOffline){
              spotifyOffline = false;
              io.emit('spotify_connected');
            }

            var track_name = status.track.track_resource.name;
            var track_link = status.track.track_resource.location.og;
            var artist_name = status.track.artist_resource.name;
            var album_name = status.track.album_resource.name;
            var playing = status.playing;

            var track = { name: track_name, link: track_link, artist: artist_name, album_name: album_name, playing: playing };

            //console.log(track);
            //console.log(currentTrack);

            if(currentTrack.name !== track.name){
              //console.log('updating this shit burger');
              //console.log('update the track');
              //console.log(track);
              currentTrack = track;
              io.emit('update_track', track);
            }
          }



        } //end sucess






      }

      //console.log('setting timeout');
      pollingTimer = setTimeout(function(){
        //wait 5 seconds and try again
        //console.log('Recalling pollingService.poll');
        poll();
      }, 3000);


    });
  }



  return client;


};

