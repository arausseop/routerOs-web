import { Injectable, Pipe } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { UrlApiService } from './url-api-service.service';
import { NbTokenService } from '../../auth/services/token/token.service';
import { RouterSetting, RoutersSettingsData } from '../data/routers-settings-data';
import * as _ from 'lodash';

@Injectable()
export class RoutersSettingsService extends RoutersSettingsData {

    baseUrl = this.urlApi.urlApi;
    private readonly apiController: string = 'routers-settings';
    accessToken: string;
    routerSettingData: any = {};

    constructor(
        private http: HttpClient,
        private urlApi: UrlApiService,
        private tokenService: NbTokenService

    ) {
        super();
        this.tokenService.get().subscribe((res: any) => {
            this.accessToken = res.token.access_token;
        });
    }

    data = [];

    getBaseEndpoint() {
        return this.baseUrl + this.apiController;
    }

    getData() {
        return this.data;
    }

    getRouterSettings(routerSettingApiEndpoint: string, requestParams: object): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.getApiRoutersSettingsData(routerSettingApiEndpoint, requestParams));
        });
    }

    getRouterSetting(routerSettingApiEndpoint: string, routerId: string, requestParams: object): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.getApiRouterSettingData(routerSettingApiEndpoint, routerId, requestParams));
        });
    }

    newRouterSetting(routerSettingApiEndpoint: string, data: object, requestParams: object): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.saveRouterSettingData(routerSettingApiEndpoint, data, requestParams));
        });
    }

    editRouterSetting(routerSettingApiEndpoint: string, routerId: string, data: object, requestParams: object): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.editRouterSettingData(routerSettingApiEndpoint, routerId, data, requestParams));
        });
    }

    deleteRouterSetting(routerSettingApiEndpoint: string, routerId: string, requestParams: object = null): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.deleteRouterSettingData(routerSettingApiEndpoint, routerId, requestParams));
        });
    }

    getApiRoutersSettingsData(routerSettingApiEndpoint: string, requestParams: object) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });

        let httpParams = new HttpParams();

        _.each(requestParams, (param, keyParam) => {
            httpParams = httpParams.set(keyParam, param);
        })
        return this.http.get(this.baseUrl + this.apiController + '/' + routerSettingApiEndpoint, { headers: headers, params: httpParams });
    }

    getApiRouterSettingData(routerSettingApiEndpoint: string, routerId: string, requestParams: object) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });

        let httpParams = new HttpParams();

        _.each(requestParams, (param, keyParam) => {
            httpParams = httpParams.set(keyParam, param);
        })
        return this.http.get(this.baseUrl + this.apiController + '/' + routerSettingApiEndpoint + '/' + routerId, { headers: headers, params: httpParams });
    }

    editRouterSettingData(routerSettingApiEndpoint, routerId: any, data: any, requestParams: object) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });

        let httpParams = new HttpParams();

        _.each(requestParams, (param, keyParam) => {
            httpParams = httpParams.set(keyParam, param);
        })
        const body = data;
        return this.http.put(
            this.baseUrl + this.apiController + '/' + routerSettingApiEndpoint + '/' + routerId, body, { headers: headers, params: httpParams },
        );
    }

    saveRouterSetting(routerSettingApiEndpoint: string, data: object, requestParams: object) {
        return new Promise((resolve, reject) => {
            resolve(this.saveRouterSettingData(routerSettingApiEndpoint, data, requestParams));
        });
    }
    saveRouterSettingData(routerSettingApiEndpoint: string, data: object, requestParams: object) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });

        let httpParams = new HttpParams();

        _.each(requestParams, (param, keyParam) => {
            httpParams = httpParams.set(keyParam, param);
        })

        const body = data;
        return this.http.post(
            this.baseUrl + this.apiController + '/' + routerSettingApiEndpoint, body, { headers: headers, params: httpParams },
        );
    }

    deleteRouterSettingData(routerSettingApiEndpoint: string, routerId: string, requestParams: object) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });

        let httpParams = new HttpParams();

        _.each(requestParams, (param, keyParam) => {
            httpParams = httpParams.set(keyParam, param);
        })

        return this.http.delete(`${this.baseUrl}${this.apiController}/${routerSettingApiEndpoint}/${routerId}`, { headers: headers, params: httpParams });
    }


}
