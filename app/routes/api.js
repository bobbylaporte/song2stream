module.exports = function(io){

	var express = require('express');
	var path = require('path');
	var fs = require('fs');
	var router = express.Router();
	var connect = require('spotify-local-control');
	var client = connect();


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






	router.post('/user_preferences', function(req, res, next) {

		fs.writeFileSync(path.join(__dirname, '/../../data/user_preferences.json'), JSON.stringify(req.body));

    res.send('Saved');
		//res.redirect('/home');

	});


  router.get('/check_auth_file', function(req, res, next) {


    try {
      userFile = fs.readFileSync(path.join(__dirname, '/../twitch-user.json'), 'utf8');
      res.status(200).send('We have a File');

    } catch (err) {
      res.status(500).send('No File.');
    }

    var data = fs.readFileSync(path.join(__dirname, '/../../data/user_preferences.json'));


  });



  router.get('/start_bot', function(req, res, next) {

    var userFile = fs.readFileSync(path.join(__dirname, '/../twitch-user.json'), 'utf8');

    console.log(userFile);
    var twitchChannel = JSON.parse(userFile).name;

    try {
      //if(botServerStarted === false){
        require(path.join(__dirname, '/../bot/bot-server.js'))(twitchChannel, io);
        botServerStarted = true;
      //}

      res.status(200).send('Bot Server Started...');

    } catch (err) {
      res.status(500).send('Fucked.');
    }

    //

  });

	return router;
};
