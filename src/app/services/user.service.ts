import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) {}

  getUsers() {
    const header = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._http.get(environment.data_base, { headers: header });
  }
}
