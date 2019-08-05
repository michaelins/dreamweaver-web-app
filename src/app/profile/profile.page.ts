import { Component, OnInit, ViewChild } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { ModalController, PickerController, IonContent, AlertController, NavController } from '@ionic/angular';
import { LoginComponent } from '../shared/login/login.component';
import { AuthService } from '../auth/auth.service';
import { Subscription, fromEvent, from } from 'rxjs';
import { ClockinService } from '../clockin/clockin.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
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

  constructor(
    private uiStateService: UiStateService,
    private authService: AuthService,
    private clockinService: ClockinService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private pickerCtrl: PickerController) {
  }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      if (user) {
        console.log(user);
        this.nickName = user.nickName;
      }
    }, error => {
      console.log(error);
    });
    this.clockinService.getClockinPermission().subscribe(resp => {
      console.log(resp);
      if (resp.status === 'NORMAL' && resp.type === 'APPROVED') {
        this.hasClockinPermission = true;
      }
    });
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
    if (!this.hasClockinPermission) {
      from(this.alertCtrl.create({
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
      ).subscribe(data => {
        console.log(data);
        if (data.role === 'ok') {
          this.navCtrl.navigateForward(['/home']);
        }
      }, console.log);
    } else {
      this.navCtrl.navigateForward(['/clockin']);
    }
  }

  onClick() {
    this.modalCtrl.create({
      component: LoginComponent
    }).then(modal => {
      modal.present();
    });
  }
}
