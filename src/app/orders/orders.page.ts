import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SortObject } from '../shared/interfaces/common-interfaces';
import { CollectionOfOrders, Order, OrderService, OrderStatus } from './order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {

  @ViewChild('slides') slides: IonSlides;
  @ViewChild('scrollable') scrollable: IonContent;

  activeSlideId = 0;
  slideOpts = {
    autoHeight: true
  };

  OrderStatus = OrderStatus;
  ordersPageSize = 3;
  sortObjs: SortObject[] = [{
    field: 'createTime',
    direction: 0
  }];

  orders: Order[];
  collectionOfOrders: CollectionOfOrders;
  ordersSubscription: Subscription;

  ordersToPay: Order[];
  collectionOfOrdersToPay: CollectionOfOrders;
  ordersToPaySubscription: Subscription;

  ordersPaid: Order[];
  collectionOfOrdersPaid: CollectionOfOrders;
  ordersPaidSubscription: Subscription;

  ordersShipped: Order[];
  collectionOfOrdersShipped: CollectionOfOrders;
  ordersShippedSubscription: Subscription;

  ordersDone: Order[];
  collectionOfOrdersDone: CollectionOfOrders;
  ordersDoneSubscription: Subscription;

  constructor(
    private orderService: OrderService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.ordersSubscription = this.orderService.ordersObs.subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.orders = resp.content;
        this.collectionOfOrders = resp;
        this.onRefreshHeight();
      } else {
        this.orderService.refreshOrders(this.ordersPageSize).subscribe();
      }
    });
    this.ordersToPaySubscription = this.orderService.ordersToPayObs.subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.ordersToPay = resp.content;
        this.collectionOfOrdersToPay = resp;
        this.onRefreshHeight();
      }
    });
    this.ordersPaidSubscription = this.orderService.ordersPaidObs.subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.ordersPaid = resp.content;
        this.collectionOfOrdersPaid = resp;
        this.onRefreshHeight();
      }
    });
    this.ordersShippedSubscription = this.orderService.ordersShippedObs.subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.ordersShipped = resp.content;
        this.collectionOfOrdersShipped = resp;
        this.onRefreshHeight();
      }
    });
    this.ordersDoneSubscription = this.orderService.ordersDoneObs.subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.ordersDone = resp.content;
        this.collectionOfOrdersDone = resp;
        this.onRefreshHeight();
      }
    });
  }

  ngOnDestroy() {
    this.ordersSubscription.unsubscribe();
    this.ordersToPaySubscription.unsubscribe();
    this.ordersPaidSubscription.unsubscribe();
    this.ordersShippedSubscription.unsubscribe();
    this.ordersDoneSubscription.unsubscribe();
  }

  loadData(event) {
    const collectionOfOrders = this.getCollectionOfOrders(this.activeSlideId);
    if (collectionOfOrders.last) {
      event.target.complete();
    } else if (collectionOfOrders.number + 2 <= collectionOfOrders.totalPages) {
      this.orderService.getOrders(
        collectionOfOrders.number + 2,
        this.ordersPageSize,
        this.getOrderStatusBySlideId(this.activeSlideId),
        this.sortObjs,
        true
      ).subscribe(resp => {
        this.pushOrdersFromResonse(this.activeSlideId, resp);
        event.target.complete();
        this.onRefreshHeight();
      }, error => {
        console.log(error);
      });
    }
  }

  onRefreshHeight() {
    console.log('updateAutoHeight');
    console.log(this.elRef.nativeElement.querySelector('.swiper-wrapper'));
    // this.renderer.removeStyle(this.elRef.nativeElement.querySelector('.swiper-wrapper'), 'height');
    setTimeout(() => {
      if (this.slides) {
        try {
          this.slides.updateAutoHeight();
        } catch (error) {
          console.log(error);
        }
      }
    }, 100);
  }

  doRefresh(event?) {
    console.log('doRefresh', this.activeSlideId);
    this.orderService.refreshOrders(this.ordersPageSize).subscribe(resp => {
      console.log(resp);
    }, error => {
      console.log(error);
    }, () => {
      if (event) {
        event.target.complete();
      }
    });
  }

  onNavTab(id: number) {
    this.slides.slideTo(id);
  }

  onIonSlideWillChange() {
    this.slides.getActiveIndex().then(id => {
      console.log(id);
      this.activeSlideId = id;
      this.scrollable.scrollToTop();
    });
  }

  getOrderStatusBySlideId(slideId: number): OrderStatus {
    switch (slideId) {
      case 0:
        return null;
      case 1:
        return OrderStatus.TO_PAY;
      case 2:
        return OrderStatus.PAID;
      case 3:
        return OrderStatus.SHIPPED;
      case 4:
        return OrderStatus.THXGOD;
      default:
        break;
    }
    return null;
  }

  getCollectionOfOrders(slideId: number): CollectionOfOrders {
    let collectionOfOrders: CollectionOfOrders;
    switch (slideId) {
      case 0:
        collectionOfOrders = this.collectionOfOrders;
        break;
      case 1:
        collectionOfOrders = this.collectionOfOrdersToPay;
        break;
      case 2:
        collectionOfOrders = this.collectionOfOrdersPaid;
        break;
      case 3:
        collectionOfOrders = this.collectionOfOrdersShipped;
        break;
      case 4:
        collectionOfOrders = this.collectionOfOrdersDone;
        break;
      default:
        collectionOfOrders = this.collectionOfOrders;
        break;
    }
    return collectionOfOrders;
  }

  pushOrdersFromResonse(slideId: number, resp: CollectionOfOrders) {
    console.log(slideId, resp);
    switch (slideId) {
      case 0:
        this.orders.push(...resp.content);
        this.collectionOfOrders = resp;
        break;
      case 1:
        this.ordersToPay.push(...resp.content);
        this.collectionOfOrdersToPay = resp;
        break;
      case 2:
        this.ordersPaid.push(...resp.content);
        this.collectionOfOrdersPaid = resp;
        break;
      case 3:
        this.ordersShipped.push(...resp.content);
        this.collectionOfOrdersShipped = resp;
        break;
      case 4:
        this.ordersDone.push(...resp.content);
        this.collectionOfOrdersDone = resp;
        break;
      default:
        this.orders.push(...resp.content);
        this.collectionOfOrders = resp;
        break;
    }
  }
}
