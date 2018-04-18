var app = require('../app');
var port;
var ip;

if( process.env.NODE_ENV === 'development' ) {
    port = normalizePort( process.env.PORT || '3000' );
    ip = '127.0.0.1';
} else {
    port = normalizePort( process.env.OPENSHIFT_NODEJS_PORT || '8080' );
    ip = process.env.OPENSHIFT_NODEJS_IP;
}
app.set('port', port);


/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(port);
app.on( 'error', onError);
app.on( 'listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt( val, 10 );

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = app.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}
