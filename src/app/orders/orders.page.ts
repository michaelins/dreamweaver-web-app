import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, DoCheck, ElementRef, Renderer2 } from '@angular/core';
import { AlertController, IonSlides, NavController, IonContent } from '@ionic/angular';
import { from, Observable, of, Subscription, fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EqualObject, SortObject } from '../shared/interfaces/common-interfaces';
import { CollectionOfOrders, Order, OrderService, OrderStatus } from './order.service';
import { $enum } from 'ts-enum-util';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  @ViewChild('slides') slides: IonSlides;
  @ViewChild('scrollable') scrollable: IonContent;

  refresherPullProgress = 0;
  isRefresherInProgress: boolean;
  scrollEvents = true;
  scrollTop: number;
  scrollHeight: number;
  offsetHeight: number;
  pageX: number;
  pageY: number;
  refresherAnimationTimer: any;
  bodyTouchMoveEventSubscription: Subscription;

  activeSlideId = 0;
  slideOpts = {
    autoHeight: true
  };

  OrderStatus = OrderStatus;
  ordersPpageSize = 3;
  sortObjs: SortObject[] = [{
    field: 'createTime',
    direction: 0
  }];

  orders: Order[];
  collectionOfOrders: CollectionOfOrders;

  ordersToPay: Order[];
  collectionOfOrdersToPay: CollectionOfOrders;

  ordersUnshipped: Order[];
  collectionOfOrdersUnshipped: CollectionOfOrders;

  ordersShipped: Order[];
  collectionOfOrdersShipped: CollectionOfOrders;

  ordersDone: Order[];
  collectionOfOrdersDone: CollectionOfOrders;

  constructor(
    private orderService: OrderService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.scrollEvents = true;
    this.bodyTouchMoveEventSubscription = fromEvent<TouchEvent>(document.body, 'touchmove', { passive: false }).subscribe(e => {
      const bottomFaVal = this.scrollHeight - this.offsetHeight;
      if (this.scrollTop === 0) {
        if (e.touches[0].clientY > this.pageY) {
          e.preventDefault();
        } else {
          e.stopPropagation();
        }
      } else if (this.scrollTop === bottomFaVal) {
        if (e.touches[0].clientY < this.pageY) {
          e.preventDefault();
        } else {
          e.stopPropagation();
        }
      } else if (this.scrollTop > 0 && this.scrollTop < bottomFaVal) {
        e.stopPropagation();
      } else {
        e.preventDefault();
      }
    });
  }

  ionViewDidEnter() {
    for (let index = 0; index < 5; index++) {
      this.orderService.getOrders(1, this.ordersPpageSize, this.getEqualObj(index), this.sortObjs).subscribe(resp => {
        this.setOrdersFromResonse(index, resp);
        this.onRefreshHeight();
      }, error => {
        console.log(error);
      });
    }
  }

  ionViewWillLeave() {
    this.scrollEvents = false;
    this.bodyTouchMoveEventSubscription.unsubscribe();
    console.log('ionViewWillLeave');
  }

  onTouchEnd(event: TouchEvent) {
    if (this.refresherAnimationTimer) {
      clearTimeout(this.refresherAnimationTimer);
    }
    this.refresherAnimationTimer = setTimeout(() => {
      if (this.refresherPullProgress > 0 && this.refresherPullProgress < 1) {
        this.isRefresherInProgress = false;
        this.refresherPullProgress = 0;
      }
    }, 280);
  }

  onTouchMove(event: TouchEvent) {
    if (this.isRefresherInProgress) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.scrollable.getScrollElement().then(el => {
      this.scrollTop = el.scrollTop;
      this.scrollHeight = el.scrollHeight;
      this.offsetHeight = el.offsetHeight;
    });
  }

  onTouchStart(event: TouchEvent) {
    if (this.isRefresherInProgress) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.scrollable.getScrollElement().then(el => {
      this.pageX = event.touches[0].pageX;
      this.pageY = event.touches[0].pageY;
    });
  }

  loadData(event) {
    console.log('loading more orders...');
    const collectionOfOrders = this.getCollectionOfOrders(this.activeSlideId);
    if (collectionOfOrders.last) {
      event.target.complete();
    } else if (collectionOfOrders.number + 2 <= collectionOfOrders.totalPages) {
      this.orderService.getOrders(
        collectionOfOrders.number + 2,
        this.ordersPpageSize,
        this.getEqualObj(this.activeSlideId),
        this.sortObjs
      ).subscribe(resp => {
        this.pushOrdersFromResonse(this.activeSlideId, resp);
        // this.orders.push(...resp.content);
        // this.collectionOfOrders = resp;
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
      this.slides.updateAutoHeight();
    }, 100);
  }

  doRefresh(event?) {
    console.log('doRefresh', this.activeSlideId);
    for (let index = 0; index < 5; index++) {
      this.orderService.getOrders(1, this.ordersPpageSize, this.getEqualObj(index), this.sortObjs).subscribe(resp => {
        this.setOrdersFromResonse(index, resp);
        this.onRefreshHeight();
      }, error => {
        console.log(error);
      }, () => {
        if (event) {
          event.target.complete();
        }
      });
    }
    // this.orderService.getOrders(1, this.ordersPpageSize, this.getEqualObj(this.activeSlideId), this.sortObjs).subscribe(resp => {
    //   // console.log(resp);
    //   // this.orders = resp.content;
    //   // this.collectionOfOrders = resp;
    //   this.setOrdersFromResonse(this.activeSlideId, resp);
    //   this.onRefreshHeight();
    // }, error => {
    //   console.log(error);
    // }, () => {
    //   if (event) {
    //     event.target.complete();
    //   }
    // });
  }

  onNavTab(id: number) {
    this.slides.slideTo(id).then(() => {
      // this.doRefresh();
    });
  }

  onIonSlideWillChange(event) {
    this.slides.getActiveIndex().then(id => {
      console.log(id);
      this.activeSlideId = id;
      // this.doRefresh();
      this.scrollable.scrollToTop();
    });
  }

  getEqualObj(slideId: number): EqualObject[] {
    let equalObjsToPay: EqualObject[] = [{
      field: 'orderStatus',
      eqObj: 'TO_PAY'
    }];
    switch (slideId) {
      case 0:
        equalObjsToPay = [];
        break;
      case 1:
        equalObjsToPay[0].eqObj = $enum(OrderStatus).indexOfKey('TO_PAY');
        break;
      case 2:
        equalObjsToPay[0].eqObj = $enum(OrderStatus).indexOfKey('PAID');
        break;
      case 3:
        equalObjsToPay[0].eqObj = $enum(OrderStatus).indexOfKey('SHIPPED');
        break;
      case 4:
        equalObjsToPay[0].eqObj = $enum(OrderStatus).indexOfKey('THXGOD');
        break;
      default:
        equalObjsToPay = [];
        break;
    }
    return equalObjsToPay;
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
        collectionOfOrders = this.collectionOfOrdersUnshipped;
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

  setOrdersFromResonse(slideId: number, resp: CollectionOfOrders) {
    console.log(this.activeSlideId, resp);
    switch (slideId) {
      case 0:
        this.orders = resp.content;
        this.collectionOfOrders = resp;
        break;
      case 1:
        this.ordersToPay = resp.content;
        this.collectionOfOrdersToPay = resp;
        break;
      case 2:
        this.ordersUnshipped = resp.content;
        this.collectionOfOrdersUnshipped = resp;
        break;
      case 3:
        this.ordersShipped = resp.content;
        this.collectionOfOrdersShipped = resp;
        break;
      case 4:
        this.ordersDone = resp.content;
        this.collectionOfOrdersDone = resp;
        break;
      default:
        break;
    }
  }

  pushOrdersFromResonse(slideId: number, resp: CollectionOfOrders) {
    console.log(this.activeSlideId, resp);
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
        this.ordersUnshipped.push(...resp.content);
        this.collectionOfOrdersUnshipped = resp;
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
        break;
    }
  }
}
