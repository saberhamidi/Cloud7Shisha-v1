import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import  {OrderService} from '../../services/order.service';
import  {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-extra-head',
  templateUrl: './extra-head.component.html',
  styleUrls: ['./extra-head.component.css']
})
export class ExtraHeadComponent implements OnInit {
	
	form;
  flavours: Array<string> = ['Grape','Lemon','Peach','Coconut','Pomegranate','Strawberry','Sweet Melon','Mint','Orange', 'Vanila', 'Fresh Mist', 'Watermelon', 'Double Apple', 'Blueberry'];
  starbuzzFlavours: Array<string> = ['Irn bru', 'Skittles', 'Frozen Apple', 'Frozen Blueberry', 'Pink lemonade'];
	pickedFlavours: Array<string> = [];
	numberOfPremiumFlavoursPicked: number = 0;
	quantity: number = 1;
	submitted: boolean = false;
	costs: Object = {head: 5, options: 0, flavours: 0};
	prices: Object = {head: 5, options: 0, flavours: 0};
  constructor(
	  	private orderService: OrderService, 
	  	private router: Router,
  		private flashMessage: FlashMessagesService
  	) { }

  ngOnInit() {
  	this.form = new FormGroup({
  		category: new FormControl('extra-head'),
  		name: new FormControl('Clasic Khalil Mamoon'),
  		costs: new FormControl(this.costs),
  		head: new FormControl('', Validators.required),
  		flavours: new FormControl('', Validators.required),
  		quantity: new FormControl(1)
  	});
  }


  selectHead(head: string, price: number){
  	this.form.controls['head'].setValue(head);
  	this.prices['options'] = price;
  	this.costs['options'] = price*this.quantity;
  }

  addToBasket(item){
  	this.submitted = true;
  	if(item.flavours.length <=3 && this.form.valid){

  		item['costs'] = (<any>Object).values(this.costs).reduce(function(sum,value){return sum+value});
  		this.orderService.addToBasket(item);

  		//reload the page
  		this.router.navigateByUrl("safas",{skipLocationChange:true}).then(()=>{this.router.navigate(['extras']);});
  		window.scrollTo(0,0);
  		this.flashMessage.show("Item successfully added to basket!", {cssClass: 'alert-success', timeout: 3000});
  	}
  }

  pickFlavour(flavour: string, isChecked: boolean, premium:boolean = false){
  	if(isChecked) {
        this.pickedFlavours.push(flavour);
        if(premium){
        	this.numberOfPremiumFlavoursPicked ++;
        	this.prices['flavours'] = 1;
  			this.costs['flavours'] = 1*this.quantity;
        }
    } 
    else {
        const index = this.pickedFlavours.indexOf(flavour);
        this.pickedFlavours.splice(index,1);
        if(premium){
        	this.numberOfPremiumFlavoursPicked --;
        	if(this.numberOfPremiumFlavoursPicked <=0){
        		this.prices['flavours'] = 0;
        		this.costs['flavours'] = 0;
        	}
        }
    }
    this.form.controls['flavours'].setValue(this.pickedFlavours);
  }

  adjustByQuantity(q:number){
  	if((this.quantity <20 || q === -1) && (this.quantity >1 || q === 1)){
  		this.quantity = this.quantity +q;
  		this.form.controls['quantity'].setValue(this.quantity);
  		this.multiplyByQuantity(this.quantity);
  	}
  }

  multiplyByQuantity(q){
  	for(const cost in this.costs){
  		this.costs[cost]=this.prices[cost]*q;
  	}
  }

}
