import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZipCodeService {

  constructor(public http: HttpClient) { }

  getCep(cep) {
    return this.http.get(`https://viacep.com.br/ws/${Number(cep)}/json/`).toPromise();
  }
}
