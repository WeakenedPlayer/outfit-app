//import { WebSocket } from './ws';
//
//export module CensusApi {
//    export enum WorldId {
//        CONNERY = 1
//    }
//}
//
//export class LoginMonitor {
//    private ws: WebSocket = new WebSocket();
//    constructor( serviceId: string, worldId: string ) {
//    }
//    
//    open(): Promise<void> {
//        return this.ws.open( url );
//    }
//    
//    close(): Promise<void> {
//        return this.ws.close();
//    }
//    
//    
//}
//
//const url = 'wss://push.planetside2.com/streaming?environment=ps2&service-id=s:' + CENSUS_API_KEY;
//const command = {
//    "service":"event",
//    "action":"subscribe",
//    "worlds":["1"], // connery
//    "eventNames":["PlayerLogin"]
//};
