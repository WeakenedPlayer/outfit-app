import { Observable } from 'rxjs';
import { Message, SubscriptionResponse, RecentPlayerIdsResponse, RecentPlayerIdsCountResponse } from './census-types';

interface ICenssuWebsocket {
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
    constructor( private ws: ICenssuWebsocket ) {
        // connectable
        this.message$ = this.ws.message$.publish().refCount(); 
    }
    
    private sendCommand( action: string, options?: any ): void {
        this.ws.send( JSON.stringify( {
            'service': 'event',
            'action': action,
            ...options
        } ) );
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
        return this.message$
        .filter( msg => cond( msg ) )
        .first()
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
        this.sendCommand( 'recentCharacterIds' );
        return this.waitForPayload( payload => payload.recent_character_id_count );
    }
}
