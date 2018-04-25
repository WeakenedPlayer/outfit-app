export interface IHttp {
    get( url: string ): Promise<any>;
}
