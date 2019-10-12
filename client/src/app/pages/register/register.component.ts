import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, Validators, AbstractControl} from '@angular/forms';
import {UserService} from '../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {MatDialogRef, MatDialog} from '@angular/material';
import {LoginComponent} from '../login/login.component'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public errorMessage;
	public form;
	public submitted: boolean;
  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    public dialog: MatDialog,
  	private flashMessage: FlashMessagesService,
  	private userService: UserService,
  	private fb: FormBuilder

  	) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['',Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(25)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(70)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      confirm_password: ['', Validators.required]

    },{validator: this.MatchPassword});
  }

  showLogin(){
    this.closeRegister();
    this.dialog.open(LoginComponent);
  }

  closeRegister(){
  	this.dialogRef.close();
  }

  submitRegister(formData){
    console.log(this.form.controls);
  	this.submitted = true;
  	if(this.form.valid){
  		const user = {
	  		name: formData.name,
	  		email: formData.email,
        mobile: null,
	  		password: formData.password
  		}

  		this.userService.findUser(user.email).subscribe(res =>{
  			if(res.success){
  				this.userService.registerUser(user).subscribe(data => {
            if(data.success){

              //acknowledge user registeration
              this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 4000});
              this.form.reset();
              this.submitted = false;
              this.closeRegister();

              //loging the user
              this.userService.authenticate(user).subscribe(data =>{
                if(data.success){
                  this.userService.storeAuthData(data.token, data.user);
                  //send a welcome email
                  this.userService.sendWelcomeMail(data.user).subscribe(data => console.log(data));
                }
              });
              return data;
            }
            else{
              this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 4000});
              return data;
            }
	  			});
  			}
  			else{
          this.errorMessage = res.msg;
  				return res;
  			}
  		});
  	}

  }

  MatchPassword(formData: AbstractControl) {
       let password =  formData.get('password').value;// to get value in input tag
       let confirm_password =  formData.get('confirm_password').value;// to get value in input tag
        if(password != confirm_password) {
            //alert('Not matched');
            formData['passwordMisMatch'] = true;
            return {mismatch: true} 
        } else {
            //alert('Matched');
            formData['passwordMisMatch'] = false; 
            return null;
        }
    }
}
