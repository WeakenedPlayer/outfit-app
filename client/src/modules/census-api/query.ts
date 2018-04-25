
// ?field=]10&field=[50
// [field] [modifier] [value ] & ...

export interface CensusQueryString {
    toString(): string;
}

export class QueryBuilder {
    private query: string = '';
    private append( field: string, modifier: string, value: string ): QueryBuilder {
        this.query = this.query + '&' + field + '=' + modifier + value;
        return this;
    }

    clear(): void {
        this.query = '';
    }
    
    toString(): string {
        return this.query;
    }

    equals( field: string, value: string ):             QueryBuilder{ return this.append( field, '', value  ) }
    lessThan( field: string, value: string ):           QueryBuilder{ return this.append( field, '<', value ) }
    lessThanOrEqual( field: string, value: string ):    QueryBuilder{ return this.append( field, '[', value ) }
    greaterThan( field: string, value: string ):        QueryBuilder{ return this.append( field, '>', value ) }
    greaterThanOrEqual( field: string, value: string ): QueryBuilder{ return this.append( field, ']', value ) }
    startWith( field: string, value: string ):          QueryBuilder{ return this.append( field, '^', value ) }
    contains( field: string, value: string ):           QueryBuilder{ return this.append( field, '*', value ) }
    not( field: string, value: string ):                QueryBuilder{ return this.append( field, '!', value ) }
}

export class CommandBuilder {
    private command: string = '';
    private concat( str: string ): CommandBuilder {
        this.command = this.command + str;
        return
    }
    private append( command: string, param: string ): CommandBuilder {
        this.command =  this.command + ',c:' + command + '=' + param;
        return this;
    }
    
    private appendList( command: string, list: string[] ): CommandBuilder {
        return this.append( command, list.join(',') );
    }
    
    private appendBoolean( command: string, value: boolean ): CommandBuilder {
        return this.append( command, value ? 'true' : 'false' );
    }

    clear(): void {
        this.command = '';
    }
    
    toString(): string {
        return this.command;
    }
    
    show( fields: string[] ): CommandBuilder                  { return this.appendList( 'show', fields ) }
    hide( fields: string[] ): CommandBuilder                  { return this.appendList( 'hide', fields ) }
    sort( fields: string[], accending: true ): CommandBuilder { return this.appendList( 'sort', fields ).concat( accending ? ':1' : ':-1' ) }
    has( field: string ): CommandBuilder                      { return this.append( 'has', field ) }
    resolve( fields: string[] ): CommandBuilder               { return this.appendList( 'resolve', fields ) }
    case( value: boolean ): CommandBuilder                    { return this.appendBoolean( 'case', value ) }
    limit( value: number ): CommandBuilder                    { return this.append( 'limit', String( value ) ) }
    limitPerDB( value: number ): CommandBuilder               { return this.append( 'limitPerDB', String( value ) ) }
    
    
    
}