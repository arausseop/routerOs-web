import { Injectable, Pipe } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { UrlApiService } from './url-api-service.service';
import { NbTokenService } from '../../auth/services/token/token.service';
import { Routers, RoutersData } from '../data/routers-data';

@Injectable()
export class RoutersService extends RoutersData {

    baseUrl = this.urlApi.urlApi;
    private readonly apiController: string = 'routers';
    accessToken: string;
    routerData: any = {};

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

    getRouters(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.getApiRoutersData());
        });
    }

    getRoutersByGroup(groupName: string = null): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.getApiRoutersByGroupData(groupName));
        });
    }

    getRouter(routerId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.getApiRouterData(routerId));
        });
    }

    newRouter(data: object): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.saveRouterData(data));
        });
    }

    editRouter(routerId: string, data: object): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.editRouterData(routerId, data));
        });
    }

    changeRouterPassword(routerId: string, data: object): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.changeRouterPasswrodData(routerId, data));
        });
    }

    deleteRouter(routerId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.deleteRouterData(routerId));
        });
    }

    getApiRoutersData() {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });
        return this.http.get(this.baseUrl + this.apiController, { headers });
    }

    getApiRoutersByGroupData(groupName: string) {
        let params = new HttpParams()
            .set('group', groupName);

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });
        return this.http.get(this.baseUrl + this.apiController + '/groups/agents', { headers, params: params });
    }

    getApiRouterData(routerId: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });
        return this.http.get(this.baseUrl + this.apiController + '/' + routerId, { headers });
    }

    editRouterData(routerId: any, data: any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });
        const body = data;
        return this.http.put(
            this.baseUrl + this.apiController + '/' + routerId, body, { headers },
        );
    }

    changeRouterPasswrodData(routerId: any, data: any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });
        const body = data;
        return this.http.put(
            this.baseUrl + this.apiController + '/change-password/' + routerId, body, { headers },
        );
    }

    saveRouter(data: object) {
        return new Promise((resolve, reject) => {
            resolve(this.saveRouterData(data));
        });
    }
    saveRouterData(data: object) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });
        const body = data;
        return this.http.post(
            this.baseUrl + this.apiController, body, { headers },
        );
    }

    deleteRouterData(routerId: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });

        return this.http.delete(`${this.baseUrl}${this.apiController}/${routerId}`, { headers });
    }


}
