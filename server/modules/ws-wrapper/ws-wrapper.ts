import { Observable, Subject, BehaviorSubject } from 'rxjs';
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
    private connection$: BehaviorSubject<WsConnection> = new BehaviorSubject( null );
    private msg$: Observable<IMessage>;

    constructor() {
        this.ws = new client();
        
        this.msg$ = this.connection$
        .filter( con => !!con )
        .flatMap( con => con.message$ ) 
        .publish()
        .refCount();
    }
    
    private updateConnection( con: WsConnection ): void {
        console.log( 'Websocket: update connection.' );
        this.con = con;
        this.connection$.next( this.con );
    }
    
    open( url: string ): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            // guard
            if( this.con ) {
                reject( new WebSocketError.CannotOpenError( 'Already opened.' ) );
            }

            // add listeners
            this.ws.once( 'connect', ( con: connection ) => {
                console.log( 'Websocket: opened.' );
                this.updateConnection( new WsConnection( con ) );
                resolve();
            } );
            
            this.ws.once( 'connectFailed', ( err ) => {
                console.log( 'Websocket: failed.', err );
                reject( new WebSocketError.OpenFailedError( err ) );
            } );
            
            this.ws.once( 'close', () => {
                console.log( 'Websocket: closed.' );
                this.updateConnection( null );
            } );

            this.ws.connect( url );
        } );
    }
    
    close(): Promise<void> {
        if( !this.con || !this.con.opened ) {
            throw new WebSocketError.CannotCloseError( 'Cannot close.' );
        }
        
        return this.con.destroy().then( () => {
            this.updateConnection( null );
            return Promise.resolve();
        } );
    }
    
    send( data: any ): void {
        if( !this.con ) {
            throw new Error( 'Not connected' );
        }
        this.con.send( data );
    }
    
    get message$(): Observable<IMessage> {
        return this.msg$;
    }
}
