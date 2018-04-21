import { Observable, Subject } from 'rxjs';
import { connection, IMessage } from 'websocket';
import ExtendableError from 'es6-error';

export module WsConnectionError {
    export class CannotSendMessageError extends ExtendableError{}
    export class CannotCloseConnection extends ExtendableError{}
}

export class WsConnection {
    private msg$: Subject<IMessage> = new Subject<IMessage>();

    constructor( private con: connection ) {
        // guard
        if( !con ) {
            throw new ReferenceError( 'connection object is invalid.' );
        }

        // add listeners
        this.con.on( 'message', ( message: IMessage ) => {
            this.msg$.next( message );
        } );
        
        this.con.on( 'error', ( err: Error ) => {
            this.msg$.error( err );
        } );
        
        this.con.on( 'close', () => {
            this.con.removeAllListeners();
            this.con = null;
            this.msg$.complete();
        } );
    }
    
    send( data: any ): void {
        // guard
        if( !this.con || !this.con.connected ) {
            throw new WsConnectionError.CannotSendMessageError( 'Cannot send message.' );
        }
        console.log( data );
        this.con.send( data );
    }
    
    destroy(): Promise<void> {
        return new Promise( (resolve, reject) => {
            // guard
            if( !this.con || !this.con.connected ) {
                reject( new WsConnectionError.CannotCloseConnection('Cannot close.') ); 
            }

            // add event for Promsie
            this.con.once( 'close', () => {
                resolve();
            } );
            
            // start closing
            this.con.close();
        } );
    }
    
    get message$(): Observable<IMessage> {
        return this.msg$.asObservable();
    }
    
    get opened(): boolean {
        return ( this.con !== null );
    }
}
