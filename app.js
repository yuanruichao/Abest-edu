require('./db');
require('./auth');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var fileUpload = require('express-fileupload');

var home = require('./routes/home');
var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();

var session = require('express-session');
var sessionOptions = {
  secret: 'iloveabest',
  resave: true,
  saveUninitialized: true
};
app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist/')); // redirect popper js
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd/')); // redirect popper js
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-table/dist/')); // redirect bootstrap-table
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-table/dist')); // redirect CSS bootstrap
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts')); // redirect CSS bootstrap


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  // console.log(req);
  res.locals.user = req.user;
  next();
});

app.use('/', home);

app.use(function(req, res, next){
  if(req.user) return next();

  console.log("not logedin");
  res.redirect('/login');

});

app.use('/', index);
app.use('/users', users);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user


module.exports = app;
