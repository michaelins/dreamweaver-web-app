import { Component, OnInit, ViewChild } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { Product } from '../shared/model/product.model';
import { HomeService } from './home.service';
import { IonicProperty } from '../shared/model/ionic-property.model';
import { IonContent, IonRefresher } from '@ionic/angular';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('scrollable') scrollable: IonContent;

  products: Product[] = [];
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  toolbarIonicProperties: IonicProperty[] = [{
    name: '--background',
    value: 'rgba(var(--ion-color-dark-rgb), 0)'
  }];
  toolBarOpacity = 1;
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

  constructor(
    private uiStateService: UiStateService,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
    this.isRefresherInProgress = false;
    this.products.push(...this.homeService.products);
    this.products.push(...this.homeService.products);
    this.products.push(...this.homeService.products);
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

  ionViewWillLeave() {
    this.scrollEvents = false;
    this.bodyTouchMoveEventSubscription.unsubscribe();
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  onScroll(event: CustomEvent) {
    this.toolBarOpacity = 1;
    let ratio = event.detail.scrollTop / 150;
    if (ratio < 0) {
      return;
    } else if (ratio > 1) {
      ratio = 1;
    }
    const currentToolbarBackgroundValue = 'rgba(var(--ion-color-dark-rgb), ' + ratio + ')';
    if (this.toolbarIonicProperties.length <= 0 || this.toolbarIonicProperties[0].value !== currentToolbarBackgroundValue) {
      this.toolbarIonicProperties = [{
        name: '--background',
        value: 'rgba(var(--ion-color-dark-rgb), ' + ratio + ')'
      }];
    }
  }

  loadData(event) {
    setTimeout(() => {
      this.products.push(...this.homeService.products);
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.products.length >= 50) {
        event.target.disabled = true;
      }
    }, 200);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.products.unshift(...this.homeService.products);
      event.target.complete();
      this.toolbarIonicProperties = [{
        name: '--background',
        value: 'rgba(var(--ion-color-dark-rgb), 0)'
      }];
      // this.searchbarIonicProperties = [{
      //   name: '--background',
      //   value: 'rgba(var(--ion-color-light-rgb), 1)'
      // }];
      this.refresherPullProgress = 0;
      this.toolBarOpacity = 1;
      this.isRefresherInProgress = false;

      setTimeout(() => {
        this.isRefresherInProgress = false;
      }, 280);
    }, 400);
  }

  onRefreshStart(event: CustomEvent) {
    this.isRefresherInProgress = true;
  }

  onRefreshPull(event) {
    const progress: Promise<number> = event.target.getProgress();
    progress.then(num => {
      this.refresherPullProgress = num;
      let ratio = 1 - num;
      if (ratio < 0.03) {
        ratio = 0;
      } else if (ratio > 1) {
        ratio = 1;
      }
      this.toolBarOpacity = ratio;
    });
  }

  onTouchEnd(event: TouchEvent) {
    if (this.refresherAnimationTimer) {
      clearTimeout(this.refresherAnimationTimer);
    }
    this.refresherAnimationTimer = setTimeout(() => {
      if (this.refresherPullProgress > 0 && this.refresherPullProgress < 1 && this.toolBarOpacity < 1) {
        this.toolBarOpacity = 1;
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
}
