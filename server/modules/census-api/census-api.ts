import { Observable } from 'rxjs';
import { Message } from './types';

// Census API とのやりとりの抽象化…外部から提供する

export interface ICensusApi {
    message$: Observable<Message>;
    send( data: any ): void;
}
