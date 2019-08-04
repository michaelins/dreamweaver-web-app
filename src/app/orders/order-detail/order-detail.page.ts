import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, exhaustMap } from 'rxjs/operators';
import { Order, OrderService, OrderShippingAddress, OrderLogistics, OrderStatus } from '../order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  OrderStatus = OrderStatus;
  order: Order;
  shippingAddress: OrderShippingAddress;
  orderLogistics: OrderLogistics;

  constructor(
    private route: ActivatedRoute,
    protected orderService: OrderService
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      exhaustMap(params => {
        if (params.orderId) {
          console.log(params.orderId);
          return forkJoin({
            order: this.orderService.getOrder(params.orderId),
            shippingAddress: this.orderService.getOrderShippingInfo(params.orderId),
            orderLogistics: this.orderService.getOrderLogistics(params.orderId)
          });
        }
      })
    ).subscribe(resp => {
      this.order = resp.order;
      this.shippingAddress = resp.shippingAddress;
      this.orderLogistics = resp.orderLogistics;
      console.log(resp);
    });
  }
}
