import { Component } from '@angular/core';
import { CharacterName, CensusService } from 'app-services';
import { Observable } from 'rxjs';

@Component({
    selector: 'application-form-component',
    templateUrl: './application-form.component.html'
})
export class ApplicationFormComponent {
    characterSuggestions: CharacterName[];
    constructor( private census: CensusService ) {
    }
    
    updateSuggestions( $event: any ): void {
        this.census.getCharcterName( $event.query, 10 ).toPromise().then( characters => {
            console.log( characters );
            this.characterSuggestions = characters;
        } );
    }
//    ngOnInit() {}
//    ngOnDestroy() {}
}
