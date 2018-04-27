import { Observable, Subscriber } from 'rxjs';
import * as format from 'string-format';

import { QueryBuilder } from './query-builder';
import { CommandBuilder } from './command-builder';

const DEFAULT_ENVIRONMENT = 'ps2:v2';
const DEFAULT_SERVICEID = 'example';
const BASE_URL = 'http://census.daybreakgames.com/s:';

export interface CensusRestApiHttp {
    get( url: string ): Promise<any>;
}

export class CensusRestApiQuery {
    private _body = new QueryBuilder();
    private _command = new CommandBuilder();

    get body(): QueryBuilder { return this._body; }
    get command(): CommandBuilder { return this._command; }
    
    constructor( private collection: string ) {}
    
    toString(): string {
        let query = [ this._body.toString(), this._command.toString() ].join('&');
        return this.collection + ( query ? '?' + query : '' );  
    }
}

export class CensusRestApi {
    private baseUrl: string;
    constructor( private http: CensusRestApiHttp, serviceId: string = DEFAULT_SERVICEID, environment = DEFAULT_ENVIRONMENT ) {
        this.baseUrl = BASE_URL +  serviceId + '/{method}/' + environment + '/{query}';
    }
    
    private request( method: string, query: CensusRestApiQuery ): Promise<any> {
        let queryString: string;
    
        if( !query ) {
            throw new Error( 'No query specified.' );
        }
        
        queryString = query.toString();
        if( !queryString ) {
            throw new Error( 'Query string is empty.' );
        }
        
        let url = format( this.baseUrl, { method: method, query: query.toString() } );
        return this.http.get( url );
    }
    
    get( query: CensusRestApiQuery ): Promise<any> {
        return this.request( 'get', query );
    }

    count( query: CensusRestApiQuery ): Promise<any> {
        return this.request( 'count', query );
    }
}
