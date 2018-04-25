

export interface CensusQuery {
    toString(): string;
}

export abstract class CommandQuery implements CensusQuery {
    constructor( private command: string ) {}
    protected abstract content(): string;
    toString(): string {
        return 'c:' + this.command + '=' + this.content();
    }
}

export class ListLikeQuery extends CommandQuery {
    constructor( command: string, private values: string[] ) {
        super( command );
    }
    
    content(): string {
        return this.values.join(',');
    }
}

export class ShowQuery extends ListLikeQuery {
    constructor( private fields: string[] ) { super( 'show', fields ); }
}

export class HideQuery extends ListLikeQuery {
    constructor( private fields: string[] ) { super( 'hide', fields ); }
}

