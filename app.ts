// Get dependencies
import * as express from 'express';
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//Parsers for POST data
app.use( logger('dev') );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( cookieParser());
app.use( express.static(path.join(__dirname, 'public')) );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Use API routes
//app.use('/api', api);

app.get('/:file', (req, res) => {
    var file = req.params.file;
    res.sendFile(path.join(__dirname, '../client/', file ));
} );

//Catch all other routes and return the index file
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html' ));
} );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err: any = new Error('Not Found');
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


module.exports = app;
