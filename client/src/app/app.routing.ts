import  {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {OrderComponent} from './pages/order/order.component';
import {HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import {MenuComponent } from './pages/menu/menu.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {AddressBookComponent} from './pages/address-book/address-book.component';
import {PagenotfoundComponent} from './pages/pagenotfound/pagenotfound.component';
import {AuthGuards} from './guards/auth.guards';
import {LoginComponent} from './pages/login/login.component';
import {ShishaOrderComponent} from './pages/shisha-order/shisha-order.component';
import {BasketComponent} from './pages/basket/basket.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {DrinksComponent} from './pages/drinks/drinks.component';
import {DessertsComponent} from './pages/desserts/desserts.component';
import {ExtrasComponent} from './pages/extras/extras.component';
import {ExtraHeadComponent} from './pages/extra-head/extra-head.component';
import {OrderHistoryComponent} from './pages/order-history/order-history.component';




const appRoutes: Routes = [
	
	{path: 'home', component:  HomeComponent},
	{path: 'order', component: OrderComponent},
	{path: 'how-it-works', component: HowItWorksComponent},
	{path: 'menu', component: MenuComponent},
	{path: 'shisha', component:  ShishaOrderComponent},
	{path: 'drinks', component:  DrinksComponent},
	{path: 'desserts', component:  DessertsComponent},
	{path: 'extras', component:  ExtrasComponent},
	{path: 'extra-head', component:  ExtraHeadComponent},
	{path: 'login', component: LoginComponent},
	{path: 'basket', component: BasketComponent},
	{path: 'profile', component: ProfileComponent, canActivate:[AuthGuards]},
	{path: 'checkout', component:  CheckoutComponent, canActivate:[AuthGuards]},
	{path: 'order-history', component:  OrderHistoryComponent, canActivate:[AuthGuards]},
	{path: 'address-book', component: AddressBookComponent, canActivate:[AuthGuards]},
	{path: '', pathMatch: 'full', redirectTo: 'home'},
	{path: '**', component: PagenotfoundComponent },
];

export const routing = RouterModule.forRoot(appRoutes);