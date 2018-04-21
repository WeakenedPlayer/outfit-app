import { Observable } from 'rxjs';
import { Message, Response, Event } from './types';
import { EventFilter } from './event-filter';
import { ICensusApi } from './census-api';

export class EventSubscriber {
    private message$: Observable<Message>;
    //---------------------------------------------------------------------
    // イベント
    //---------------------------------------------------------------------
    private _event$: Observable<any>;
    private _achievementEarned$: Observable<Event.AchievementEarned>;
    private _battleRankUp$: Observable<Event.BattleRankUp>;
    private _death$: Observable<Event.Death>;
    private _itemAdded$: Observable<Event.ItemAdded>;
    private _skillAdded$: Observable<Event.SkillAdded>;
    private _vehicleDestroy$: Observable<Event.VehicleDestroy>;
    private _gainExperience$: Observable<Event.GainExperience>;
    private _playerFacilityCapture$: Observable<Event.PlayerFacilityCapture>;
    private _playerFacilityDefend$: Observable<Event.PlayerFacilityDefend>;
    private _continentLock$: Observable<Event.ContinentLock>;
    private _continentUnlock$: Observable<Event.ContinentUnlock>;
    private _facilityControl$: Observable<Event.FacilityControl>;
    private _metagameEvent$: Observable<Event.MetagameEvent>;
    private _playerLogin$: Observable<Event.PlayerLogin>;
    private _playerLogout$: Observable<Event.PlayerLogout>;

    constructor( private ws: ICensusApi ) {
        //---------------------------------------------------------------------
        // connectable に変換する (複数のsubscriberが存在するため) 
        //---------------------------------------------------------------------
        this.message$ = this.ws.message$.publish().refCount();

        //---------------------------------------------------------------------
        // event系のメッセージからpayloadを取り出す
        //---------------------------------------------------------------------
        this._event$ = this.message$
        .filter( msg => msg[ 'payload' ] && msg[ 'payload'][ 'event_name'] )
        .map( msg => msg.payload )
        .publish().refCount();

        //---------------------------------------------------------------------
        // 個別のイベント
        //---------------------------------------------------------------------
        this._achievementEarned$ = this.filterEvent( 'AchievementEarned' ).publish().refCount();
        this._battleRankUp$ = this.filterEvent( 'BattleRankUp' ).publish().refCount();
        this._death$ = this.filterEvent( 'Death' ).publish().refCount();
        this._itemAdded$ = this.filterEvent( 'ItemAdded' ).publish().refCount();
        this._skillAdded$ = this.filterEvent( 'SkillAdded' ).publish().refCount();
        this._vehicleDestroy$ = this.filterEvent( 'VehicleDestroy' ).publish().refCount();
        this._gainExperience$ = this.filterEvent( 'GainExperience' ).publish().refCount();
        this._playerFacilityCapture$ = this.filterEvent( 'PlayerFacilityCapture' ).publish().refCount();
        this._playerFacilityDefend$ = this.filterEvent( 'PlayerFacilityDefend' ).publish().refCount();
        this._continentLock$ = this.filterEvent( 'ContinentLock' ).publish().refCount();
        this._continentUnlock$ = this.filterEvent( 'ContinentUnlock' ).publish().refCount();
        this._facilityControl$ = this.filterEvent( 'FacilityControl' ).publish().refCount();
        this._metagameEvent$ = this.filterEvent( 'MetagameEvent' ).publish().refCount();
        this._playerLogin$ = this.filterEvent( 'PlayerLogin' ).publish().refCount();
        this._playerLogout$ = this.filterEvent( 'PlayerLogout' ).publish().refCount();
    }

