import { Component } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    name: string = 'name';
    password: string = 'pwd';
    token: string = 'no';
    recaptcha: string = '';
    constructor( private http: Http ) {
        
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
}
