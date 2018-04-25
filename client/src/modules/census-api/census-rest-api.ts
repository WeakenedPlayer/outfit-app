import { Observable, Subscriber } from 'rxjs';
import * as format from 'string-format';


export interface CensusRestApiOption {
    environment: string;
    serviceId: string;
}

export interface UrlParameters {
    target: string
}

export interface IHttp {
    get( url: string ): Promise<any>;
}

const DEFAULT_ENVIRONMENT = 'ps2:v2';
const DEFAULT_SERVICEID = 'example';
const BASE_URL = 'http://census.daybreakgames.com/s:{sid}/{method}/{environment}/{collection}/?{query}';

export class CensusRestApi {
    private baseUrl: string;
    constructor( private http: IHttp, option: CensusRestApiOption ) {
        
        this.baseUrl = format( BASE_URL, {
            environment: option.environment || DEFAULT_ENVIRONMENT,
            serviceId:   option.serviceId   || DEFAULT_SERVICEID
        } )
    }
    
    private request( method: string, collection: string, query: string ): Promise<any> {
        let url = format( this.baseUrl, method, collection, query );
        return this.http.get( method );
    }
    
    get( collection: string, query: string ): Promise<any> {
        return this.request( 'get', collection, query );
    }

    count( collection: string, query: string ): Promise<any> {
        return this.request( 'count', collection, query );
    }

}
//'http://census.daybreakgames.com/s:'+serviceId+'/get/ps2:v2/character/?character_id='+characterId+'&c:show=name'