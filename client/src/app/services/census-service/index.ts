import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Census } from '@weakenedplayer/census-api';
import 'rxjs/add/operator/map';

class CensusHttp implements Census.RestApiHttp {
    constructor( private http: HttpClient, private timeout: number ) {
    }
    get( url: string ): Observable<any> {
        return this.http.get( url )
        .timeout( this.timeout );
    }
}

export interface CharacterName {
    id: string;
    name: string;
}

@Injectable()
export class CensusService {
    private api: Census.RestApi;
    private characterNameQuery = new Census.RestQuery( 'character_name' );
    constructor( private http: HttpClient ) {
        this.api = new Census.RestApi( this.http );
        
        this.characterNameQuery
    }

    getCharcterName( partOfName: string, count: number = 10 ): Observable<CharacterName[]> {
        let query = new Census.RestQuery( 'character_name' )
        .where( 'name.first_lower',  t => t.startWith( partOfName ) )
        .limit( count );
        
        return this.api.get( query ).map( res => {
            let chracterNames: CharacterName[] = [];
            res.map( item => {
                chracterNames.push( { id: item[ 'character_id' ], name: item[ 'name' ][ 'first' ] } );
            } );
            return chracterNames;
        } );
    }

    getCharcterProfile( characterId: string ): Observable<CharacterName[]> {
        let query = new Census.RestQuery( 'character' )
        .where( 'character_id',  t => t.equals( characterId ) )
        .join( 'world', 'characters_world', join => {
            join.nest( 'world_join', 'world', ( join ) => {} );
        } )
        .join( 'outfit', 'outfit_member_extended', ( join ) => {
            join.show( ['name' ] );
        } );
        
        return this.api.get( query );
//        let joinWorld = new Census.RestJoinBuilder( 'world' );
//        let joinFaction = new Census.RestJoinBuilder( 'faction' );
//        let joinOutfit = new Census.RestJoinBuilder( 'outfit' );
//        let command = new Census.RestCommandBuilder().join( [joinWorld,joinFaction,joinOutfit] );
//        let collection = 'character';
//        console.log( command.toString() );
    }
}
// http://census.daybreakgames.com/get/ps2:v2/character/?character_id=5428257774260271201&c:join=characters_world(world),outfit_member_extended