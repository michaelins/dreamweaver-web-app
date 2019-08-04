import { Component, OnInit } from '@angular/core';
import { NavParams, AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { OrderService, Order } from '../order.service';
import { from } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-pay',
  templateUrl: './order-pay.page.html',
  styleUrls: ['./order-pay.page.scss'],
})
export class OrderPayPage implements OnInit {

  order: Order;

  constructor(
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private currencyPipe: CurrencyPipe,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.route.params.pipe(switchMap(params => {
      if (params.orderId) {
        console.log(params.orderId);
        return this.orderService.getOrder(params.orderId);
      }
    })).subscribe(resp => {
      this.order = resp;
      console.log(resp);
    });
  }

  payOrder() {
    from(this.alertCtrl.create({
      message: `确认支付 ${this.currencyPipe.transform(this.order.actuallyPaid, 'CNY', 'symbol-narrow')} ?`,
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
          return this.orderService.simulatePayOrder(this.order.orderId);
        }
      })
    ).subscribe(resp => {
      console.log(resp);
      this.navCtrl.navigateForward(['/orders/success', this.order.orderId]);
    }, console.log);
  }
}
