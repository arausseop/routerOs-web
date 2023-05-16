import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = localStorage.getItem('token');

    let request = req;

    // if (req.url === 'http://127.0.0.1:8000/oauth/v2/token') {
    if (req.url === 'http://127.0.0.1:8000/token') {

      request = req.clone({
        setHeaders: {
          // 'Access-Control-Allow-Origin': '*',
          // 'Content-Type': 'application/json',
          // 'Access-Control-Allow-Headers': 'client_id, client_secret',
          'client_id': 'testclient',
          'client_secret': 'testpass',
          // authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request);
  }

}