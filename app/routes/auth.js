module.exports = function(io){

  // Include Express
  var express = require('express');
  // Initialize the Router
  var router = express.Router();

  var path = require('path');
  var fs = require('fs');

  // TWITCH
  router.post('/twitch/save_user', function(req, res, next) {

    fs.writeFileSync(path.join(__dirname, '/../../data/twitch_user.json'), JSON.stringify(req.body));

    io.sockets.emit('check_auth_file');

    res.send('All Good!');

  });


    router.post('/twitch/delete_user', function(req, res, next) {


    fs.unlink(path.join(__dirname, '/../../data/twitch_user.json'), function(){
      io.emit('check_auth_file');
      res.send('All Good!');
    });

  });


  //SPOTIFY
  router.post('/spotify/save_user', function(req, res, next) {

    fs.writeFileSync(path.join(__dirname, '/../spotify-user.json'), JSON.stringify(req.body));

    io.sockets.emit('spotify_auth');

    res.send('All Good!');

  });


  // Expose the module
  return router;
};
