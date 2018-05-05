import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CharacterName, CensusService, CharacterProfile, BackendService, Requirement } from 'app-services';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { ViewModel, Profile } from './view-model';

import { Store } from '@ngrx/store';
interface State {
    counter: number;
}


@Component({
    selector: 'application-form-component',
    templateUrl: './application-form.component.html'
})
export class ApplicationFormComponent implements OnInit, OnDestroy {
    vm: ViewModel;
    counter: Observable<number>;

    selectedCharacter = new BehaviorSubject<CharacterName>( null );
    constructor( private census: CensusService, private backend: BackendService, private store: Store<State> ) {
        this.vm = new ViewModel( census, backend );
        this.counter = store.select('counter');
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
        console.log('+')
        this.vm.init();
        this.vm.updateSuggestionCount( 5 );
        this.vm.updateRequirement();
    }
    
    ngOnDestroy() {
        this.vm.destroy();
    }
    

      increment(){
          console.log('+')
        this.store.dispatch({ type: 'INCREMENT' });
      }

      decrement(){
          console.log('-')
        this.store.dispatch({ type: 'DECREMENT' });
      }

      reset(){
          console.log('reset')
        this.store.dispatch({ type: 'RESET' });
      }
}
