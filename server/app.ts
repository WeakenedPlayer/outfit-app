// Get dependencies
import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

// import { DISCORD_TOKEN, CENSUS_API_KEY, id2name } from './const';
import { Observable } from 'rxjs';
import { EventStream, EventFilter, CensusConstant, Event } from './modules/census-api';
import { CensusWebsocket } from './modules/census-ws';

let cws = new CensusWebsocket( 'ps2' );
let log = new EventStream( cws );
let loginPlayer: Event.PlayerLogin = null;
let logoutPlayer: Event.PlayerLogout = null;

log.serviceMessage$.subscribe( msg => console.log( msg ) );

log.playerLogin$.subscribe( msg => { loginPlayer = msg });
log.playerLogout$.subscribe( msg => { logoutPlayer = msg } );

let filter = new EventFilter( [], [ 'all' ] );

cws.connect().then( ()=>{
    return log.addEvent( [ 'PlayerLogin', 'PlayerLogout' ], filter );
} ).catch( ( err ) => {
    console.log( err );
} );

let app = express();

//Parsers for POST data
if( process.env.NODE_ENV === 'development' ) {
    app.use( logger( 'dev' ) );    
}

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser());
app.use( express.static(path.join(__dirname, 'public')) );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Use API routes
//app.use('/api', api);

app.get('/login', (req, res) => {
    var file = req.params.file;
    res.json( loginPlayer );
} );

app.get('/logout', (req, res) => {
    var file = req.params.file;
    res.json( logoutPlayer );
} );

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
