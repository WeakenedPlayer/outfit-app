import {  } from '../census-api';
import { WebSocket } from 'ws-wrapper';

export class CensusWebsocket {
    private url: string = '';
    private ws: WebSocket;
    constructor( url: string, serviceId?: string ) {
        if( !url ) {
            throw new Error( 'URL is required.' );
        }
        
        if( !serviceId ) {
            serviceId = 'example';
        }
        
        this.url = url + '&service-id=s:' + serviceId;
        this.ws = new WebSocket();
    }
    
    
}