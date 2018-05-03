import { Component } from '@angular/core';
import { CharacterName, CensusService, CharacterProfile } from 'app-services';
import { Observable, BehaviorSubject } from 'rxjs';

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

@Component({
    selector: 'application-form-component',
    templateUrl: './application-form.component.html'
})
export class ApplicationFormComponent {
    // view interface
    characterSuggestions: CharacterName[] = [];
    characterProfile$: Observable<Profile>;

    selectedCharacter = new BehaviorSubject<CharacterName>( null );
    constructor( private census: CensusService ) {
        this.characterProfile$ = this.selectedCharacter
        .filter( character => !!character )
        .flatMap( character => {
            return this.census.getCharcterProfile( character.character_id );
        } )
        .map( profile => {
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
        } );
    }

    updateSuggestions( $event: any ): void {
        // event$.query
        let name: string = $event.query;
        if( name.length >= MIN_LENGTH ) {
            this.census.getCharcterName( $event.query, 10 )
            .toPromise()
            .then( characters => {
                this.characterSuggestions = characters;
            } );
        } else {
            this.characterSuggestions = [];
        }
    }

    selectCharacter( $event: any ): void {
        console.log( $event );
        this.selectedCharacter.next( $event );
    }

    clearCharacter(): void {
        console.log( 'cleared' );
        this.selectedCharacter.next( null );
    }
//    ngOnInit() {}
//    ngOnDestroy() {}
}
