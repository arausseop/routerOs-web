import { ServerDataSource } from "ng2-smart-table";
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ServerSourceConf } from 'ng2-smart-table/lib/lib/data-source/server/server-source.conf';
import { Observable } from "rxjs";
import * as _ from 'lodash';

export class HeadersServerDataSource extends ServerDataSource {
    httpHeaders: HttpHeaders
    customParams
    
    constructor(protected http: HttpClient, headers: HttpHeaders, conf: ServerSourceConf | {} = {}, customParams: object = null) {
      super(http, conf);
      this.httpHeaders = headers;
      this.customParams = customParams;
    }
  
    protected requestElements(): Observable<any> {
      let httpParams = this.createRequesParams();
    
      _.each(this.customParams, (param, keyParam) => {
          httpParams = httpParams.set(keyParam,param); 
      })
      
    //   httpParams = httpParams.set('field',1);
      return this.http.get(this.conf.endPoint, { params: httpParams, headers: this.httpHeaders, observe: 'response' });
    }
}