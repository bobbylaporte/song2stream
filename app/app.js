module.exports = () => {


  var express = require('express');


  var path = require('path');

  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var cors = require('cors');

  var home = require(path.join(__dirname, '/routes/home'));
  var index = require(path.join(__dirname, '/routes/index'));
  var api = require(path.join(__dirname, '/routes/api'));

  var app = express();
  var http = require( "http" ).createServer( app );




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
  




}
