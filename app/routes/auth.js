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
    res.send('All good. CLose this Window')

    // TODO: Force the 'Form' page to refresh, showing that the bot is now logged into twitch chat
  }
);

// Expose the module
module.exports = router;
