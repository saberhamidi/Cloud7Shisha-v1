import { NgModule }      from '@angular/core';
import  {HttpModule} from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { routing }  from './app.routing';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { OrderComponent } from './pages/order/order.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatDialogModule} from '@angular/material';
import 'hammerjs';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule, FormsModule }   from '@angular/forms';
import { ValidateService} from './services/validate.service';
import { UserService} from './services/user.service';
import { OrderService} from './services/order.service';
import { AddressService} from './services/address.service';
import { PagerService } from './services/pager.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuards} from './guards/auth.guards';
import { SliderComponent } from './partials/slider/slider.component';
import { CarouselModule} from 'ngx-bootstrap/carousel';
import { ShishaOrderComponent } from './pages/shisha-order/shisha-order.component';
import { HeadpickerDirective } from './directives/headpicker.directive';
import { FlavourPickerDirective } from './directives/flavour-picker.directive';
import { BasketComponent } from './pages/basket/basket.component';
import { Ng2Webstorage} from 'ngx-webstorage';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { Tabs } from './pages/tabs/tabs';
import { Tab } from './pages/tabs/tab';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { OrderReceiptComponent } from './pages/order-receipt/order-receipt.component';
import { DrinksComponent } from './pages/drinks/drinks.component';
import { DessertsComponent } from './pages/desserts/desserts.component';
import { ExtrasComponent } from './pages/extras/extras.component';
import { AddressBookComponent } from './pages/address-book/address-book.component';
import { ExtraHeadComponent } from './pages/extra-head/extra-head.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { MenuComponent } from './pages/menu/menu.component';
@NgModule({
  imports:      [ 
    BrowserModule,
    routing,
    HttpModule,
    Angular2FontawesomeModule,
    ReactiveFormsModule,
    FormsModule,
    CarouselModule.forRoot(),
    FlashMessagesModule,
    Ng2Webstorage,
    BrowserAnimationsModule,
    MatDialogModule,
    LocalStorageModule.withConfig({
            prefix: 'cloud7shisha',
            storageType: 'localStorage'
        })
  ],
  declarations: [ 
  	AppComponent,
  	NavbarComponent,
  	HomeComponent,
  	OrderComponent,
  	PagenotfoundComponent,
  	RegisterComponent,
  	LoginComponent,
  	ProfileComponent,
  	SliderComponent,
  	ShishaOrderComponent,
  	HeadpickerDirective,
  	FlavourPickerDirective,
  	BasketComponent,
  	CheckoutComponent,
    Tabs,
    Tab,
    OrderHistoryComponent,
    OrderReceiptComponent,
    DrinksComponent,
    DessertsComponent,
    ExtrasComponent,
    AddressBookComponent,
    ExtraHeadComponent,
    HowItWorksComponent,
    MenuComponent
  ],
  providers:[ValidateService, UserService, AuthGuards, OrderService, LocalStorageService, AddressService, PagerService],
  bootstrap:    [ 
  	AppComponent
  ],
  entryComponents: [LoginComponent, RegisterComponent, OrderReceiptComponent]
})
export class AppModule { }
