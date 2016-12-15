// sockets.js
var socketio = require('socket.io')
var connect = require('spotify-local-control');
var client = connect();
var pollingTimer;

module.exports.listen = function(app){

	var isOffline = false;


	currentTrack = { name: '', artist: ''};

	var first_connection = true;

    io = socketio.listen(app);

    io.on('connection', function (socket) {

      console.log('client connected');

    	console.log('first connection?');
    	console.log(first_connection);

      clearTimeout(pollingTimer);

      // Client has connected
      //console.log('Sockets started up on the server.');

      socket.on('disconnect', function (socket) {
      	console.log('client disconnected');
  	  	first_connection = false;
  	  	currentTrack = { name: '', artist: ''};
  	  });

      socket.on('start_polling', function(){
      	console.log('start polling');
      	//poll();
      });

      socket.on('reset_track', function(){
      	console.log('reset track');
      	currentTrack = { name: '', artist: ''};
      });




      function poll(){

	    	console.log('polling spotify service');

	    	var promise = client.status().then(function(response){

	    		clearTimeout(pollingTimer);

          if(response.body.track === undefined && response.body.error !== undefined){

            console.log('spotify service returned an error');
            //console.log(response.body);

            //response.body.error.type
            // 4107 === Invalid token. Should call client.connect again
            // 4110 === no user logged in

            if(response.body.error.type === '4107'){
              // Try refreshing spotify client connection
              client = connect();
            }else if(!isOffline && response.body.error.type === '4110'){
              currentTrack = { name: '', artist: ''};
              console.log('go offline');
              io.emit('go_offline');
            }

            isOffline = true;


          }else{

            console.log('spotify service returned a track');
            //console.log(response.body.track);

  	    		// no error, good to go

  	    		if(isOffline){
  	    			isOffline = false;
  	    		}

  					var track_name = response.body.track.track_resource.name;
  					var artist_name = response.body.track.artist_resource.name;
  					var album_name = response.body.track.album_resource.name;
  					var playing = response.body.playing;

  					var track = { name: track_name, artist: artist_name, first_connection: first_connection };

  					//console.log(track);
  					//console.log(currentTrack);

  					if((currentTrack.name !== track.name) || first_connection){
  						first_connection = false;
  						currentTrack = track;
  						io.emit('update_track', track);
  					}

  	    	}



				pollingTimer = setTimeout(function(){
					//wait 5 seconds and try again
					poll();
				}, 3000);


			}, function(response){

        clearTimeout(pollingTimer);


        console.log('spotify service promise failed');
        console.log(response);

        //client = connect();

        if(!isOffline){
          isOffline = true;
          currentTrack = { name: '', artist: ''};
          console.log('go offline no spotify');
          io.emit('go_offline');
        }



        // pollingTimer = setTimeout(function(){
        //   //wait 5 seconds and try again
        //   poll();
        // }, 3000);


      });

		}




 	});








  return io;
}



