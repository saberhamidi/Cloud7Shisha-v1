import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-order-receipt',
  templateUrl: './order-receipt.component.html',
  styleUrls: ['./order-receipt.component.css']
})
export class OrderReceiptComponent implements OnInit {

	public order: Object; 
  constructor(private orderService: OrderService, public dialogRef: MatDialogRef<OrderReceiptComponent>) { }

  ngOnInit() {

  }

  orderAgain(){
  		this.dialogRef.close();
        this.orderService.orderAgain(this.order["basket"]);
    }

  close(){
    this.dialogRef.close();
  }
}
