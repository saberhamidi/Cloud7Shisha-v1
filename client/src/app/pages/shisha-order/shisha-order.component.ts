import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import  {OrderService} from '../../services/order.service';
import  {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-shisha-order',
  templateUrl: './shisha-order.component.html',
  styleUrls: ['./shisha-order.component.css']
})
export class ShishaOrderComponent implements OnInit {
	form;
	flavours: Array<string> = ['Grape','Lemon','Peach','Coconut','Pomegranate','Strawberry','Sweet Melon','Mint','Orange', 'Vanila', 'Fresh Mist', 'Watermelon', 'Double Apple', 'Blueberry'];
  starbuzzFlavours: Array<string> = ['Irn bru', 'Skittles', 'Frozen Apple', 'Frozen Blueberry', 'Pink lemonade'];
	pickedFlavours: Array<string> = [];
	numberOfPremiumFlavoursPicked: number = 0;
	quantity: number = 1;
	submitted: boolean = false;
	costs: Object = {shisha: 7.49, head:0, hose:0, base:0};
	prices: Object = {shisha: 7.49, head: 0, hose:0, base:0};
  constructor(
	  	private orderService: OrderService, 
	  	private router: Router,
  		private flashMessage: FlashMessagesService
  	) { }

  ngOnInit() {
  	this.form = new FormGroup({
  		category: new FormControl('shisha'),
  		name: new FormControl('Clasic Khalil Mamoon'),
  		costs: new FormControl(this.costs),
  		head: new FormControl('', Validators.required),
  		hose: new FormControl('', Validators.required),
  		base: new FormControl('', Validators.required),
  		flavours: new FormControl('', Validators.required),
  		quantity: new FormControl(1)
  	});
  }


  selectHead(head: string, price: number){
  	this.form.controls['head'].setValue(head);
  	this.prices['head'] = price;
  	this.costs['head'] = price*this.quantity;

  }

  selectHose(hose: string, price: number){
  	this.form.controls['hose'].setValue(hose);
    this.prices['hose'] = price;
    this.costs['hose'] = price*this.quantity;

  }

  selectBase(base: string, price: number){
  	this.form.controls['base'].setValue(base);
    this.prices['base'] = price;
    this.costs['base'] = price*this.quantity;

  }

  addToBasket(item){
  	this.submitted = true;
  	if(item.flavours.length <=3 && this.form.valid){
  		item['costs'] = (<any>Object).values(this.costs).reduce(function(sum,value){return sum+value});
  		this.orderService.addToBasket(item);

  		//reload the page
  		this.router.navigateByUrl("safas",{skipLocationChange:true}).then(()=>{this.router.navigate(['shisha']);});
  		window.scrollTo(0,0);
  		this.flashMessage.show("Item successfully added to basket!", {cssClass: 'alert-success', timeout: 3000});

  	}
  }

  pickFlavour(flavour: string, isChecked: boolean, premium:boolean = false){
  	if(isChecked) {
        this.pickedFlavours.push(flavour);
        if(premium){
        	this.numberOfPremiumFlavoursPicked ++;
        	this.prices['shisha'] = 9.99;
        	this.costs['shisha'] = this.prices['shisha']*this.quantity;
        }
    } 
    else {
        const index = this.pickedFlavours.indexOf(flavour);
        this.pickedFlavours.splice(index,1);
        if(premium){
        	this.numberOfPremiumFlavoursPicked --;
        	if(this.numberOfPremiumFlavoursPicked <=0){
        		this.prices['shisha'] = 7.49;
        		this.costs['shisha'] = this.prices['shisha']*this.quantity;
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
