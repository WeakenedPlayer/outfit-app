// Get dependencies
import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import { DISCORD_TOKEN, CENSUS_API_KEY, id2name } from './const';
import { WebSocket } from './modules/ws-wrapper';
import { Observable } from 'rxjs';
import { EventSubscriber, ICensusWebsocket ,Message} from './modules/census-api';

const url = 'wss://push.planetside2.com/streaming?environment=ps2&service-id=s:' + CENSUS_API_KEY;

class CensusWebsocket implements ICensusWebsocket {
    private ws: WebSocket;
    constructor( private url: string ) {
        this.ws = new WebSocket();
    }
    
    get message$(): Observable<Message>{
        return this.ws.message$.filter( msg => msg.type === 'utf8' )
        .map( msg => JSON.parse( msg.utf8Data ) );
    }
    
    send( data: any ): void {
        return this.ws.send( JSON.stringify( data ) );
    }
    
    connect(): Promise<void> {
        return this.ws.open( this.url );
    }
    
    disconnect(): Promise<void> {
        return this.ws.close();
    }
}

let ws = new WebSocket();
//let log = new EventSubscriber( ws );
//
//ws.connect().then( () => {
//    log.getRecentCharacterIdsCount().then( result => console.log( result ) );
//} );

const command = {
    "service":"event",
    "action":"subscribe",
    "worlds":["1"], // connery
    "eventNames":["PlayerLogin"]
};

ws.message$.subscribe( ( msg ) => {
    console.log( msg );
} );

console.log('hey')
ws.open( url )
.then( () => {
    ws.send( JSON.stringify( command ) );
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
