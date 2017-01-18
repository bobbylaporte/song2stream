var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var connect = require('spotify-local-control');
var client = connect();
var request = require('request');

const SpotifyWebHelper = require('@jonny/spotify-web-helper');
var helper = SpotifyWebHelper();


module.exports = function(io){

  router.get('/connect', function(req, res, next) {

    helper.connect();

  });


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


  router.post('/add_track_to_playlist', function(req, res, next) {

    console.log('request body');
    console.log(req.body);

    var userFile = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/spotify_user.json'), 'utf8'));

    //var tracks = encodeURI("spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M");
    var tracks = encodeURI(req.body.track);

    var options = {
      url: 'https://api.spotify.com/v1/users/ominoustoad/playlists/5hWjRuejrECK9Cb7B6V9QN/tracks?uris='+ tracks,
      headers: { 'Authorization': 'Bearer ' + userFile.access_token, 'Content-Type': 'application/json' }
    };

    request.post(options, function(err,response,body){
      if(err){
        console.log('error');
        console.log(err);
        //res.send('error');
      }
      if(!err){
        // Success! We have a track.
        console.log('res');
        console.log(body);

        var json = JSON.parse(body);


        if(json.error){
          // Refresh this token. then try the call again.
          if(json.error.status === 401){
            console.log('EXPIRED!!!!');
            getRefreshToken(res);
          }


        }else{
          res.send('success');
        }


      }
    });


  });



    router.post('/remove_song_request', function(req, res, next) {

    console.log('request body');
    console.log(req.body);

    var songArray = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/requested_tracks.json'), 'utf8'));

    songArray.splice(req.body.index, 1);

    fs.writeFileSync(path.join(__dirname, '/../../data/requested_tracks.json'), JSON.stringify(songArray));


    res.send('OK');




  });





	router.post('/user_preferences', function(req, res, next) {

		fs.writeFileSync(path.join(__dirname, '/../../data/user_preferences.json'), JSON.stringify(req.body));
    io.emit('refresh_overlay');
    res.send('Saved');
		//res.redirect('/home');

	});


  router.get('/check_twitch_auth_file', function(req, res, next) {


    try {
      var userFile = fs.readFileSync(path.join(__dirname, '/../../data/twitch_user.json'), 'utf8');
      res.status(200).send('We have a File');

    } catch (err) {
      res.status(500).send('No File.');
    }

  });


  router.get('/check_spotify_auth_file', function(req, res, next) {


    try {
      var userFile = fs.readFileSync(path.join(__dirname, '/../../data/spotify_user.json'), 'utf8');
      res.status(200).send('We have a File');

    } catch (err) {
      res.status(500).send('No File.');
    }

  });


  router.get('/get_song_requests', function(req, res, next) {


    try {
      var songs = fs.readFileSync(path.join(__dirname, '/../../data/requested_tracks.json'), 'utf8');
      res.status(200).send(songs);

    } catch (err) {
      res.status(500).send('No File.');
    }
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


function getRefreshToken(res){


  var userFile = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/spotify_user.json'), 'utf8'));

  console.log('userFile');
  console.log(userFile);

  var refresh_token = userFile.refresh_token;
  var oauthId = userFile.oauthId;

  var options = {
    url: 'http://twitch-toad.rhcloud.com/auth/spotify/refresh_token?oauthId='+ oauthId + '&refresh_token=' + refresh_token
  };

  console.log(options);

  request.get(options, function(err,response,body){
    if(err){
      console.log('error refreshing token');
      console.log(err);
      res.send('failed');
    }
    if(!err){
      // Success! We have a track.
      console.log('we refreshed the token!!!!');
      console.log(body);
      fs.writeFileSync(path.join(__dirname, '/../../data/spotify_user.json'), body);
      res.send('try_again');
    }
  });
}
