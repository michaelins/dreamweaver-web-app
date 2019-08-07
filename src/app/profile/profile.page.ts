import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { from, of, Subscription } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ClockinService } from '../clockin/clockin.service';
import { CollectionOfOrders, OrderService } from '../orders/order.service';
import { LoginComponent } from '../shared/login/login.component';
import { UiStateService } from '../shared/ui-state.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  // @ViewChild('scrollable') scrollable: IonContent;

  nickName: string;
  // scrollEvents = true;
  // scrollTop: number;
  // scrollHeight: number;
  // offsetHeight: number;
  // pageX: number;
  // pageY: number;
  // refresherAnimationTimer: any;
  // bodyTouchMoveEventSubscription: Subscription;

  hasClockinPermission = false;

  ordersPageSize = 3;

  collectionOfOrdersToPay: CollectionOfOrders;
  ordersToPaySubscription: Subscription;

  collectionOfOrdersPaid: CollectionOfOrders;
  ordersPaidSubscription: Subscription;

  collectionOfOrdersShipped: CollectionOfOrders;
  ordersShippedSubscription: Subscription;

  collectionOfOrdersDone: CollectionOfOrders;
  ordersDoneSubscription: Subscription;

  constructor(
    private uiStateService: UiStateService,
    private authService: AuthService,
    private clockinService: ClockinService,
    private orderService: OrderService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      console.log(user);
      if (user) {
        this.nickName = user.nickName;
        this.orderService.refreshOrders(this.ordersPageSize).subscribe();
      }
    }, error => {
      console.log(error);
    });
    this.ordersToPaySubscription = this.orderService.ordersToPayObs.subscribe(resp => {
      console.log(resp);
      this.collectionOfOrdersToPay = resp;
    });
    this.ordersPaidSubscription = this.orderService.ordersPaidObs.subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.collectionOfOrdersPaid = resp;
      }
    });
    this.ordersShippedSubscription = this.orderService.ordersShippedObs.subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.collectionOfOrdersShipped = resp;
      }
    });
    this.ordersDoneSubscription = this.orderService.ordersDoneObs.subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.collectionOfOrdersDone = resp;
      }
    });
  }

  ngOnDestroy() {
    this.ordersToPaySubscription.unsubscribe();
    this.ordersPaidSubscription.unsubscribe();
    this.ordersShippedSubscription.unsubscribe();
    this.ordersDoneSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    //   this.scrollEvents = true;
    //   this.bodyTouchMoveEventSubscription = fromEvent<TouchEvent>(document.body, 'touchmove', { passive: false }).subscribe(e => {
    //     const bottomFaVal = this.scrollHeight - this.offsetHeight;
    //     if (this.scrollTop === 0) {
    //       if (e.touches[0].clientY > this.pageY) {
    //         e.preventDefault();
    //       } else {
    //         e.stopPropagation();
    //       }
    //     } else if (this.scrollTop === bottomFaVal) {
    //       if (e.touches[0].clientY < this.pageY) {
    //         e.preventDefault();
    //       } else {
    //         e.stopPropagation();
    //       }
    //     } else if (this.scrollTop > 0 && this.scrollTop < bottomFaVal) {
    //       e.stopPropagation();
    //     } else {
    //       e.preventDefault();
    //     }
    //   });
    this.uiStateService.setTabBarHidden(false);
    console.log('ionViewWillEnter');
  }

  // onTouchMove(event: TouchEvent) {
  //   this.scrollable.getScrollElement().then(el => {
  //     this.scrollTop = el.scrollTop;
  //     this.scrollHeight = el.scrollHeight;
  //     this.offsetHeight = el.offsetHeight;
  //   });
  // }

  // onTouchStart(event: TouchEvent) {
  //   this.scrollable.getScrollElement().then(el => {
  //     this.pageX = event.touches[0].pageX;
  //     this.pageY = event.touches[0].pageY;
  //   });
  // }

  ionViewWillLeave() {
    //   this.scrollEvents = false;
    //   this.bodyTouchMoveEventSubscription.unsubscribe();
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  onClockin() {
    const alertObs = from(this.alertCtrl.create({
      header: '打卡达人',
      message: '您尚未成为达人，请先购买产品',
      buttons: [{
        text: '暂不购买',
        role: 'cancel'
      }, {
        text: '立即购买',
        role: 'ok'
      }]
    })).pipe(
      switchMap(dialog => {
        dialog.present();
        return dialog.onDidDismiss();
      })
    );

    this.loadingCtrl.create({
      message: '资格查询中...',
      spinner: 'crescent'
    }).then(loading => {
      loading.present();
      this.clockinService.getClockinPermission().pipe(
        map(resp => {
          this.loadingCtrl.dismiss();
          if (resp.status === 'NORMAL' && resp.type === 'APPROVED') {
            return { role: 'approved' };
          } else {
            return { role: 'notallowed' };
          }
        }),
        switchMap(data => {
          if (data.role === 'approved') {
            return of(data);
          } else {
            return alertObs;
          }
        }),
        catchError(() => {
          this.loadingCtrl.dismiss();
          return alertObs;
        })
      ).subscribe(data => {
        console.log(data);
        if (data.role === 'ok' || data.role === 'notallowed') {
          this.navCtrl.navigateForward(['/home']);
        } else if (data.role === 'approved') {
          this.navCtrl.navigateForward(['/clockin']);
        }
      }, error => {
        console.log(error);
      });
    });

    // if (!this.hasClockinPermission) {
    //   from(this.alertCtrl.create({
    //     header: '打卡达人',
    //     message: '您尚未成为达人，请先购买产品',
    //     buttons: [{
    //       text: '暂不购买',
    //       role: 'cancel'
    //     }, {
    //       text: '立即购买',
    //       role: 'ok'
    //     }]
    //   })).pipe(
    //     switchMap(dialog => {
    //       dialog.present();
    //       return dialog.onDidDismiss();
    //     })
    //   ).subscribe(data => {
    //     console.log(data);
    //     if (data.role === 'ok') {
    //       this.navCtrl.navigateForward(['/home']);
    //     }
    //   }, console.log);
    // } else {
    //   this.navCtrl.navigateForward(['/clockin']);
    // }
  }

  onClick() {
    this.modalCtrl.create({
      component: LoginComponent
    }).then(modal => {
      modal.present();
    });
  }
}
