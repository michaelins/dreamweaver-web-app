import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, exhaustMap } from 'rxjs/operators';
import { Order, OrderService, OrderShippingAddress, OrderLogistics, OrderStatus } from '../order.service';
import { forkJoin } from 'rxjs';
import { NavController } from '@ionic/angular';

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
    private navCtrl: NavController,
    private orderService: OrderService
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
      console.log(resp);
      if (resp && resp.order && OrderStatus[resp.order.orderStatus] !== OrderStatus.DELETED_BY_USER) {
        this.order = resp.order;
        this.shippingAddress = resp.shippingAddress;
        this.orderLogistics = resp.orderLogistics;
      } else {
        this.navCtrl.navigateBack(['/orders']);
      }
    });
  }

  showOrderPrimaryButton(status: OrderStatus) {
    this.orderService.showOrderPrimaryButton(status);
  }

  showOrderSecondaryButton(status: OrderStatus) {
    this.orderService.showOrderSecondaryButton(status);
  }

  getOrderPrimaryButtonText(status: OrderStatus) {
    this.orderService.getOrderPrimaryButtonText(status);
  }

  getOrderSecondaryButtonText(status: OrderStatus) {
    this.orderService.getOrderSecondaryButtonText(status);
  }

  onOrderPrimaryButtonClick(status: OrderStatus, orderId: string) {
    const obs = this.orderService.onOrderPrimaryButtonClick(status, orderId);
    if (obs) {
      obs.pipe(
        switchMap(() => {
          return this.orderService.getOrder(this.order.orderId);
        })
      ).subscribe(resp => {
        console.log(resp);
      });
    }
  }

  onOrderSecondaryButtonClick(status: OrderStatus, orderId: string) {
    const obs = this.orderService.onOrderSecondaryButtonClick(status, orderId);
    if (obs) {
      obs.pipe(
        switchMap(() => {
          return forkJoin({
            order: this.orderService.getOrder(this.order.orderId),
            shippingAddress: this.orderService.getOrderShippingInfo(this.order.orderId),
            orderLogistics: this.orderService.getOrderLogistics(this.order.orderId)
          });
        })
      ).subscribe(resp => {
        console.log(resp);
        if (resp && resp.order && OrderStatus[resp.order.orderStatus] !== OrderStatus.DELETED_BY_USER) {
          this.order = resp.order;
          this.shippingAddress = resp.shippingAddress;
          this.orderLogistics = resp.orderLogistics;
        } else {
          this.navCtrl.navigateBack(['/orders']);
        }
      });
    }
  }
}
