import { Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Subject} from "rxjs/Subject";
import {LocalStorageService } from "angular-2-local-storage";
import {Router} from '@angular/router';
import * as deepEqaul from 'deep-equal';

@Injectable()
export class OrderService {
	public basket: Object = {
      items: [],
      subtotal: 0,
      discount: 0
    };

  public basket_id = this.storage.get("basket_id");
	public basketSubject = new Subject<any>();

  constructor(
    private storage: LocalStorageService,
    private http: Http,
    private router: Router
    ) { }

  addToBasket(item){
  	if(this.basket_id == undefined || this.basket_id == null){
      this.createBasket(item);
  	}
    else{
      this.fetchBasket(this.basket_id).subscribe(data =>{
        if(data.success){
            this.basket= data.basket;
            const index = this.basket["items"].findIndex(existingItem => this.compareItems(existingItem, item));
            if(index === -1){
              //update basket in the database
              this.basket["items"].push(item);
              this.basket["subtotal"] = this.basket["subtotal"] + item.costs;
              this.updateBasket(this.basket);
            }
            else{
              this.basket["items"][index].quantity = this.basket["items"][index].quantity + item.quantity;
              this.basket["items"][index].costs = this.basket["items"][index].costs + item.costs;
              this.basket["subtotal"] = this.basket["subtotal"] + item.costs;
              this.updateBasket(this.basket);
            }
        }
        else{
          this.createBasket(item);
        }

      });
    }
  }

  compareItems(existingItem, newItem){
    	var comparableExistingItem = Object.assign({},existingItem);
    	var comparableNewItem = Object.assign({},newItem);
  	delete comparableExistingItem.costs;
  	delete comparableExistingItem.quantity;
  	delete comparableNewItem.costs;
  	delete comparableNewItem.quantity;
  	if(deepEqaul(comparableExistingItem, comparableNewItem)){
  		return true;
  	}
  	else{
  		return false;
  	}
  }

  updateBasket(basket: Object, navigateToBasket?: boolean){

    //apply discount
    if(basket["discounted"]){
      basket["discount"] = basket["subtotal"]* -0.2;
    }

  	let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/basket/updateBasket/'+this.basket_id, basket, {headers:headers}).map(res =>res.json()).subscribe(data =>{
      this.fetchBasket(this.loadBasketId()).subscribe(data =>{
          if(data.success){
            this.basket = data.basket;
            //update prices in basket logo shown in the navbar
            this.basketSubject.next(this.basketTotal());

            // In case of order again navigate to the basket
            if(navigateToBasket){
              this.router.navigate(['/basket']);
            }
          }
      });
    });
  }

  basketTotal(){
  	if(this.basket["items"]){
	  	let total = 0;
      let numItems= 0 ;
	  	this.basket["items"].forEach(function(item){total = total+item.costs; numItems = numItems+item.quantity;});
	  	return {totalCost: total, numberOfItems: numItems};
  	}
  	else{
  		return {totalCost: 0, numberOfItems: 0};
  	}
  }

  createBasket(items: any, navigateToBasket?: boolean, repeatOrder?: boolean){

    if(!repeatOrder){
      this.basket["items"].push(items);
      this.basket["subtotal"] = items["costs"];
    }

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/basket/addItem', {headers:headers}).map(res =>res.json()).subscribe(data=>{
        if(data.success){
            this.storage.set('basket_id', data.basket._id);
            this.basket_id = data.basket._id;
            this.updateBasket(this.basket, navigateToBasket);
          }
      });
  }

  fetchBasket(basket_id){
    return this.http.get('http://localhost:3000/basket/fetchBasket/'+basket_id).map(res => res.json());
  }

  loadBasketId(){
    this.basket_id = this.storage.get('basket_id');
    return this.basket_id;
  }

  saveOrder(order: Object, token: string){
    let headers = new Headers();
    headers.append('Authorization',token);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/order', order, {headers:headers}).map(res => res.json());
  }

  loadOrdersByUserId(userId: string, token){
    let headers = new Headers();
    headers.append('Authorization',token);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/order/user/'+userId, {headers:headers}).map(res => res.json());
  }

  orderAgain(items: [any]){
    if(this.basket_id == undefined || this.basket_id == null){
        this.putToBasket(items);
        this.createBasket(this.basket, true, true);
    }
    else{
      this.fetchBasket(this.basket_id).subscribe(result =>{
        if(result.success){
          this.putToBasket(items);
          this.updateBasket(this.basket, true);
        }
        else{
          this.putToBasket(items);
          this.createBasket(this.basket, true, true);
        }
      });
    }
  }

  putToBasket(items){
    this.basket["items"] = items;
    this.basket["subtotal"] = 0;
    items.forEach(elm =>{
      this.basket["subtotal"] = this.basket["subtotal"] + elm.costs;
    });
  }

  applyDiscount(basket){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/basket/updateDiscount/', basket, {headers:headers}).map(res =>res.json());
  }
}
