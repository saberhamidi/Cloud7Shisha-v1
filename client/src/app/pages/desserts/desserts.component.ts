import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import  {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-desserts',
  templateUrl: './desserts.component.html',
  styleUrls: ['./desserts.component.css']
})
export class DessertsComponent implements OnInit {

  public cakes: Array<Object> =[
	  	{
	  		name: "Carrot Cake",
	  		category: "dessert",
	  		costs: 2.49,
	  		avatar: "carrotcake",
	  		quantity: 1
		},
		{
	  		name: "Strawberry Cheesecake",
	  		category: "dessert",
	  		costs: 2.49,
	  		avatar: "stcake",
	  		quantity: 1
		},
		{
	  		name: "Tennessee Toffee Pie",
	  		category: "dessert",
	  		costs: 2.49,
	  		avatar: "ttpie",
	  		quantity: 1
		},
		{
	  		name: "Chocolate Fudge Cake",
	  		category: "dessert",
	  		costs: 2.49,
	  		avatar: "chocake",
	  		quantity: 1
		}
	];

	public iceCreams: Array<Object> =[
		{
	  		name: "Caramel Chew Chew",
	  		category: "dessert",
	  		costs: 2.29,
	  		avatar: "ccchew",
	  		quantity: 1
		},
		{
	  		name: "Chocolate Fudge Brownie",
	  		category: "dessert",
	  		costs: 2.29,
	  		avatar: "cfb",
	  		quantity: 1
		},
		{
	  		name: "Cookie Dough",
	  		category: "dessert",
	  		costs: 2.29,
	  		avatar: "ckidough",
	  		quantity: 1
		},
		{
	  		name: "Strawberry Cheesecake",
	  		category: "dessert",
	  		costs: 2.29,
	  		avatar: "icestcake",
	  		quantity: 1
		},

	];
  constructor(private flashMessage: FlashMessagesService, private orderService: OrderService) { }

  ngOnInit() {
  }

  adjustQuantity(index, q){
  	var quantity = this.cakes[index]["quantity"];
  	if((quantity <20 || q === -1) && (quantity >1 || q === 1)){
	  	this.cakes[index]["quantity"] = quantity +q;
  	}
  }

  addToBasket(dessert: Object){
  	let item = Object.assign({}, dessert);
  	item["costs"] = item["costs"] * item["quantity"];
  	this.orderService.addToBasket(item);
  	this.flashMessage.show("Item successfully added to basket!", {cssClass: 'alert-success', timeout: 3000});
  }
  adjustIceQuantity(index, q){
  	var quantity = this.iceCreams[index]["quantity"];
  	if((quantity <20 || q === -1) && (quantity >1 || q === 1)){
	  	this.iceCreams[index]["quantity"] = quantity +q;
  	}
  }
}
