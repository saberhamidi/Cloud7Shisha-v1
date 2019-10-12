import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class AddressService {

  constructor(private http: Http) { }

  getAddresses(id: string, token: string){
  	//fetch addresses in relation to the current user
  	let headers = new Headers();
  	headers.append('Authorization', token);
    headers.append('Content-Type','application/json');
  	return this.http.get('http://localhost:3000/address/'+id, {headers:headers}).map(res => res.json());
  }

  addAddress(address: Object, token: string){
  	let headers = new Headers();
  	headers.append('Authorization',token);
  	headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/address', address, {headers:headers}).map(res => res.json());
  }

  removeAddress(address_id: string, token: string){
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/address/removeAddress/'+address_id, {headers:headers}).map(res => res.json());
  }
}
