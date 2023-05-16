export interface Routers {
    uuid?: string;
    identity?: string;
    ipAddress: string;
    login: string;
    password: string;
    connect?: boolean;
    name: string;
    description?: string;
}


export abstract class RoutersData {
    abstract getData(): any[];
    abstract getRouter(RouterId: string): Promise<any>;
    abstract getRouters(): Promise<any>;
    abstract getRoutersByGroup(groupName: string): Promise<any>;
    abstract saveRouter(data: object): Promise<any>;
    abstract newRouter(data: object): Promise<any>;
    abstract deleteRouter(RouterId: string): Promise<any>;
}
