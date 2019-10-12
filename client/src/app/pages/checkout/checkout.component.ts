import { Component, OnInit, ViewChildren, QueryList, NgModule} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import  {OrderService} from '../../services/order.service';
import  {Router} from '@angular/router';
import {Tab} from '../tabs/tab';
import  {UserService} from '../../services/user.service';
import  {AddressService} from '../../services/address.service';
import {FlashMessagesService } from 'angular2-flash-messages';
import * as moment from 'moment';
moment.locale("en-gb");


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
	public form;
  public basket: Object = {
    items: [],
    subtotal: 0,
    discount: 0
  };
  public submitted: boolean;
  public addressBook;
  public user;
  public newAddress: boolean;
  public addresses: any = [];
  public chosenAddress: any = null;
  public paymentType: string = "cash";
  public deliveryTime = ["As soon as possible"];
  public ordered: boolean = false;

  public terms: Object = {
    termsAgree: false,
    ageAgree: false
  }
  @ViewChildren(Tab) tabs: QueryList<Tab>;
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private addressService: AddressService,
    private router: Router,
    private flashMessage: FlashMessagesService
    ) { }
  
  ngOnInit(){
    this.generateTimeSlots();
    this.orderService.fetchBasket(this.orderService.loadBasketId()).subscribe(data =>{
        if(data.success){
          this.basket = data.basket;
          if(this.basket["items"].length==0 || (this.basket["subtotal"]+this.basket["discount"])<7.49){
            this.router.navigate(['basket']);
          }
        }
    });

    this.userService.fetchCurrentUser().subscribe(data =>{
      if(data.success){
        this.user = data.user;
        this.form = new FormGroup({
          name: new FormControl(this.user.name, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(25)])),
          mobile: new FormControl(this.user.mobile, Validators.compose([Validators.required, Validators.pattern("^[0-9+]*$"), Validators.minLength(11), Validators.maxLength(16)])),
          streetNumber: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9 ]*$"), Validators.maxLength(50)])),
          streetName: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9 ]*$"), Validators.maxLength(50)])),
          city: new FormControl("", Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)])),
          postcode: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9 ]*$"), Validators.maxLength(10)])),
          deliveryTime: new FormControl("As soon as possible", Validators.required),
          comment: new FormControl("", Validators.maxLength(250))
        });
      }
      else{
        this.userService.signOut();
        this.flashMessage.show("User authentication failed please login again", {cssClass: 'alert-danger', timeout: 3000});
        this.user = null;
        this.router.navigate(["/"]);
      }
    });

    this.addressService.getAddresses(this.userService.getCurrentUser().id, this.userService.loadToken()).subscribe(data =>{
      if(data.success){
        this.addresses = data.addresses;
        this.chosenAddress = this.addresses[0];
      }
      else{
        this.newAddress = true;
      }
    });
  }

  tabTogle(activeIndex: number){
    this.tabs.toArray().forEach(function(tab,index){
      tab.active = false;
      tab.done = index<activeIndex;
    });
    this.tabs.toArray()[activeIndex].active = true;
  }

  next(formData, index: number){
    this.submitted = true;
      if(this.form.controls.name.valid && this.form.controls.mobile.valid){
          this.tabTogle(index);
          this.submitted = false;
      }
  }

  proceedToPayment(formData, index: number){
  	if(this.chosenAddress == null){
      this.submitted = true;
      if(this.form.valid){
          this.tabTogle(index);
          this.submitted = false;
      }
    }
    else{
      this.submitted = true;
      if(this.form.controls.deliveryTime.valid && this.form.controls.comment.valid){
        this.tabTogle(index);
        this.submitted = false;
      }
    }
  }

  addressToggle(){
    if(this.chosenAddress  !==null){
      this.chosenAddress = null;
    }
    else{
      this.chosenAddress = this.addresses[0];
    }
    this.newAddress = !this.newAddress;
  }

  selectAddress(index: number){
    this.chosenAddress = this.addresses[index];
  }

  placeOrder(index:number){
    this.submitted = true;
    if(this.terms["termsAgree"] && this.terms["ageAgree"]){
      const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
      const order = {
            "orderNumber": letters[this.getId(0,25)]+letters[this.getId(0,25)]+this.getId(1,10000000),
            "date": moment(),
            "deliveryTime": this.form.controls.deliveryTime.value,
            "customer": {
                "name": this.form.controls.name.value,
                "email": this.user.email,
                "mobile": this.form.controls.mobile.value,
                "id": this.user._id
              },
            "basket": this.basket["items"],
            "bill": {
              "discount": this.basket["discount"],
              "total": this.basket["subtotal"],
              "paymentType": this.paymentType
            },
            "comment": this.form.controls.comment.value
        };

      if(this.chosenAddress !==null && (this.form.controls.name.valid && this.form.controls.mobile.valid)){
          order["deliveryAddress"] = {
            "streetNumber": this.chosenAddress.streetNumber,
            "streetName": this.chosenAddress.streetName,
            "city": this.chosenAddress.city,
            "postcode": this.chosenAddress.postcode
          };
          this.tabTogle(index);

          //Submit order to the database
          this.submitOrder(order);
      }
      else if(this.form.valid){
        order["deliveryAddress"] = {
            "streetNumber": this.form.controls.streetNumber.value,
            "streetName": this.form.controls.streetName.value,
            "city": this.form.controls.city.value,
            "postcode": this.form.controls.postcode.value
        };
        const newAddress = {
            "userId": this.user._id,
            "streetNumber": order["deliveryAddress"].streetNumber,
            "streetName": order["deliveryAddress"].streetName,
            "city": order["deliveryAddress"].city,
            "postcode": order["deliveryAddress"].postcode
        };
        //save the new address to the database
        this.addressService.addAddress(newAddress, this.userService.loadToken()).subscribe(data=>{
            return data;
        });
        this.tabTogle(index);

        //Submit order to the database
        this.submitOrder(order);
      }
      else{
        this.flashMessage.show("Checkout failed (data entry invalid)", {cssClass: 'alert-danger', timeout: 4000});
      }
    }
  }

  getId(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  submitOrder(order){
    //update user mobile contact details
    if(!this.user.mobile || this.user.mobile !== this.form.controls.mobile.value){
      let newData = {mobile: this.form.controls.mobile.value};
      this.userService.updateUserProfile(newData, this.user._id).subscribe(user =>{
        console.log(user);
      });
    }

    if(this.user && this.basket["items"].length !==0){

      //save the order in the database and clear the basket
      this.orderService.saveOrder(order, this.userService.loadToken()).subscribe(data =>{
        if(data.success){
          this.basket = {items: [], subtotal: 0, discount: 0};
          this.orderService.updateBasket(this.basket);

          //triger acknoledging the receipt of order
          this.ordered = true;
          this.userService.sendOrderConfirmationMail(order).subscribe(respond =>{});
        }
      });
    }

    else{
      this.flashMessage.show("Basket error, please try loggining again", {cssClass: 'alert-danger', timeout: 4000});
    }
  }

  proceedToConfirm(index: number){
    this.tabTogle(index);
  }

  generateTimeSlots(){
    let adjustingFigures = [0,10,20,30,40,50,60];
    let currentTime = moment();
    let minutes = currentTime.get("minute");
    for(var i=0; i<adjustingFigures.length; i++){
      if(minutes <= adjustingFigures[i]){
        if(minutes === adjustingFigures[i]){
          currentTime.add(45, "m");
          break;
        }
        else {
          currentTime.add((adjustingFigures[i]-minutes)+45, "m");
          break;
        }
      }
    }

    for(var i =0; i<288; i++){
      this.deliveryTime.push(currentTime.format('dddd')+" "+currentTime.format('LT'));
      currentTime.add(10, "m");

    }
  }
}
