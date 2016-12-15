module.exports = () => {

  var currentTrack;

  var express = require('express');


  var path = require('path');

  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var cors = require('cors');

  var home = require(path.join(__dirname, '/routes/home'));
  var index = require(path.join(__dirname, '/routes/index'));
  var api = require(path.join(__dirname, '/routes/api'));

  var auth = require(path.join(__dirname, '/routes/auth'));

  var app = express();
  var http = require( "http" ).createServer( app );

  var fs = require('fs');

  var passport = require('passport');


  app.use(passport.initialize());
  app.use(passport.session());

  var io = require(path.join(__dirname, '/sockets/sockets.js')).listen(http);

      // Start The HTTP Server
  http.listen(1337, 'localhost');

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  //app.use(logger('dev'));
  // app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: false }));
  // app.use(cookieParser());

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors());

  // Setup Globally Included Directories
  app.use(express.static(path.join(__dirname, '/../bower_components/')));
  app.use(express.static(path.join(__dirname, '/../node_modules/')));
  app.use(express.static(path.join(__dirname, '/../controllers/')));
  app.use(express.static(path.join(__dirname, '/../public/')));

  app.use('/', index(io));
  app.use('/home', home(io));
  app.use('/api', api(io));

  app.use('/auth', auth);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });















  // TWITCH BOT
  var config = require('./oauth-config.js');
  var TwitchStrategy = require("passport-twitch").Strategy;


  // Twitch
  passport.use(new TwitchStrategy({
      clientID: config.twitch.clientID,
      clientSecret: config.twitch.clientSecret,
      callbackURL: config.twitch.callbackURL,
      scope: 'user_read'
    },
    function(token, refreshToken, profile, done) {

      console.log('twitch profile');
      console.log(profile);

      var userFile;

      try {
        userFile = fs.readFileSync('./app/twitch-user.json', 'utf8');
        console.log('found a user profile');


      } catch (err) {
        console.log('cannot find user file');
        console.log(err);

        console.log('create new one');


        // Save this to the userFile
        var user = {
          'oauthId': profile.id,
          'oauthType': 'twitch',
          'name': profile.username,
          'email': profile.email,
          'profile_image_url': profile._json.logo,
          'access_token': token,
          'created': Date.now()
        };

        fs.writeFileSync('./app/twitch-user.json', JSON.stringify(user), 'utf8');
        userFile = fs.readFileSync('./app/twitch-user.json', 'utf8');
      }



      console.log('userFile');
      console.log(userFile);



      // Now set the global variable for twitchChannel
      twitchChannel = JSON.parse(userFile).name;



      // TODO: HOW DO I PASS PARAM TO REQUIRE!!!!!!!

      console.log('twitchChannel');
      console.log(twitchChannel);


      // Start Bot
      require(path.join(__dirname, '/bot/bot-server.js'))(twitchChannel);


      console.log('calling DONE');

      done(null, JSON.parse(userFile));


    }
  ));




  // serialize and deserialize
  passport.serializeUser(function(user, done) {

   console.log('serializeUser: ' + user.oauthId);
   done(null, user.oauthId);

  });

  passport.deserializeUser(function(id, done) {


   var userFile;

    try {
      userFile = fs.readFileSync('./app/twitch-user.json', 'utf8');
      console.log('found a user profile');
      done(null, JSON.parse(user).oauthId);

    } catch (err) {
      console.log('cannot find user file');
      done(err, null)

    }




  });







}
