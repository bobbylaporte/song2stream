module.exports = function(io){

	var express = require('express');
	var path = require('path');
	var fs = require('fs');
	var router = express.Router();
	var connect = require('spotify-local-control');
	var client = connect();
  var request = require('request');


	/* GET track data. */
	router.get('/track', function(req, res, next) {





		// client.play('spotify:track:0JhKJg5ejeQ8jq89UQtnw8')
		// client.pause()
		// client.resume()

		var timeout = setTimeout(function(){
			// if this takes more than 5 seconds, send a 500
			res.status(500).send('error getting spotify data');
		}, 5000);


		client.status().then(function(response){

			clearTimeout(timeout);
			//res.body
			//res.send(response.body);
			var track_name = response.body.track.track_resource.name;
			var artist_name = response.body.track.artist_resource.name;
			var album_name = response.body.track.album_resource.name;
			var playing = response.body.playing;

			var track = { name: track_name, artist: artist_name, album: album_name, playing: playing };
			res.send(track);
		});



	});

	router.get('/user_preferences', function(req, res, next) {


		var data = fs.readFileSync(path.join(__dirname, '/../../data/user_preferences.json'));
		res.send(JSON.parse(data));

	});


  router.get('/add_tracks_to_playlist', function(req, res, next) {


    var tracks = encodeURI("spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M");


    var options = {
      url: 'https://api.spotify.com/v1/users/ominoustoad/playlists/5hWjRuejrECK9Cb7B6V9QN/tracks?uris='+ tracks,
      headers: { 'Authorization': 'Bearer BQBWcfWuQWSFIKhYlLSfWe3MjHJsxSHR9odVq5SqzEZKw7UeqgcDjQ1cDTLCwFdRZN5kPtpBzSyiMhx9dfL9cbE4h0sFQGx5z_R12LleHEftCwBMPfugArZfDJMJOHfpSTtVdGfiudftNljbmZwSqQzntYQm-xBP-xgHOcu-YrIgxPBQECQYhtpoMuGUd7OHawLvxYEDARyR9KLzq_9OcHCYwQaV5SpDb1QmgdDx83-E7iDo21ompC_hU9ZW58waWVLvZ6TgMhwC', 'Content-Type': 'application/json' }
    };

    request.post(options, function(err,response,body){
      if(err){
        console.log('error adding to playlist');
        console.log(err);
      }
      if(!err){
        // Success! We have a track.
        console.log('res');
        console.log(body);

        // if(body.error.status === '401'){
        //   // Refresh this token. then try the call again.
        // }

        res.send('success added to playlist');
      }
    });


  });





	router.post('/user_preferences', function(req, res, next) {

		fs.writeFileSync(path.join(__dirname, '/../../data/user_preferences.json'), JSON.stringify(req.body));
    io.emit('refresh_overlay');
    res.send('Saved');
		//res.redirect('/home');

	});


  router.get('/check_auth_file', function(req, res, next) {


    try {
      userFile = fs.readFileSync(path.join(__dirname, '/../../data/twitch_user.json'), 'utf8');
      res.status(200).send('We have a File');

    } catch (err) {
      res.status(500).send('No File.');
    }

    var data = fs.readFileSync(path.join(__dirname, '/../../data/user_preferences.json'));


  });



  router.get('/start_bot', function(req, res, next) {

    var userFile = fs.readFileSync(path.join(__dirname, '/../../data/twitch_user.json'), 'utf8');

    console.log(userFile);
    var twitchChannel = JSON.parse(userFile).name;

    try {
      //if(botServerStarted === false){
        twitchBot = require(path.join(__dirname, '/../bot/bot-server.js'))(twitchChannel, io);
        botServerStarted = true;
      //}

      res.status(200).send('Bot Server Started...');

    } catch (err) {
      res.status(500).send('Fucked.');
    }

    //

  });

  router.get('/stop_bot', function(req, res, next) {

      console.log('stop the bot!!!!');
      console.log(twitchBot);
      twitchBot.disconnect();
      //maybe close

      io.emit('stop_bot_service');
      botServerStarted = false;

      res.status(200).send('Bot Server Stopped...');


  });



	return router;
};
