import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Census } from '@weakenedplayer/census-api';
import 'rxjs/add/operator/map';

class CensusHttp implements Census.RestApiHttp {
    constructor( private http: HttpClient ) {
    }
    get( url: string ): Observable<any> {
        return this.http.get( url );
    }
}

export interface CharacterName {
    id: string;
    name: string;
}

@Injectable()
export class CensusService {
    private api: Census.RestApi;
    constructor( private http: HttpClient ) {
        this.api = new Census.RestApi( this.http );
    }
    
    getCharcterName( partOfName: string, count: number = 10 ): Observable<CharacterName[]> {
        let query = new Census.RestQueryBuilder().contains( 'name.first_lower', partOfName.toLowerCase() );
        let command = new Census.RestCommandBuilder().limit( 10 ).show( ['character_id', 'name.first' ] );
        let collection = 'character_name';
        return this.api.get( 'character_name', query, command ).map( res => {
            let items: CharacterName[] = [];
            if( res && res.returned > 0 ) {
                let list: any[] = res[ collection + '_list' ];
                list.map( item => {
                    items.push( { id: item[ 'character_id' ], name: item[ 'name' ][ 'first' ] } );
                } );
            }
            return items;
        } );
    }
}
