import { Injectable, Pipe } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Notification, NotificationData } from '../data/notification-data';
import { Router } from '@angular/router';
import { UrlApiService } from './url-api-service.service';
import { NbTokenService } from '../../auth/services/token/token.service';

@Injectable()
export class NotificationService extends NotificationData {

  baseUrl = this.urlApi.urlApi;
  private readonly apiController: string = 'notifications';
  accessToken: string;
  regionData: any = {};

  constructor (
      private http: HttpClient,
      private urlApi: UrlApiService,
      private tokenService: NbTokenService
      
  ) {
    super();
    this.tokenService.get().subscribe((res: any)=>{
      this.accessToken = res.token.access_token;
    });
  }

  data = [];

  getData() {
    return this.data;
  }

  getNotifications(): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(this.getApiNotificationsData());
    });
  }

  getNotification(notificationId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(this.getApiNotificationData(notificationId));
    });
  }

  readNotification(notificationId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(this.readApiNotificationData(notificationId));
    });
  }

  readAllNotifications(notificationArray: any): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(this.readApiAllNotificationData(notificationArray));
    });
  }

  getCheckNotification(): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(this.getCheckApiNotificationData());
    });
  }

  getNotificationUsers(notificationId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(this.getApiNotificationUsersData(notificationId));
    });
  }

  getApiNotificationsData() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + this.apiController, { headers });
  }

  getApiNotificationUsersData(notificationId) {
    let params = new HttpParams()
      .set('region', notificationId);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + 'region/users/', { headers: headers, params: params });
  }


  getApiNotificationData(notificationId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + this.apiController + '/' + notificationId, { headers });
  }  

  readApiNotificationData(notificationId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    const body = null;
    return this.http.put(
      this.baseUrl + this.apiController + '/' + notificationId + '/read', body , { headers },
    );
  }  

  readApiAllNotificationData(notificationArray: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    const body = { notificationsArray: notificationArray };
    return this.http.put(
      this.baseUrl + this.apiController + '/read/all', body , { headers },
    );
  }  

  getCheckApiNotificationData() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + this.apiController + '/check', { headers });
  }  

  getCheckApiNotificationObservableData(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + this.apiController + '/check', { headers });
  }  

}
