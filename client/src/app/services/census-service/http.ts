import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Census } from '@weakenedplayer/census-api';
import 'rxjs/add/operator/map';

export class CensusHttp implements Census.RestApiHttp {
    constructor( private http: HttpClient, private timeout: number ) {
    }
    get( url: string ): Observable<any> {
        return this.http.get( url )
        .timeout( this.timeout );
    }
}
