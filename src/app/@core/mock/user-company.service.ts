import { Injectable, Pipe } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserCompany, UserCompanyData } from '../data/user-company-data';
import { Router } from '@angular/router';
import { UrlApiService } from './url-api-service.service';
import { NbTokenService } from '../../auth/services/token/token.service';

@Injectable()
export class UserCompanyService extends UserCompanyData {

  baseUrl = this.urlApi.urlApi;
  private readonly apiController: string = 'usercompany';
  accessToken: string;
  fieldData: any = {};

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

  getBaseEndpoint() {
    return this.baseUrl + this.apiController;
  }
  
  getData() {
    return this.data;
  }

  getUserCompanies(companyId = null, userId = null): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(this.getApiUserCompanysData(companyId, userId));
    });
  }

  getUserCompany(userCompanyId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(this.getApiUserCompanyData(userCompanyId));
    });
  }

  deleteUserCompany(userCompanyId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(this.deleteUserCompanyData(userCompanyId));
    });
  }

  getApiUserCompanysData(companyId, userId) {
    
    let params = new HttpParams()
      .set('company', companyId)
      .set('user', userId);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + this.apiController, { headers, params: params });
  }

  

  getApiUserCompanyData(userCompanyId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    return this.http.get(this.baseUrl + this.apiController + '/' + userCompanyId, { headers });
  }


  newUserCompany(data: object): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.saveUserCompanyData(data));
    });
  }

  saveUserCompanyData(data: object) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    const body = data;
    return this.http.post(
      this.baseUrl + this.apiController, body , { headers },
    );
  }
  
  deleteUserCompanyData(userCompanyId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });
    
    return this.http.delete( `${ this.baseUrl  }${ this.apiController }/${ userCompanyId }`, { headers } );
  }

}
