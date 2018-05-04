import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Census } from '@weakenedplayer/census-api';

import { CensusHttp } from './http';
import { CharacterProfile, CharacterName } from './types';

const CENSUS_MIN_NAME_LENGTH = 3;
const CENSUS_MAX_NAME_LENGTH = 32;

@Injectable()
export class CensusService {
    private api: Census.RestApi;
    private characterNameQuery = new Census.RestQuery( 'character_name' );
    private characterProfileQuery = new Census.RestQuery( 'character' );
    constructor( private http: HttpClient ) {
        this.api = new Census.RestApi( this.http );
        
        this.characterProfileQuery
        .join( 'w', 'characters_world', join => {
            join.nest( 'wj', 'world' );
        } )
        .join( 'o', 'outfit_member_extended' )
        .join( 'f', 'faction' );
    }

    getCharcterName( partOfName: string, count: number = 10 ): Observable<CharacterName[]> {
        let tmp: string = partOfName.replace( /[\W|_]/g, '').substr( 0, CENSUS_MAX_NAME_LENGTH - 1 ).toLowerCase();

        if( tmp.length >= CENSUS_MIN_NAME_LENGTH && count > 0 ) {
            this.characterNameQuery
            .where( 'name.first_lower',  t => t.startWith( tmp ) )
            .limit( count );
            return this.api.get( this.characterNameQuery );
        } else {
            return of( [] );
        }
    }

    getCharcterProfile( characterId: string ): Observable<CharacterProfile> {
        this.characterProfileQuery.where( 'character_id',  t => t.equals( characterId ) );
        return this.api.get( this.characterProfileQuery )
        .pipe(
            map( profiles => ( profiles.length > 0 ? profiles[0] : [] ) )
        );
    }
}
