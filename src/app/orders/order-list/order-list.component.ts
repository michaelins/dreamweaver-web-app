import { Component, Input, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Order, OrderStatus, OrderService } from '../order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {

  @Input() orders: Order[];
  @Input() orderStatus: OrderStatus;
  @Input() orderId: string;
  OrderStatus = OrderStatus;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    protected orderService: OrderService
  ) { }

  ngOnInit() {
    console.log(this.orders);
    console.log(this.orderStatus);
  }

}
