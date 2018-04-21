import { Observable } from 'rxjs';
import { Message, SubscriptionResponse, RecentPlayerIdsResponse, RecentPlayerIdsCountResponse } from './census-types';

export interface ICensusWebsocket {
    message$: Observable<Message>;
    send( data: any );
}

export class IEventFilter {
    characters: string[];
    worlds: string[];
}

export class EventSubscriber {
    private filter: IEventFilter = null;
    private message$: Observable<Message>;
    constructor( private ws: ICensusWebsocket ) {
        // connectable
        this.message$ = this.ws.message$.publish().refCount(); 
    }
    
    private sendCommand( action: string, options?: any ): void {
        this.ws.send( {
            'service': 'event',
            'action': action,
            ...options
        } );
    }
    
    private sendSubscribeCommand( action: string, options?: any ): void {
        this.sendCommand( action, {
            'worlds': this.filter.worlds,
            'characters': this.filter.characters,
            ...options
        } );
    }
    
    // wait for response
    private waitMessage( cond: ( msg: Message ) => boolean ): Promise<Message> {
        console.log( 'wait start' );
        return this.message$
        .map( msg => {
            console.log(msg);
            return msg;
        } )
        .filter( msg => cond( msg ) )
        .take( 1 )
        .toPromise();
    }

    private waitForPayload( cond: ( payload: any ) => boolean ): Promise<any> {
        return this.waitMessage( msg => msg.payload && cond( msg.payload ) )
        .then( msg => msg.payload );
    }

    private waitForSubscribe(): Promise<SubscriptionResponse> {
        return this.waitMessage( msg => !!msg.subscribe )
        .then( msg => msg.subscribe );
    }

    
    echo(): Observable<any> {
        return Observable.defer( () => {
        } );
    }
    
    updateFilter( f: IEventFilter ): EventSubscriber {
        // take effects beggining on the next subscription
        this.filter = { ...f };
        return this;
    }

    // subscription command
    addEvent( events: string[] ): Promise<SubscriptionResponse> {
        this.sendSubscribeCommand( 'subscribe', {
            'events': events
        } );
        
        return this.waitForSubscribe(); 
    }
    
    removeEvent( events: string[] ): Promise<SubscriptionResponse> {
        this.sendSubscribeCommand( 'clearSubscribe', {
            'events': events
        } );

        return this.waitForSubscribe(); 
    }
    
    removeAllEvent(): Promise<SubscriptionResponse>{
        this.sendSubscribeCommand( 'clearSubscribe', {
            'all': 'true'
        } );

        return this.waitForSubscribe(); 
    }
    
    getRecentCharacterIds(): Promise<RecentPlayerIdsResponse> {
        this.sendCommand( 'recentCharacterIds' );
        return this.waitForPayload( payload => payload.recent_character_id_list );
    }
    
    getRecentCharacterIdsCount(): Promise<RecentPlayerIdsCountResponse> {
        this.sendCommand( 'recentCharacterIdsCount' );
        return this.waitForPayload( payload => {
            console.log( 'called ' );
            return payload.recent_character_id_count; 
        } );
    }
}
