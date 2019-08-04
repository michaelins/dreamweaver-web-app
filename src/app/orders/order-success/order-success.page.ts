import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../order.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.page.html',
  styleUrls: ['./order-success.page.scss'],
})
export class OrderSuccessPage implements OnInit {

  order: Order;

  constructor(
    private route: ActivatedRoute,
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

}
