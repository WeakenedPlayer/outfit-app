import { CharacterName, CensusService, CharacterProfile, BackendService, Requirement } from 'app-services';
import { Observable, BehaviorSubject, Subject, Subscription, of, empty, combineLatest } from 'rxjs';
import { flatMap, share, map, shareReplay, tap } from 'rxjs/operators';
/* ----------------------------------------------------------------------------
 * 候補の表示
 * プロフィールの表示
 * 応募可否の判定
 * ------------------------------------------------------------------------- */

const MIN_LENGTH = 3;

export interface Profile {
    id: string;
    name: string;
    battleRank: string;
    aspLevel: string;
    faction: string;
    factionId: string;
    world: string;
    worldId: string;
    outfit: string;
    outfitAlias: string;
}

export class ViewModel {
    // input
    private partOfName$: Subject<string> = new Subject();
    private suggestionLimit$: Subject<number> = new Subject( );
    private selectedCharacterId$: Subject<string> = new Subject();
    private updateRequirement$: Subject<void> = new Subject();
    private requirement$: Observable<Requirement>;

    selectedProfile$: Observable<Profile>;
    suggestion$: Observable<CharacterName[]>;
    submitDisabled$: Observable<boolean>;

    private sb: Subscription = new Subscription();
    private test: boolean = false;
    constructor( private census: CensusService, private backend: BackendService ) {
        // --------------------------------------------------------------------
        // 候補
        // --------------------------------------------------------------------
        this.suggestion$ = combineLatest( this.partOfName$, this.suggestionLimit$ )
        .pipe(
            flatMap( ( [ name, limit ]: [ string, number ] ) => {
                if( name.length >= MIN_LENGTH && limit > 0 ) {
                    return this.census.getCharcterName( name, limit );
                } else {
                    return of( [] );
                }
            } ),
            shareReplay( 1 )
        );
        
        // --------------------------------------------------------------------
        // プロフィール
        // --------------------------------------------------------------------
        this.selectedProfile$ =  this.selectedCharacterId$
        .pipe(
            flatMap( characterId => {
                if( characterId ) {
                    return this.census.getCharcterProfile( characterId );                
                } else {
                    return empty();
                }
            } ),
            map( ( profile: CharacterProfile ) => {
            let tmp: Profile = null;
                if( profile ) {
                    tmp = {
                        id: profile.character_id,
                        name: profile.name.first,
                        battleRank: profile.battle_rank.value,
                        aspLevel: profile.prestige_level,
                        faction: profile.faction_id_join_faction.name.en,
                        factionId: profile.faction_id,
                        world: profile.character_id_join_characters_world.world_id_join_world.name.en,
                        worldId: profile.character_id_join_characters_world.world_id,
                        outfit: ( profile.character_id_join_outfit_member_extended? profile.character_id_join_outfit_member_extended.name : '' ),
                        outfitAlias: ( profile.character_id_join_outfit_member_extended? profile.character_id_join_outfit_member_extended.alias : '' ),
                    };
                }
                return tmp;
            } ),
            shareReplay( 1 )
        );

        // --------------------------------------------------------------------
        // 要件(サーバと勢力)の確認
        // --------------------------------------------------------------------
        this.requirement$ = this.updateRequirement$
        .pipe(
            flatMap( () => {
                return this.backend.getRequirement();
            } ),
            shareReplay( 1 )
        );
        
        // --------------------------------------------------------------------
        // Submitできるかどうか
        // --------------------------------------------------------------------
        this.submitDisabled$ = combineLatest( this.selectedProfile$, this.requirement$ )
        .pipe(
            map( ( [ profile, requirement ]: [ Profile, Requirement ] ) => {
                let result = ( !profile || !requirement || ( profile.worldId !== requirement.world_id ) || ( profile.factionId !== requirement.faction_id ) );
                return result;
            } ),
            shareReplay( 1 )
        );
    }
    
    updateSuggestion( name: string ): void {
        this.partOfName$.next( name );
    }
    
    updateSuggestionCount( limit: number ): void {
        this.suggestionLimit$.next( limit );
    }
    
    updateRequirement(): void {
        this.updateRequirement$.next();
    }
    
    select( characterId: string ): void {
        this.selectedCharacterId$.next( characterId );
    }
    
    register( id: string ): void {}
    
    init(): void {
        this.sb.add( this.suggestion$.subscribe() );
        this.sb.add( this.selectedProfile$.subscribe() );
        this.sb.add( this.requirement$.subscribe() );
        this.sb.add( this.submitDisabled$.subscribe() );
    }
    
    destroy(): void {
        this.sb.unsubscribe();
        this.sb = new Subscription();
    }
}