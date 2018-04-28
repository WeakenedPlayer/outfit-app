import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs'
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/take';

import { CensusService, CharacterName } from 'local-services';
// <re-captcha (resolved)="resolved($event)" name="captch" required siteKey="6Lcu-FQUAAAAAKJNo4yIgv4ukowhZrTDpUVAV9rj"></re-captcha>

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
    sb: Subscription = new Subscription();
    
    nameList: CharacterName[] = [];
    
    task: Observable<any>;

    constructor( private http: HttpClient, private census: CensusService ) {
        this.formGroup = new FormGroup( {
            name: new FormControl()
        } );

        this.task = this.formGroup.controls.name.valueChanges
        .debounceTime( 500 )
        .distinct()
        .switchMap( name => {
            console.log( '--------------------------------' );
            return this.census.getCharcterName( name, 10 );
        } )
        .map( res => {
            this.nameList = res;
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
   
    onTest(): void {
    }
    
    ngOnDestroy(): void {
        this.sb.unsubscribe();
    }
    
    ngOnInit(): void {
        this.sb.add( this.task.subscribe() );
    }
    
    trackById( index: number,item: CharacterName ): any {
        return item.id;
    }
}







//onLogin() {
//  this.http.post( '/auth/login', { name: this.name, password: this.password } ).toPromise().then( ( res: Response ) => {
//      let token = this.retrieveToken( res );
//      if( token ){
//          this.token = token;
//      }
//  } );
//}
//resolved( result: string ) {
//console.log( result );
//this.recaptcha = result;
//this.http.post( '/submit', {
//name: this.name,
//recaptcha: result
//} ).toPromise().then( ( res: Response ) => {
//console.log( res );
//} );
//}
//
//onRefresh() {
//  let headers = new Headers( { 'Authorization': 'Bearer ' + this.token } );
//  let options = new RequestOptions( { headers: headers } );
//  this.http.get( '/auth/refresh', options ).toPromise().then( ( res )=>{
//      let token = this.retrieveToken( res );
//      if( token ){
//          this.token = token;
//      }
//  } ).catch( ( err ) => {
//      console.log( err );
//      console.log( 'e' );
//  } );
//}

//onNoToken() {
//  this.http.get( '/auth/refresh' ).toPromise().then( ( res )=>{
//      console.log( res );
//  } );
//}
//
//onRegister() {
//  let data = { name: this.name, password: this.password };
//  console.log( data );
//  this.http.post( '/auth/register', { name: this.name, password: this.password } )
//  .toPromise()
//  .then( ( res: Response ) => {
//      let token = this.retrieveToken( res );
//      if( token ){
//          this.token = token;
//      }
//      console.log( res );
//  } );
//}
//private retrieveToken( response: Response ): string {
//  let res: any = response.json();
//  let token: string = res.token;
//  return token;
//}
