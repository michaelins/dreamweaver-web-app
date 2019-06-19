import { Component, OnInit, ViewChild } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { ModalController, PickerController, IonContent } from '@ionic/angular';
import { LoginComponent } from '../shared/login/login.component';
import { AuthService } from '../auth/auth.service';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('scrollable') scrollable: IonContent;

  nickName: string;
  scrollEvents = true;
  scrollTop: number;
  scrollHeight: number;
  offsetHeight: number;
  pageX: number;
  pageY: number;
  refresherAnimationTimer: any;

  bodyTouchMoveEventSubscription: Subscription;

  constructor(
    private uiStateService: UiStateService,
    private authService: AuthService,
    private modalCtrl: ModalController,
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
    this.uiStateService.setTabBarHidden(false);
    console.log('ionViewWillEnter');
  }

  onTouchMove(event: TouchEvent) {
    this.scrollable.getScrollElement().then(el => {
      this.scrollTop = el.scrollTop;
      this.scrollHeight = el.scrollHeight;
      this.offsetHeight = el.offsetHeight;
    });
  }

  onTouchStart(event: TouchEvent) {
    this.scrollable.getScrollElement().then(el => {
      this.pageX = event.touches[0].pageX;
      this.pageY = event.touches[0].pageY;
    });
  }

  ionViewWillLeave() {
    this.scrollEvents = false;
    this.bodyTouchMoveEventSubscription.unsubscribe();
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  onClick() {
    this.modalCtrl.create({
      component: LoginComponent
    }).then(modal => {
      modal.present();
    });
  }
}
