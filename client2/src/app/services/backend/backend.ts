import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import * as format from 'string-format';

export interface Requirement {
    faction_id: string;
    world_id: string;
}

@Injectable()
export class BackendService {
    constructor( private http: HttpClient ) {
    }
    
    getRequirement(): Observable<Requirement> {
        return this.http.get<Requirement>( '/application/requirement' )
        .pipe( map( res => {
            return res as Requirement;                
        } ) );
    }    
    
    registerCharacter( id: string, captcha: string ): Observable<any> {
        return this.http.post( '/application/requirement', {
            'id': id,
            'captcha': captcha
        } );
    }
}
