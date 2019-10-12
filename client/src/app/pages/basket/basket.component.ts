import { Component, OnInit } from '@angular/core';
import  {OrderService} from '../../services/order.service';
import  {CheckoutComponent} from "../checkout/checkout.component";
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
	public basket: Object = {
     items: [],
     subtotal: 0,
     discount: 0,
    }
  public dialogTest: string;

  public promotion = {
    promotionInput: undefined,
    promotionCode: 54821,
    error: false,
    errMsg: ""
  };

  constructor(private orderService: OrderService, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  	this.orderService.fetchBasket(this.orderService.loadBasketId()).subscribe(data =>{
      if(data.success){
        this.basket = data.basket;
      }
    });
  }

  removeItem(thisItem, index){
  	this.basket["items"].splice(index,1)
    this.updateTotal(-thisItem.costs);
  	this.orderService.updateBasket(this.basket);
  }

 updateTotal(updateFigure){
  	this.basket["subtotal"] = this.basket["subtotal"] + updateFigure;
  }

  adjustCost(itemIndex,q){
  	var quantity = this.basket["items"][itemIndex].quantity;
  	var cost = this.basket["items"][itemIndex].costs;
  	if((quantity <20 || q === -1) && (quantity >1 || q === 1)){
	  	this.basket["items"][itemIndex].costs = cost+((cost/quantity)*q);
	  	this.basket["items"][itemIndex].quantity =quantity +q;
	  	this.updateTotal((cost/quantity)*q);
	  	this.orderService.updateBasket(this.basket);
  	}
  }

  applyPromotion(){
    if(this.promotion.promotionInput == this.promotion.promotionCode){
       if(this.basket["discounted"]){
         this.promotion.error = true;
         this.promotion.errMsg = "Discount already applied";
       }
       else{
           this.promotion.error = false;
          this.basket["discounted"] = true;
          this.basket["discount"] = this.basket["subtotal"]* -0.2;
          this.orderService.applyDiscount(this.basket).subscribe(data =>{
            if(data.success){
              this.flashMessage.show("Discount applied!", {cssClass: 'alert-success', timeout: 3000});
              this.orderService.fetchBasket(this.basket["_id"]).subscribe(result =>{
                 this.basket = result.basket;
              });
            }
          });
       }
    }
    else{
      this.promotion.errMsg = "Invlaid promotion code";
      this.promotion.error = true;
    }
  }
}
