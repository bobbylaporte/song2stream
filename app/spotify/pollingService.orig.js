var connect = require('spotify-local-control');

var client = connect();
var pollingTimer;
var pollingService = {};

var log = require('electron-log');



    currentTrack = { name: '', artist: ''};
    spotifyOffline = true;

    //console.log('offline?');
    //console.log(spotifyOffline);


    pollingService.poll = function(){

      //console.log('polling spotify service');
      log.info('polling spotify service');
      var promise = client.status().then(function(response){

        clearTimeout(pollingTimer);

        if(response.body.track === undefined && response.body.error !== undefined){

          //console.log('spotify service returned an error');
          //console.log(response.body);

          //response.body.error.type
          // 4107 === Invalid token. Should call client.connect again
          // 4110 === no user logged in

          if(response.body.error.type === '4107'){
            // Try refreshing spotify client connection
            client = connect();
          }else if(!isOffline && response.body.error.type === '4110'){
            currentTrack = { name: '', artist: ''};
            //console.log('go offline');
            //io.emit('go_offline');
          }

          spotifyOffline = true;


        }else{

          //console.log('spotify service fuck returned a track');
          //console.log(response.body.track);

          // no error, good to go

          if(spotifyOffline){
            spotifyOffline = false;
          }

          var track_name = response.body.track.track_resource.name;
          var track_link = response.body.track.track_resource.location.og;
          var artist_name = response.body.track.artist_resource.name;
          var album_name = response.body.track.album_resource.name;
          var playing = response.body.playing;

          var track = { name: track_name, link: track_link, artist: artist_name, album_name: album_name, playing: playing };

          //console.log(track);
          //console.log(currentTrack);

          if(currentTrack.name !== track.name){
            //console.log('updating this shit burger');
            log.info('update thi shit curger');
            log.info(track);
            currentTrack = track;
            //io.emit('update_track', track);
          }

        }


      //console.log('setting timeout');
      pollingTimer = setTimeout(function(){
        //wait 5 seconds and try again
        //console.log('Recalling pollingService.poll');
        pollingService.poll();
      }, 3000);


    }, function(response){

      clearTimeout(pollingTimer);


      console.log('spotify service promise failed');
      console.log(response);

      //client = connect();

      //if(!isOffline){
        //isOffline = true;
        currentTrack = { name: '', artist: ''};
        spotifyOffline = true;

        // TODO: Switch the port


        console.log('go offline no spotify connection');
        //io.emit('go_offline');
      //}



      pollingTimer = setTimeout(function(){
        //wait 5 seconds and try again
        pollingService.poll();
      }, 3000);


    });

  };

  console.log('start pollingService.poll');
  pollingService.poll();

  module.exports = pollingService;




