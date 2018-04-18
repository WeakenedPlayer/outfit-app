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
    
    constructor( private http: Http ) {
        
    }
    onSubmit() {
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
