import { Observable, Subject } from 'rxjs';
import { client, connection, IMessage } from 'websocket';
import ExtendableError from 'es6-error';
import { WsConnection } from './ws-connection';

export module WebSocketError {
    export class CannotOpenError extends ExtendableError{};
    export class CannotCloseError extends ExtendableError{};
    export class OpenFailedError extends ExtendableError{};
}

export class WebSocket {
    private ws: client;
    private con: WsConnection = null;
    constructor() {
        this.ws = new client();
    }
    
    open( url: string ): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            // guard
            if( this.con ) {
                reject( new WebSocketError.CannotOpenError( 'Already opened.' ) );
            }

            // add listeners
            this.ws.once( 'connect', ( con: connection ) => {
                console.info( 'Websocket: opened.' );
                this.con = new WsConnection( con );
                resolve();
            } );
            
            this.ws.once( 'connectFailed', ( err ) => {
                console.error( 'Websocket: failed.', err );
                reject( new WebSocketError.OpenFailedError( err ) );
            } );
            
            this.ws.once( 'close', () => {
                console.info( 'Websocket: closed.' );
                this.con = null;
            } );

            this.ws.connect( url );
        } );
    }
    
    close(): Promise<void> {
        if( !this.con || !this.con.opened ) {
            throw new WebSocketError.CannotCloseError( 'Cannot close.' );
        }
        
        return this.con.destroy().then( () => {
            this.con = null;
            return Promise.resolve();
        } );
    }
    
    send( data: any ): void {
        this.con.send( data );
    }
    
    get message$(): Observable<IMessage> {
        return this.con.message$;
    }
}
