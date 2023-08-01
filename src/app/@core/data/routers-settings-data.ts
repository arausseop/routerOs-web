export interface RouterSetting {
    uuid?: string;
    identity?: string;
    ipAddress: string;
    login: string;
    password: string;
    connect?: boolean;
    name: string;
    description?: string;
}


export abstract class RoutersSettingsData {
    abstract getData(): any[];
    abstract getRouterSetting(routerSettingApiEndpoint: string, routerId: string, requestParams: object): Promise<any>;
    abstract getRouterSettings(routerSettingApiEndpoint: string, requestParams: object): Promise<any>;
    abstract saveRouterSetting(routerSettingApiEndpoint: string, data: object, requestParams: object): Promise<any>;
    abstract newRouterSetting(routerSettingApiEndpoint: string, data: object, requestParams: object): Promise<any>;
    abstract deleteRouterSetting(routerSettingApiEndpoint: string, RouterId: string, requestParams: object): Promise<any>;
}
