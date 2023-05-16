import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class UrlApiService {
  public urlApi;
  constructor() {
    // if (window.location.hostname === 'localhost') {
    //   this.urlApi = 'http://127.0.0.1:8000/api/';
    // } else {
    //   this.urlApi = 'http://test-api.test.com.cl/api/';
    // }
    this.urlApi = environment.apiBaseUrl + '/api/';
  }
}
