import { Injectable, Pipe } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { UrlApiService } from './url-api-service.service';
import { NbTokenService } from '../../auth/services/token/token.service';
import { User, UserApiData } from '../data/user-api-data';

@Injectable()
export class UserApiService extends UserApiData {

  baseUrl = this.urlApi.urlApi;
  private readonly apiController: string = 'users';
  accessToken: string;
  userData: any = {};

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

  getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.getApiUsersData());
    });
  }

  getUsersByGroup(groupName: string = null): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.getApiUsersByGroupData(groupName));
    });
  }

  getUser(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.getApiUserData(userId));
    });
  }

  newUser(data: object): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.saveUserData(data));
    });
  }

  editUser(userId: string, data: object): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.editUserData(userId, data));
    });
  }

  changeUserPassword(userId: string, data: object): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.changeUserPasswrodData(userId, data));
    });
  }

  deleteUser(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.deleteUserData(userId));
    });
  }

  getApiUsersData() {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + this.apiController, { headers });
  }

  getApiUsersByGroupData(groupName: string) {
    let params = new HttpParams()
      .set('group', groupName);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + this.apiController + '/groups/agents', { headers, params: params });
  }

  getApiUserData(userId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + this.apiController + '/' + userId, { headers });
  }

  editUserData(userId: any, data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    const body = data;
    return this.http.put(
      this.baseUrl + this.apiController + '/' + userId, body, { headers },
    );
  }

  changeUserPasswrodData(userId: any, data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    const body = data;
    return this.http.put(
      this.baseUrl + this.apiController + '/change-password/' + userId, body, { headers },
    );
  }

  saveUser(data: object) {
    return new Promise((resolve, reject) => {
      resolve(this.saveUserData(data));
    });
  }
  saveUserData(data: object) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    const body = data;
    return this.http.post(
      this.baseUrl + this.apiController, body, { headers },
    );
  }

  deleteUserData(userId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.delete(`${this.baseUrl}${this.apiController}/${userId}`, { headers });
  }


}
