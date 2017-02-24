module.exports = () => {

  var currentTrack;
  var botServerStarted = false;

  var express = require('express');


  var path = require('path');

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
  var util = require('util');

  var request = require('request');

  var cron = require('node-cron');
  var async = require('async');
  var _ = require('lodash');





  var passport = require('passport');


  app.use(passport.initialize());
  app.use(passport.session());

  // io is our socket server

  var io = require(path.join(__dirname, '/sockets/sockets.js')).listen(http);


  // Start Polling Spotify
  var spotifyPollingService = require(path.join(__dirname, '/spotify/pollingService.js'))(io);


  // Start The HTTP Server
  http.listen(1337, 'localhost');

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');



  var util = require('util');
  var logFile = fs.createWriteStream(path.join(__dirname, '/logs/debug.log'), { flags: 'w' });
    // Or 'w' to truncate the file every time the process starts.
  var logStdout = process.stdout;

  console.log = function () {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
  }
  console.error = console.log;
  console.info = console.log;


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

  //app.use('/home', home(io));

  app.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname, '/../public/interface.html')); // load the single view file (angular will handle the page changes on the front-end)
  });


  app.use('/api', api(io));

  app.use('/auth', auth(io));

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





  // CRON ACTIVITIES
  cron.schedule('* * * * *', function(){
    console.log('running a task every minute');


    var viewerlist = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/viewers_list.json'), 'utf8'));
    // Get all viewers in the chat currently
    var userFile = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/twitch_user.json'), 'utf8'));

    var options = {
      url: 'http://tmi.twitch.tv/group/user/' + userFile.name + '/chatters'
    };

    var now = new Date();

    request.get(options, function(err,response,body){
      if(err){
        console.log('error');
        console.log(err);
        //res.send('error');
      }
      if(!err){
        // Success! We have our list of users.

        //var json = JSON.parse(body);

        var json = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/test/low5ive_viewers.json'), 'utf8'));

        var active_viewers = json.chatters.viewers;

        async.eachSeries(active_viewers, function(active_viewer, callback) {

          // Find this viewer in out viewerList
          var found_viewer = _.find(viewerlist, function(o) { return o.name === active_viewer; });
          if(found_viewer !== undefined){
            // Add a minute of viewtime to this person
            found_viewer.session_minutes = found_viewer.session_minutes + 1;
            found_viewer.total_minutes = found_viewer.total_minutes + 1;
            found_viewer.last_seen_time = new Date().toString();

            if(found_viewer.session_minutes >= 60){
              found_viewer.song_request_count = found_viewer.song_request_count + 1;
              found_viewer.session_minutes = 0;
            }

            var index = _.indexOf(viewerlist, _.find(viewerlist, {name: active_viewer}));

            // Replace item at index using native splice
            viewerlist.splice(index, 1, found_viewer);
            callback();
          }else{
            // Create a new viewer and push into viewer list
            var new_viewer = {"name": active_viewer ,"song_request_count":0,"banned":false,"last_request_time": now.toString(), "session_minutes": 1, "total_minutes": 1};
            viewerlist.push(new_viewer);
            callback();
          }


        }, function(err) {

          // Update viewers_list.json
          try {
            fs.writeFileSync(path.join(__dirname, '/../data/viewers_list.json'), JSON.stringify(viewerlist));
            console.log('Updated Viewers List');
            //io.emit('viewer_list_updated');
          } catch (err) {
            console.log('Error writing viewerlist file');
            console.log(err);
          }

        });


      }
    });


  });

}
