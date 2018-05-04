import { Component, OnInit, OnDestroy } from '@angular/core';
import { CharacterName, CensusService, CharacterProfile, BackendService, Requirement } from 'app-services';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { ViewModel, Profile } from './view-model';
import 'rxjs/add/operator/share';

@Component({
    selector: 'application-form-component',
    templateUrl: './application-form.component.html'
})
export class ApplicationFormComponent implements OnInit, OnDestroy {
    // private sb: Subscription = new Subscription();
    vm: ViewModel;

    selectedCharacter = new BehaviorSubject<CharacterName>( null );
    constructor( private census: CensusService, private backend: BackendService ) {
        this.vm = new ViewModel( census, backend );
    }

    updateSuggestions( $event: any ): void {
        this.vm.updateSuggestion( $event.query );
    }

    selectCharacter( $event: CharacterName ): void {
        this.vm.select( $event.character_id );
    }
    
    submit(): void {
        this.vm.updateRequirement();
    }

    ngOnInit() {
        this.vm.init();
        this.vm.updateSuggestionCount( 10 );
        this.vm.updateRequirement();
    }
    ngOnDestroy() {
        this.vm.destroy();
    }
}
