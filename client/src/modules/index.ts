import { Observable } from 'rxjs';

interface IHttp {
    get( url: string ): Promise<any>;
}

export class CensusRestApi {
    
}

//http.get( 'http://census.daybreakgames.com/s:'+serviceId+'/get/ps2:v2/character/?character_id='+characterId+'&c:show=name', ( res ) => {
//    let body = '';
//    let data;
//    res.setEncoding('utf8');
//
//    res.on('data', ( chunk ) => {
//        data = JSON.parse( chunk.toString() );
//        if( data.returned > 0 ) {
//            let newName = data.character_list[0].name.first;
//            console.log( 'new name added:' + newName );
//            names[ characterId ] = newName;
//            observer.next( newName );
//            observer.complete();
//        } else {
//            observer.next( null );
//            // Census API応答が止まった時はあきらめる
//            // observer.error( 'Census REST API error.' );
//        }
//    } );
//} );