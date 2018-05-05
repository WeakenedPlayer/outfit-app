import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { tap, map, exhaustMap, catchError } from 'rxjs/operators';

import { Login, AuthActionTypes } from './action';


@Injectable()
export class AuthEffects {
    @Effect( { dispatch: false } )
    login$ = this.actions$.pipe(
            ofType( AuthActionTypes.Login ),
            map( ( action: Login ) => console.log( 'login' ) )
    );

    constructor( private actions$: Actions, private router: Router ) {}
}
