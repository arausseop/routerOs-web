import { Injectable, Pipe } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { RoleGroup, RoleGroupData } from '../data/role-group-data';

import { Router } from '@angular/router';
import { UrlApiService } from './url-api-service.service';
import { NbTokenService } from '../../auth/services/token/token.service';

@Injectable()
export class RoleGroupService extends RoleGroupData {

    baseUrl = this.urlApi.urlApi;
    private readonly apiController: string = 'role-groups';
    accessToken: string;
    groupData: any = {};

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

    getData() {
        return this.data;
    }

    getGroups(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.getApiGroupsData());
        });
    }

    getGroup(groupId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.getApiGroupData(groupId));
        });
    }

    getApiGroupsData() {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });
        return this.http.get(this.baseUrl + this.apiController, { headers });
    }

    getApiGroupUsersData(groupId) {
        let params = new HttpParams()
            .set('group', groupId);

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });
        return this.http.get(this.baseUrl + 'role-groups/users/', { headers: headers, params: params });
    }

    getApiGroupData(groupId: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken
        });
        return this.http.get(this.baseUrl + this.apiController + '/' + groupId, { headers });
    }
}
