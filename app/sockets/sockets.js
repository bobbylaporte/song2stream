// sockets.js
var socketio = require('socket.io')
var connect = require('spotify-local-control');
var client = connect();
var pollingTimer;

module.exports.listen = function(app){

	var isOffline = true;
	

	var currentTrack = { name: '', artist: ''};

	var first_connection = true;

    io = socketio.listen(app);

    io.on('connection', function (socket) {

    	console.log('first connection?');
    	console.log(first_connection);

      // Client has connected
      //console.log('Sockets started up on the server.');
      
      socket.on('disconnect', function (socket) {
      	console.log('client disconnected');
	  	first_connection = false;
	  	currentTrack = { name: '', artist: ''};
	  });

      socket.on('start_polling', function(){
      	console.log('start polling');
      	poll();
      });

      socket.on('reset_track', function(){
      	console.log('reset track');
      	currentTrack = { name: '', artist: ''};
      });




      function poll(){

	    	console.log('polling spotify service');


	    	var promise = client.status().then(function(response){

	    		clearTimeout(pollingTimer);

	    		//console.log('body');
	    		//console.log(response.body);
	    	    console.log(typeof response.body.error);

	    		if(response.body.track === undefined){ // go offline
	    			console.log('has error');
	    			console.log(response.body.error);
	    			//response.body.error.type
	    			// 4107 === Invalid token. Should call client.connect again
	    			// 4110 === no user logged in
	    			if(response.body.error.type === '4107'){
	    				// Try refreshing connection
	    				client = connect();
	    			}
	    			if(!isOffline){
						isOffline = true;
						currentTrack = { name: '', artist: ''};
						console.log('go offline');
						io.emit('go_offline');
					}
	    		}else{


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
			});

		}




 	});








    return io;
}