    //-------------------------------------------------------------------------
    // イベント
    //-------------------------------------------------------------------------
    get event$(): Observable<any> { return this._event$ }
    get achievementEarned$(): Observable<Event.AchievementEarned> { return this._achievementEarned$ }
    get battleRankUp$(): Observable<Event.BattleRankUp> { return this._battleRankUp$ }
    get death$(): Observable<Event.Death> { return this._death$ }
    get itemAdded$(): Observable<Event.ItemAdded> { return this._itemAdded$ }
    get skillAdded$(): Observable<Event.SkillAdded> { return this._skillAdded$ }
    get vehicleDestroy$(): Observable<Event.VehicleDestroy> { return this._vehicleDestroy$ }
    get gainExperience$(): Observable<Event.GainExperience> { return this._gainExperience$ }
    get playerFacilityCapture$(): Observable<Event.PlayerFacilityCapture> { return this._playerFacilityCapture$ }
    get playerFacilityDefend$(): Observable<Event.PlayerFacilityDefend> { return this._playerFacilityDefend$ }
    get continentLock$(): Observable<Event.ContinentLock> { return this._continentLock$ }
    get continentUnlock$(): Observable<Event.ContinentUnlock> { return this._continentUnlock$ }
    get facilityControl$(): Observable<Event.FacilityControl> { return this._facilityControl$ }
    get metagameEvent$(): Observable<Event.MetagameEvent> { return this._metagameEvent$ }
    get playerLogin$(): Observable<Event.PlayerLogin> { return this._playerLogin$ }
    get playerLogout$(): Observable<Event.PlayerLogout> { return this._playerLogout$ }

    //-------------------------------------------------------------------------
    // イベントをフィルタする
    //-------------------------------------------------------------------------
    private filterEvent( eventName: string ): Observable<any> {
        return this._event$
        .filter( payload => payload[ 'event_name' ] === eventName );
    }

    //-------------------------------------------------------------------------
    // コマンドを送信する
    //-------------------------------------------------------------------------
    private sendCommand( action: string, options?: any ): void {
        this.ws.send( {
            'service': 'event',
            'action': action,
            ...options
        } );
    }

    private sendSubscribeCommand( action: string, events: string[], filter: EventFilter, logicalAnd: boolean = false ): void {
        this.sendCommand( 'subscribe', {
            'eventNames': events,
            'characters': filter.characters,
            'worlds': filter.worlds,
            'logicalAndCharactersWithWorlds': ( logicalAnd ? 'true' : 'false' )
        } );
    }
    
    //-------------------------------------------------------------------------
    // 応答を待つ
    //-------------------------------------------------------------------------
    private waitMessage( cond: ( msg: Message ) => boolean ): Promise<Message> {
        return this.message$
        .filter( msg => cond( msg ) )
        .take( 1 )
        .toPromise();
    }

    private waitForPayload( cond: ( payload: any ) => boolean ): Promise<any> {
        return this.waitMessage( msg => msg[ 'payload' ] && cond( msg[ 'payload' ] ) )
        .then( msg => msg[ 'payload' ] );
    }

    private waitForSubscribe(): Promise<Response.Subscription> {
        return this.waitMessage( msg => !!msg[ 'subscription' ] )
        .then( msg => msg[ 'subscription' ] );
    }

    //-------------------------------------------------------------------------
    // 通知対象のイベントを追加する
    //-------------------------------------------------------------------------
    addEvent( events: string[], filter: EventFilter, logicalAnd: boolean = false ): Promise<Response.Subscription> {
        this.sendSubscribeCommand( 'subscribe', events, filter, logicalAnd );
        return this.waitForSubscribe(); 
    }
    
    //-------------------------------------------------------------------------
    // イベントを通知対象から除外する
    //-------------------------------------------------------------------------
    removeEvent( events: string[], filter: EventFilter, logicalAnd: boolean = false ): Promise<Response.Subscription> {
        this.sendSubscribeCommand( 'clearSubscribe', events, filter, logicalAnd );
        return this.waitForSubscribe(); 
    }

    //-------------------------------------------------------------------------
    // イベントの通知を停止する
    //-------------------------------------------------------------------------
    removeAllEvent(): Promise<Response.Subscription>{
        this.sendCommand( 'clearSubscribe', {
            'all': 'true'
        } );
        return this.waitForSubscribe(); 
    }

    //-------------------------------------------------------------------------
    // ログイン中のユーザ数とIDリストを取得する
    //-------------------------------------------------------------------------
    getRecentCharacterIds(): Promise<Response.RecentPlayerIds> {
        this.sendCommand( 'recentCharacterIds' );
        return this.waitForPayload( payload => payload[ 'recent_character_id_list' ] );
    }

    //-------------------------------------------------------------------------
    // ログイン中のユーザ数を取得する
    //-------------------------------------------------------------------------
    getRecentCharacterIdsCount(): Promise<Response.RecentPlayerIdsCount> {
        this.sendCommand( 'recentCharacterIdsCount' );
        return this.waitForPayload( payload => {
            return payload[ 'recent_character_id_count' ]; 
        } );
    }
}
