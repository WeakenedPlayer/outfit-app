export interface JoinOptions {
    on?: string;
    to?: string;
    list?: boolean;
    show?: string[];
    hide?: string[];
    inject_at?: string;
    terms?: string;
    outer?: boolean;
}

export class JoinQuery {
    constructor( private typeOfCollectionToJoin: string, private option: JoinOptions ){
        this.typeOfCollectionToJoin = typeOfCollectionToJoin;
    }
    
    toString(){
        let query = 'c:join=' + this.typeOfCollectionToJoin 
                  +            ( this.option.on        ? '^on:'        + this.option.on              : '' )
                  +            ( this.option.to        ? '^to:'        + this.option.to              : '' )
                  + '^list:' + ( this.option.list      ? '1'                                  : '0')
                  +            ( this.option.show      ? '^show:'      + this.option.show.join('\'') : '' )
                  +            ( this.option.hide      ? '^hide:'      + this.option.hide.join('\'') : '' )
                  +            ( this.option.inject_at ? '^inject_at:' + this.option.inject_at       : '' )
                  +            ( this.option.terms     ? '^terms:'     + this.option.terms           : '' )
                  + '^outer:' + ( this.option.outer     ? '1'                                  : '0');
        return query;
    }
}
