import { Observable } from 'rxjs';
import { WebSocket } from '../ws-wrapper';
import * as format from 'string-format';

import { IEventStreamWebsocket } from '../census-api';

const baseUrl = 'wss://push.planetside2.com/streaming?environment={environment}&service-id=s:{serviceId}';


export class CensusWebsocket implements IEventStreamWebsocket {
    private url: string = '';
    private ws: WebSocket;
    constructor( environment: string = 'ps2', serviceId: string = 'example' ) {
        this.url = format( baseUrl, { 'environment': environment, 'serviceId': serviceId } );
        this.ws = new WebSocket();
    }

    get message$(): Observable<any>{
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
