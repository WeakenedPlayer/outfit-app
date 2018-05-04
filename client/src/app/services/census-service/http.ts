import { HttpClient } from '@angular/common/http';
import { Census } from '@weakenedplayer/census-api';

import { Observable } from 'rxjs';
import { timeout } from "rxjs/operators";

export class CensusHttp implements Census.RestApiHttp {
    constructor( private http: HttpClient, private timeout: number ) {
    }
    get( url: string ): Observable<any> {
        return this.http.get( url ).pipe( timeout( this.timeout ) );
    }
}
