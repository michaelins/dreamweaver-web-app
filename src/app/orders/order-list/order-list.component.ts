import { Component, Input, OnInit } from '@angular/core';
import { Order, OrderService, OrderStatus } from '../order.service';

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
    private orderService: OrderService
  ) { }

  ngOnInit() {
    console.log(this.orders);
    console.log(this.orderStatus);
  }

  showOrderPrimaryButton(status: OrderStatus) {
    return this.orderService.showOrderPrimaryButton(status);
  }

  showOrderSecondaryButton(status: OrderStatus) {
    return this.orderService.showOrderSecondaryButton(status);
  }

  getOrderPrimaryButtonText(status: OrderStatus) {
    return this.orderService.getOrderPrimaryButtonText(status);
  }

  getOrderSecondaryButtonText(status: OrderStatus) {
    return this.orderService.getOrderSecondaryButtonText(status);
  }

  onOrderPrimaryButtonClick(status: OrderStatus, orderId: string) {
    const obs = this.orderService.onOrderPrimaryButtonClick(status, orderId);
    if (obs) {
      obs.subscribe();
    }
  }

  onOrderSecondaryButtonClick(status: OrderStatus, orderId: string) {
    const obs = this.orderService.onOrderSecondaryButtonClick(status, orderId);
    if (obs) {
      obs.subscribe();
    }
  }
}
