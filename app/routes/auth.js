module.exports = function(io){

  // Include Express
  var express = require('express');
  // Initialize the Router
  var router = express.Router();

  var passport = require('passport');


  // TWITCH
  router.get('/twitch',
      passport.authenticate('twitch', { stateless:true })
  );

  router.get('/twitch/callback',
    passport.authenticate('twitch', { stateless:true, failureRedirect: "/fail" }),
    function(req, res) {
      //console.log('THIS MOTHERFUCKER IS AUTHENTICATED!!!!!');
      io.sockets.emit('user_just_authed');

      res.send('Yeah, we have connected with Twitch! You can close this window.')

      // TODO: Force the 'Form' page to refresh, showing that the bot is now logged into twitch chat
    }
  );

  // Expose the module
  return router;
};
