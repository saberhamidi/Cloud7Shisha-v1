import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import  'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class UserService {

	token:any;
	user:any;

  constructor(private http:Http) { }

  registerUser(user){
  	let headers = new Headers();
  	headers.append('Content-Type','application/json');
  	return this.http.post('http://localhost:3000/users/register', user, {headers:headers}).map(res =>res.json());
  }

  findUser(email){
  	return this.http.get('http://localhost:3000/users/find/'+email).map(res => res.json());
  }

  fetchCurrentUser(){
    let headers = new Headers();
    this.loadToken();
    this.getCurrentUser();
    headers.append('Authorization', this.token);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/users/'+this.user.id,{headers:headers}).map(res => res.json());
  }

  updateUserProfile(newData, user_id){
    this.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Authorization', this.token);
    return this.http.put('http://localhost:3000/users/updateProfile/'+user_id, newData, {headers:headers}).map(res =>res.json());
  }

  authenticate(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers:headers}).map(res =>res.json());
  }

  storeAuthData(token, user){
     localStorage.setItem("id_token", token);
     localStorage.setItem("user", JSON.stringify(user));
     this.token = token;
     this.user = user;
  }

  signOut(){
    this.token = null;
    this.user = null;
    localStorage.removeItem("user");
    localStorage.removeItem("id_token");
  }

  loadToken(){
    this.token = localStorage.getItem("id_token");
    return this.token;
  }

  getCurrentUser(){
    this.user = JSON.parse(localStorage.getItem('user'));
    return this.user;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  sendOrderConfirmationMail(order){
    this.loadToken();
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/orderConfirmationEmail', order, {headers:headers}).map(res =>res.json());
  }

  sendWelcomeMail(user){
    this.loadToken();
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/welcomeEmail', user, {headers:headers}).map(res =>res.json());
  }
}
