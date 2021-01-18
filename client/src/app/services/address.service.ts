import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import  {serverConfig} from "../../configs/serverConfig";

@Injectable()
export class AddressService {

  constructor(private http: Http) { }

  getAddresses(id: string, token: string){
  	//fetch addresses in relation to the current user
  	let headers = new Headers();
  	headers.append('Authorization', token);
    headers.append('Content-Type','application/json');
  	return this.http.get(serverConfig.apiUrl+'/address/'+id, {headers:headers}).map(res => res.json());
  }

  addAddress(address: Object, token: string){
  	let headers = new Headers();
  	headers.append('Authorization',token);
  	headers.append('Content-Type','application/json');
    return this.http.post(serverConfig.apiUrl+'/address', address, {headers:headers}).map(res => res.json());
  }

  removeAddress(address_id: string, token: string){
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type','application/json');
    return this.http.put(serverConfig.apiUrl+'/address/removeAddress/'+address_id, {headers:headers}).map(res => res.json());
  }
}
