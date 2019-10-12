import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import  {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {
  public extras: Array<Object> =[
        {
          name: "Self Burning Coals",
          category: "extras",
          costs: 1.99,
          avatar: "SBcoal",
          quantity: 1
      },
      {
          name: "Coconut Shell Coals",
          category: "extras",
          costs: 1.99,
          avatar: "CScoal",
          quantity: 1
      }
    ];
  constructor(private flashMessage: FlashMessagesService, private orderService: OrderService) { }

  ngOnInit() {
  }

  adjustQuantity(index, q){
    var quantity = this.extras[index]["quantity"];
    if((quantity <20 || q === -1) && (quantity >1 || q === 1)){
      this.extras[index]["quantity"] = quantity +q;
    }
  }

  addToBasket(drink: Object){
    let item = Object.assign({}, drink);
    item["costs"] = item["costs"] * item["quantity"];
    this.orderService.addToBasket(item);
    this.flashMessage.show("Item successfully added to basket!", {cssClass: 'alert-success', timeout: 3000});
  }

}
