import { Component, Input, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Order, OrderStatus } from '../order.service';

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
  ) { }

  ngOnInit() {
    console.log(this.orders);
  }

  getOrderSecondaryButtonText(status: OrderStatus) {
    switch (status) {
      case OrderStatus.TO_PAY:
      case OrderStatus.PAID:
      case OrderStatus.UNSHIPPED:
        return '取消订单';
      case OrderStatus.SHIPPED:
        return '查看物流';
      case OrderStatus.CANCELED:
      case OrderStatus.RETURNED:
      case OrderStatus.THXGOD:
      case OrderStatus.CLOSED:
        return '删除订单';
      default:
        break;
    }
  }

  getOrderPrimaryButtonText(status: OrderStatus) {
    switch (status) {
      case OrderStatus.TO_PAY:
        return '立即付款';
      case OrderStatus.SHIPPED:
        return '确认收货';
      default:
        break;
    }
  }

  showOrderPrimaryButton(status: OrderStatus) {
    switch (status) {
      case OrderStatus.TO_PAY:
      case OrderStatus.SHIPPED:
        return true;
      default:
        return false;
    }
  }

  showOrderSecondaryButton(status: OrderStatus) {
    switch (status) {
      case OrderStatus.RETURNING:
        return false;
      default:
        return true;
    }
  }

  onOrderPrimaryButtonClick(status: OrderStatus, orderId: string) {
    switch (status) {
      case OrderStatus.TO_PAY:
        this.payOrder(orderId);
        break;
      case OrderStatus.SHIPPED:
        this.confirmOrderReceived(orderId);
        break;
      default:
        break;
    }
  }

  onOrderSecondaryButtonClick(status: OrderStatus, orderId: string) {
    switch (status) {
      case OrderStatus.TO_PAY:
      case OrderStatus.PAID:
      case OrderStatus.UNSHIPPED:
        this.cancelOrder(orderId);
        break;
      case OrderStatus.SHIPPED:
        this.trackingShipment(orderId);
        break;
      case OrderStatus.CANCELED:
      case OrderStatus.RETURNED:
      case OrderStatus.THXGOD:
      case OrderStatus.CLOSED:
        this.deleteOrder(orderId);
        break;
      default:
        break;
    }
  }

  cancelOrder(orderId: string) {
    this.confirmOrderAction(orderId, '确认取消订单吗？取消后不可撤销', of(orderId));
  }

  payOrder(orderId: string) {
    this.navCtrl.navigateForward(['/orders', 'pay', orderId]);
  }

  trackingShipment(orderId) {
    console.log('trackingShipment:', orderId);
  }

  confirmOrderReceived(orderId: string) {
    this.confirmOrderAction(orderId, '确认收货吗？确认后不可撤销', of(orderId));
  }

  deleteOrder(orderId: string) {
    this.confirmOrderAction(orderId, '确认删除订单吗？删除后不可撤销', of(orderId));
  }

  confirmOrderAction(orderId: string, message: string, handlerObs: Observable<any>) {
    from(this.alertCtrl.create({
      message,
      buttons: [{
        text: '取消',
        role: 'cancel'
      }, {
        text: '确定',
        role: 'ok'
      }]
    })).pipe(
      switchMap(dialog => {
        dialog.present();
        return dialog.onDidDismiss();
      }),
      switchMap(data => {
        if (data && data.role === 'ok') {
          console.log('orderId: ', orderId);
          return handlerObs;
        }
      })
    ).subscribe(console.log, console.log);
  }

}
