import {Injectable} from '@angular/core';
import  {Router, CanActivate} from '@angular/router';
import  {UserService} from '../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {LoginComponent} from '../pages/login/login.component';
import {MatDialog} from '@angular/material';

@Injectable()
export class AuthGuards implements CanActivate{

	constructor(
		private router: Router, 
		private userService: UserService,
		private flashMessage: FlashMessagesService,
		public dialog: MatDialog

	){}

	canActivate() {
	    if(this.userService.loggedIn()){
	        return true;
    	}
    	else{
    		this.router.navigate(["home"]);
    		this.dialog.open(LoginComponent);
    		return false;
    	}
    }
}