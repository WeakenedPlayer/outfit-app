// Get dependencies
import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as Discord from 'discord.js';
import * as http from 'http';
import * as request from 'request';

// import { DISCORD_TOKEN, CENSUS_API_KEY, id2name } from './const';
import { Observable } from 'rxjs';
import { EventStream, EventFilter, CensusConstant, Event } from './modules/census-api';
import { CensusWebsocket } from './modules/census-ws';

let config = JSON.parse( process.env.OUTFIT_CONFIG );
let target: string[] = config.TARGET || [];
let serviceId: string = config.CENSUS_API_SERVICE_ID || 'example' ;
let token: string = config.DISCORD_TOKEN || '';
let recaptcha: string = config.RECAPTCHA_SECRET || '';


//　console.log( target );
//　console.log( serviceId );
//　console.log( recaptcha );
//　console.log( token );

let names: { [id:string]: string } = {};

//-----------------------------------------------------------------------------------------
// discord
//-----------------------------------------------------------------------------------------
let discordClient = new Discord.Client();
let channel: Discord.TextChannel;
let ownerId = '';
//setting
discordClient.on('ready', () => {
    console.log( 'Discord Ready.' );
    discordClient.fetchApplication()
    .then( apps => {
        ownerId = apps.owner.id;
    } );
} );

discordClient.on( 'message', ( message ) => {
    if( message.author.id !== discordClient.user.id ) {
        if( ownerId === message.author.id ) {
            if( message.content === 'start' ) {
                channel = message.channel as Discord.TextChannel;
                console.log( 'start...channel id: ' + channel.id );
            }
        }
    }
} );

function getChannel() {
    return channel;
}

//-----------------------------------------------------------------------------------------
// Census API
//-----------------------------------------------------------------------------------------
let cws = new CensusWebsocket( 'ps2', serviceId );
let log = new EventStream( cws );
let loginPlayer: Event.PlayerLogin = null;
let logoutPlayer: Event.PlayerLogout = null;

//log.serviceMessage$.subscribe( msg => console.log( msg ) );
log.playerLogin$.flatMap( data => { 
    let characterId: string = data.character_id;

    return Observable.create( ( observer ) => {
        let name: string = names[ characterId ];
        if( !name ) {
            http.get( 'http://census.daybreakgames.com/s:'+serviceId+'/get/ps2:v2/character/?character_id='+characterId+'&c:show=name', ( res ) => {
                let body = '';
                let data;
                res.setEncoding('utf8');

                res.on('data', ( chunk ) => {
                    data = JSON.parse( chunk.toString() );
                    if( data.returned > 0 ) {
                        let newName = data.character_list[0].name.first;
                        console.log( 'new name added:' + newName );
                        names[ characterId ] = newName;
                        observer.next( newName );
                        observer.complete();
                    } else {
                        observer.next( null );
                        // Census API応答が止まった時はあきらめる
                        // observer.error( 'Census REST API error.' );
                    }
                } );
            } );
        } else {
            observer.next( name );
            observer.complete();
        }
    } );
} ).map( ( name ) => {
    let ch = getChannel();                
    if( ch && name ) {
        ch.send( 'アウトフィット参加希望の'+ name + 'がログインしました。\nCommanderの方は /outfit invite ' + name + 'で招待してください。');
    }
} ).subscribe();

log.playerLogout$.map( data => {
    let characterId: string = data.character_id;
    let name: string = names[ characterId ];

    if( !name ) {
        let ch = getChannel();                
        if( ch && name ) {
            ch.send( 'アウトフィット参加希望の'+ name + 'がログアウトしました。');
        }
    }
} )


let filter = new EventFilter( target, [] );
//-----------------------------------------------------------------------------------------
//cws.connect().then( ()=>{
//    return log.addEvent( [ 'PlayerLogin' ], filter );
//} ).then( ( sb ) => {
//    console.log( sb );
//    console.log( 'Census API ready.' );
//    return discordClient.login( token );
//} ).then( ( res ) => {
//    console.log( 'Discord Login: ' + res );
//} ).catch( ( err ) => {
//    console.log( err );
//} );
//

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
const secret = '6Lcu-FQUAAAAAHAk2PJ3KDe-6sIb1C3RGK2KB32e';

app.post('/submit', (req, res) => {
    let verifyUrl = 'https://www.google.com/recaptcha/api/siteverify?secret='+secret+'&response=' + req.body.recaptcha;
    request( verifyUrl, ( err, res, body ) => {
        if( err ) {
            res.json( {'aaa': 2} );
        }
        console.log( JSON.parse(body) );
        res.json( {'aaa': 1} );
    } );
} );

app.get('/login', (req, res) => {
    res.json( loginPlayer );
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
