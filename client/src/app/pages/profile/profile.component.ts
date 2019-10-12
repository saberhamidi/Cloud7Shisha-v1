import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {Tab} from '../tabs/tab';
import {FormBuilder, FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public form;
  public changePasswordForm;
	public user: Object;
  public submitted: boolean = false;
  public changePassword: boolean = false;
  public errorMessage: string;
  @ViewChildren(Tab) tabs: QueryList<Tab>;

  constructor(
    private userService: UserService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private flashMessage: FlashMessagesService

    ) { }

  ngOnInit() {
  	this.userService.fetchCurrentUser().subscribe(profile => {
  		this.user = profile.user;
      this.form = new FormGroup({
        name: new FormControl(this.user["name"], Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(25)])),
        mobile: new FormControl(this.user["mobile"],Validators.compose([Validators.required, Validators.pattern("^[0-9+]*$"), Validators.minLength(11), Validators.maxLength(16)]))
      });
  	},
  	err=>{
  		console.log(err);
  		return false;
  	});

    this.changePasswordForm = this.formBuilder.group({
        oldPassword: new FormControl("", Validators.required),
        password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])),
        confirm_password: new FormControl("", Validators.required)
    },{validator: this.MatchPassword});
  }

  tabTogle(activeIndex: number){
    this.tabs.toArray().forEach(function(tab,index){
      tab.active = false;
      tab.done = index<activeIndex;
    });
    this.tabs.toArray()[activeIndex].active = true;
  }

  save(formData){
    this.submitted = true;
      if(this.form.valid){
        for(var prop in formData){
           if(this.user[prop] !== formData[prop]){
             var newData = {};
             newData[prop] = formData[prop];
             this.userService.updateUserProfile(newData, this.user["_id"]).subscribe();
           }
        }
        this.flashMessage.show("Profile updated", {cssClass: 'alert-success', timeout: 4000});
        this.ngOnInit();
        this.tabTogle(0);
        this.submitted = false;
      }
  }

  toggleChangePassword(){
    this.changePassword = !this.changePassword;
  }

  changePass(formData){
    this.submitted = true;
    if(this.changePasswordForm.valid){
      this.userService.authenticate({email: this.user["email"], password: formData.oldPassword}).subscribe(result =>{
        if(result.success){
          this.userService.updateUserProfile({password: formData.password}, this.user["_id"]).subscribe(respond =>{
            if(respond.success){
              this.flashMessage.show("Password successfully changed", {cssClass: 'alert-success', timeout: 3000});
              this.submitted = false;
              this.errorMessage = "";
              this.toggleChangePassword();
              this.ngOnInit();
            }
            else{
              this.flashMessage.show("Password change error", {cssClass: 'alert-danger', timeout: 3000});
            }
          });
        }
        else{
          this.errorMessage = result.msg;
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
