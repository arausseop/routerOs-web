import { Injectable, Pipe } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { UrlApiService } from './url-api-service.service';
import { NbTokenService } from '../../auth/services/token/token.service';
import { ReportData, Report } from '../data/report-data';
import * as moment from 'moment';

@Injectable()
export class ReportService extends ReportData {

  baseUrl = this.urlApi.urlApi;
  private readonly apiController: string = 'reports';
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

  getReport(data): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.generateReport(data));
    });
  }

  generateReport(data) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken
    });

    console.log('servicio', data);
    // let rangeDays = moment.utc(this.filterType.get('dateRange').value.end).diff(moment.utc(this.filterType.get('dateRange').value.start), 'days');
    let startDate = moment(data.dateRange.start).format('YYYY-MM-DD');
    let endDate = moment(data.dateRange.end).format('YYYY-MM-DD');
    let params = new HttpParams()
      .set('field', data.field)
      .set('device', data.device)
      .set('from',startDate)
      .set('to',endDate)
      .set('groundGraphConductivity',data.groundGraphConductivity)
      .set('groundGraphTemperature',data.groundGraphTemperature)
      .set('groundGraphPontencialRedox',data.groundGraphPontencialRedox)
      .set('groundGraphPh',data.groundGraphPh)
      .set('groundGraphHumidity',data.groundGraphHumidity)
      .set('groundCarbonDioxide',data.groundCarbonDioxide)
      .set('groundOrganicComp',data.groundOrganicComp)
      .set('ambientTemperature',data.ambientTemperature)
      .set('ambientLight',data.ambientLight)
      .set('fieldImage',data.fieldImage)
      .set('fieldDetail',data.fieldDetail);

    const body = data;
    return this.http.get(this.baseUrl + this.apiController, { responseType: 'blob', headers, params: params });
    // return this.http.post(
    //   this.baseUrl + this.apiController, null , { responseType: 'blob', headers, params: params},
    // );
  }
}
