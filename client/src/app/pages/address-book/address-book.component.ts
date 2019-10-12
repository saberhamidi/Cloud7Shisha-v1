import { Component, OnInit } from '@angular/core';
import  {UserService} from '../../services/user.service';
import  {AddressService} from '../../services/address.service';
import {FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {

	public addresses: any = [];
	public selectedAddressIndex: any = "Select an Address";
	public noAddress: boolean = true;
  constructor(
  	    private userService: UserService,
    	private addressService: AddressService,
    	private flashMessage: FlashMessagesService
  	) { }

  ngOnInit() {
  	this.addressService.getAddresses(this.userService.getCurrentUser().id, this.userService.loadToken()).subscribe(data =>{
      if(data.success){
      	this.noAddress = false;
        this.addresses = data.addresses;
      }
    });
  }

  deleteAddress(){
  	this.addressService.removeAddress(this.addresses[this.selectedAddressIndex]._id, this.userService.loadToken()).subscribe(data =>{
  		if(data.success){
  			this.flashMessage.show("Address deleted", {cssClass: 'alert-success', timeout: 3000});
  			this.addresses.splice(this.selectedAddressIndex, 1);
  		}
  		else{
  			this.flashMessage.show("Address failed to delete", {cssClass: 'alert-danger', timeout: 3000});
  		}
  	})
  }

}
