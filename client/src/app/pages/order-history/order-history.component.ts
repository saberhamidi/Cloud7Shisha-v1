import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PagerService } from '../../services/pager.service';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import {MatDialog} from '@angular/material';
import { OrderReceiptComponent } from '../order-receipt/order-receipt.component';
import * as moment from 'moment';
moment.locale("en-gb");

import * as _ from 'underscore';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
    constructor(
        private http: Http, 
        private pagerService: PagerService,
        private userService: UserService,
        private orderService: OrderService,
        private dailog: MatDialog
        ) { }

    private user = this.userService.getCurrentUser();
    private token = this.userService.loadToken();
    private allOrders: any[];
    private currentPage: number = 1;
    public pager: any = {};
    public pagedOrders: any = [];

    ngOnInit() {
        // fetch orders from database
        this.orderService.loadOrdersByUserId(this.user.id, this.token).subscribe(result =>{
            if(result.success){
                this.allOrders = result.orders;
                for(var i = 0; i<this.allOrders.length; i++){
                    this.allOrders[i].date = moment(result.orders[i].date);
                }
                this.setPage(this.currentPage);
            }
        });

   }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.allOrders.length, page);

        // get current page of items
        this.pagedOrders = this.pagedOrders.concat(this.allOrders.slice(this.pager.startIndex, this.pager.endIndex + 1));
    }

    loadMore(){
        if(this.currentPage < this.pager.pages.length){
            this.currentPage ++;
            this.setPage(this.currentPage);
        }
    }

    orderAgain(order: Object){
        this.orderService.orderAgain(order["basket"]);
    }

    showReceipt(order){
        let dailogRef = this.dailog.open(OrderReceiptComponent);
        dailogRef.componentInstance.order = order;
    }
}
