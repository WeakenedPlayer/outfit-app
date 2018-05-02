import { Component } from '@angular/core';
import { CharacterName, CensusService } from 'app-services';
import { Observable, BehaviorSubject } from 'rxjs';

const MIN_LENGTH = 3;

@Component({
    selector: 'application-form-component',
    templateUrl: './application-form.component.html'
})
export class ApplicationFormComponent {
    characterSuggestions: CharacterName[] = [];
    selectedCharacter = new BehaviorSubject<CharacterName>( null );
    constructor( private census: CensusService ) {
        this.selectedCharacter
        .filter( character => !!character )
        .flatMap( character => {
            return this.census.getCharcterProfile( character.id );
        } ).subscribe( a => console.log( a ) );

    }

    updateSuggestions( $event: any ): void {
        // event$.query
        let name: string = $event.query;
        if( name.length >= MIN_LENGTH ) {
            this.census.getCharcterName( $event.query, 5 )
            .toPromise()
            .then( characters => {
                console.log( characters );
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
