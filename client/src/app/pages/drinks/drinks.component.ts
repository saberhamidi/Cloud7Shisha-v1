import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import  {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.css']
})
export class DrinksComponent implements OnInit {

  public drinks: Array<Object> =[
  		{
	  		name: "J2O Apple & Raspberry",
	  		category: "drink",
	  		costs: 1.49,
	  		avatar: "j2oap",
	  		quantity: 1
		},
		{
	  		name: "J2O Orange & Passion Fruit",
	  		category: "drink",
	  		costs: 1.49,
	  		avatar: "j2oop",
	  		quantity: 1
		},
		{
	  		name: "J2O Apple & Mango",
	  		category: "drink",
	  		costs: 1.49,
	  		avatar: "j2oam",
	  		quantity: 1
		},
		{
	  		name: "RedBull",
	  		category: "drink",
	  		costs: 1.49,
	  		avatar: "redbull",
	  		quantity: 1
		},
	  	{
	  		name: "Coke",
	  		category: "drink",
	  		costs: 0.79,
	  		avatar: "coke",
	  		quantity: 1
		},
		{
	  		name: "Diet Coke",
	  		category: "drink",
	  		costs: 0.79,
	  		avatar: "diet-coke",
	  		quantity: 1
		},
		{
	  		name: "Fanta",
	  		category: "drink",
	  		costs: 0.79,
	  		avatar: "fanta",
	  		quantity: 1
		},
		{
	  		name: "7UP",
	  		category: "drink",
	  		costs: 0.79,
	  		avatar: "7up",
	  		quantity: 1
		},
		{
	  		name: "Tropicana Orange Juice",
	  		category: "drink",
	  		costs: 1.29,
	  		avatar: "toj",
	  		quantity: 1
		},
		{
	  		name: "Water",
	  		category: "drink",
	  		costs: 0.79,
	  		avatar: "water",
	  		quantity: 1
		}
		
	];
  constructor(private flashMessage: FlashMessagesService, private orderService: OrderService) { }

  ngOnInit() {
  }

  adjustQuantity(index, q){
  	var quantity = this.drinks[index]["quantity"];
  	if((quantity <20 || q === -1) && (quantity >1 || q === 1)){
	  	this.drinks[index]["quantity"] = quantity +q;
  	}
  }

  addToBasket(drink: Object){
  	let item = Object.assign({}, drink);
  	item["costs"] = item["costs"] * item["quantity"];
  	this.orderService.addToBasket(item);
  	this.flashMessage.show("Item successfully added to basket!", {cssClass: 'alert-success', timeout: 3000});
  }

}
