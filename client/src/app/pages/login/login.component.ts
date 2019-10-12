import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {MatDialogRef, MatDialog} from '@angular/material';
import {RegisterComponent} from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public submitted: boolean = false;
  public errorMessage;
  public form;
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl("", Validators.compose([Validators.email, Validators.required])),
      password: new FormControl("", Validators.required)
    });
  }

  showRegister(){
    this.closeLogin();
    this.dialog.open(RegisterComponent);
  }

  closeLogin(){
    this.dialogRef.close();
  }

  doLogin(formData){
    this.submitted = true;
    if(this.form.valid){
      const user = {"email": formData.email, "password": formData.password};
      this.userService.authenticate(user).subscribe(data =>{
        if(data.success){
          this.userService.storeAuthData(data.token, data.user);
          this.form.reset();
          this.ngOnInit();
          this.closeLogin();
          return data;
        }
        else{
           this.errorMessage = data.msg;
           return data;
        }
      });
    }
  }

}
