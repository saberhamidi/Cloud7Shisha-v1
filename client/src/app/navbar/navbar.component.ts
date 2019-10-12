import { Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {OrderService} from '../services/order.service';
import { RegisterComponent } from '../pages/register/register.component';
import { LoginComponent } from '../pages/login/login.component';
import { FlashMessagesService } from 'angular2-flash-messages';
import  {Router} from '@angular/router';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public basketTotal: Object;
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    public dialog: MatDialog
   ) { }

  ngOnInit() {
    this.basketTotal = this.orderService.basketTotal();
    this.orderService.basketSubject.subscribe(data => this.basketTotal = data);
    this.orderService.fetchBasket(this.orderService.loadBasketId()).subscribe(data =>{
      if(data.success){
        this.orderService.basket = data.basket;
        this.basketTotal = this.orderService.basketTotal();
      }
    });
  }

  showLogin(){
    this.dialog.open(LoginComponent);
  }

  showRegister(){
    this.dialog.open(RegisterComponent);
  }

  signOut(){
    this.userService.signOut();
    this.flashMessage.show("You are logged out!", {cssClass: 'alert-success', timeout: 2000});
    this.router.navigate(['/home']);

  }
}
