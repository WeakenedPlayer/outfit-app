import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { CensusRestApiHttp, CensusRestApiQuery, CensusRestApi } from '../modules/census-api';

//<re-captcha (resolved)="resolved($event)" name="captch" required siteKey="6Lcu-FQUAAAAAKJNo4yIgv4ukowhZrTDpUVAV9rj"></re-captcha>
class CensusHttp implements CensusRestApiHttp {
    headers: Headers;
    constructor( private http: HttpClient ) {
    }
    get( url: string ): Promise<any> {
        return this.http.get( url ).toPromise();
    }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
    title = 'app';
    formGroup: FormGroup;
    name: FormControl;
    password: string = 'pwd';
    token: string = 'no';
    recaptcha: string = '';
    sb: Subscription = null;
    
    api: CensusRestApi;
    query: CensusRestApiQuery;
    constructor( private http: HttpClient ) {
        this.formGroup = new FormGroup( {
            name: new FormControl()
        } );
        
        this.formGroup.controls.name.valueChanges.subscribe( a => console.log( a ) );
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
//        this.http.post( '/auth/login', { name: this.name, password: this.password } ).toPromise().then( ( res: Response ) => {
//            let token = this.retrieveToken( res );
//            if( token ){
//                this.token = token;
//            }
//        } );
    }
    
    onRefresh() {
        let headers = new Headers( { 'Authorization': 'Bearer ' + this.token } );
//        let options = new RequestOptions( { headers: headers } );
//        this.http.get( '/auth/refresh', options ).toPromise().then( ( res )=>{
//            let token = this.retrieveToken( res );
//            if( token ){
//                this.token = token;
//            }
//        } ).catch( ( err ) => {
//            console.log( err );
//            console.log( 'e' );
//        } );
    }
    
//    onNoToken() {
//        this.http.get( '/auth/refresh' ).toPromise().then( ( res )=>{
//            console.log( res );
//        } );
//    }
//    
//    onRegister() {
//        let data = { name: this.name, password: this.password };
//        console.log( data );
//        this.http.post( '/auth/register', { name: this.name, password: this.password } )
//        .toPromise()
//        .then( ( res: Response ) => {
//            let token = this.retrieveToken( res );
//            if( token ){
//                this.token = token;
//            }
//            console.log( res );
//        } );
//    }
//    private retrieveToken( response: Response ): string {
//        let res: any = response.json();
//        let token: string = res.token;
//        return token;
//    }
    
    onTest(): void {
        this.api.get( this.query ).then( result => {
            if( result.returned > 0 ) {
                console.log( JSON.stringify( result.character_list ) );
            }
        } );
    }
    
    ngOnDestroy(): void {
        this.sb.unsubscribe();
    }
    
    ngOnInit(): void {
        this.api = new CensusRestApi( new CensusHttp( this.http ) );
        this.query = new CensusRestApiQuery( 'character' );
        this.query.body.contains( 'name.first', 'party' );
        this.query.command.case( false );
    }
}
