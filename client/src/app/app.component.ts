import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs';

import { QueryBuilder, CommandBuilder } from '../modules/census-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
    title = 'app';
    formGroup: FormGroup;
    name: FormControl;
    password: string = 'pwd';
    token: string = 'no';
    recaptcha: string = '';
    sb: Subscription = null;
    constructor( private http: Http ) {
        this.formGroup = new FormGroup( {
            name: new FormControl()
        } );
        this.formGroup.controls.name.valueChanges.subscribe( a => console.log( a ) );
        
        let query = new QueryBuilder();
        query.equals( 'name', 'hello' )
        .lessThan( 'outfit', '10' );
        console.log( query.toString() );
        

        let command = new CommandBuilder();
        command.show( [ 'name' ] ).hide( [ 'outfit' ] );
        console.log( command.toString() );
        
    }
    
    resolved( result: string ) {
        console.log( result );
        this.recaptcha = result;
        this.http.post( '/submit', {
            name: this.name,
            recaptcha: result
        } ).toPromise().then( ( res: Response ) => {
            console.log( res );
        } );
    }
    
    onSubmit() {
        this.http.post( '/submit', {
            name: this.name,
            recaptcha: this.recaptcha
        } ).toPromise().then( ( res: Response ) => {
            console.log( res );
        } );
    }
    
    onLogin() {
        this.http.post( '/auth/login', { name: this.name, password: this.password } ).toPromise().then( ( res: Response ) => {
            let token = this.retrieveToken( res );
            if( token ){
                this.token = token;
            }
        } );
    }
    
    onRefresh() {
        let headers = new Headers( { 'Authorization': 'Bearer ' + this.token } );
        let options = new RequestOptions( { headers: headers } );
        this.http.get( '/auth/refresh', options ).toPromise().then( ( res )=>{
            let token = this.retrieveToken( res );
            if( token ){
                this.token = token;
            }
        } ).catch( ( err ) => {
            console.log( err );
            console.log( 'e' );
        } );
    }
    
    onNoToken() {
        this.http.get( '/auth/refresh' ).toPromise().then( ( res )=>{
            console.log( res );
        } );
    }
    
    onRegister() {
        let data = { name: this.name, password: this.password };
        console.log( data );
        this.http.post( '/auth/register', { name: this.name, password: this.password } )
        .toPromise()
        .then( ( res: Response ) => {
            let token = this.retrieveToken( res );
            if( token ){
                this.token = token;
            }
            console.log( res );
        } );
    }
    private retrieveToken( response: Response ): string {
        let res: any = response.json();
        let token: string = res.token;
        return token;
    }
    
    ngOnDestroy(): void {
        this.sb.unsubscribe();
    }
}
