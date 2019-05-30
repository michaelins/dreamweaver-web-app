import { Component, OnInit, ViewChild } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { Product } from '../shared/model/product.model';
import { HomeService } from './home.service';
import { IonicProperty } from '../shared/model/ionic-property.model';
import { IonContent } from '@ionic/angular';

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
  // searchbarIonicProperties: IonicProperty[] = [{
  //   name: '--background',
  //   value: 'rgba(var(--ion-color-light-rgb), 1)'
  // }];
  toolBarOpacity = 1;
  refresherPullProgress = 0;
  isRefresherInProgress = false;
  scrollTop: number;
  scrollHeight: number;
  offsetHeight: number;
  pageX: number;
  pageY: number;

  constructor(
    private uiStateService: UiStateService,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
    this.products.push(...this.homeService.products);
    this.products.push(...this.homeService.products);
    this.products.push(...this.homeService.products);

    document.body.addEventListener('touchmove', (e) => {
      // if (!e._isScroller) {
      const bottomFaVal = this.scrollHeight - this.offsetHeight;
      console.log(this.scrollTop);
      console.log(bottomFaVal);
      if (this.scrollTop === 0) {
        // console.log(e.touches[0].clientY);
        // console.log(this.pageY);
        if (e.touches[0].clientY > this.pageY) {
          console.log('you can not scroll top');
          e.preventDefault();
        } else {
          e.stopPropagation();
        }

      } else if (this.scrollTop === bottomFaVal) {
        console.log('in the end');
        console.log(e.touches[0].clientY);
        console.log(this.pageY);
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
      // e.preventDefault();

      // } else {
      //   console.log(e._isScroller);
      // }
    }, { passive: false });

  }

  ionViewWillEnter() {
    this.uiStateService.setTabBarHidden(false);
    console.log('ionViewWillEnter');
  }

  ionViewWillLeave() {
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
    // Only change background when necessary
    const currentToolbarBackgroundValue = 'rgba(var(--ion-color-dark-rgb), ' + ratio + ')';
    if (this.toolbarIonicProperties.length <= 0 || this.toolbarIonicProperties[0].value !== currentToolbarBackgroundValue) {
      this.toolbarIonicProperties = [{
        name: '--background',
        value: 'rgba(var(--ion-color-dark-rgb), ' + ratio + ')'
      }];
    }
    // if (ratio < 0.07) {
    //   ratio = 0.07;
    // }
    // const currentSearchbarBackgroundValue = 'rgba(var(--ion-color-light-rgb), ' + ratio + ')';
    // if (this.searchbarIonicProperties.length <= 0 || this.searchbarIonicProperties[0].value !== currentSearchbarBackgroundValue) {
    //   this.searchbarIonicProperties = [{
    //     name: '--background',
    //     value: 'rgba(var(--ion-color-light-rgb), ' + ratio + ')'
    //   }];
    // }
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
    }, 1000);
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
      this.toolBarOpacity = 1;
      this.isRefresherInProgress = false;
    }, 2000);
  }

  onRefreshStart(event: CustomEvent) {
    console.log('onRefreshStart');
    console.log(event);
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

  onTouchEnd(event: CustomEvent) {
    if (this.refresherPullProgress < 1 && this.toolBarOpacity < 1) {
      this.toolBarOpacity = 1;
    }
  }

  onTouchMove(event) {
    // console.log(event);
    if (this.isRefresherInProgress) {
      event.stopPropagation();
      event.preventDefault();
    }
    // console.log(event.target);
    this.scrollable.getScrollElement().then(el => {
      //   if (el.offsetHeight < el.scrollHeight) {
      //     console.log('isScroller! ' + event._isScroller);
      //     event._isScroller = true;
      //     console.log('isScroller! ' + event._isScroller);
      //   }
      this.scrollTop = el.scrollTop;
      this.scrollHeight = el.scrollHeight;
      this.offsetHeight = el.offsetHeight;
    });
  }

  onTouchStart(event) {
    this.scrollable.getScrollElement().then(el => {

      // If we're at the top or the bottom of the containers
      // scroll, push up or down one pixel.
      //
      // this prevents the scroll from "passing through" to
      // the body.
      // if (el.scrollTop === 0) {
      //   console.log('start...');
      //   el.scrollTop = 1;
      // } else if ((el.scrollTop + el.offsetHeight) === el.scrollHeight) {
      //   console.log('end...');
      //   el.scrollTop = el.scrollTop - 1;
      // }

      // console.log();
      // console.log();
      this.pageX = event.touches[0].pageX;
      this.pageY = event.touches[0].pageY;

      // var touch = evt.touches[0]; //获取第一个触点
      //       var x = Number(touch.pageX); //页面触点X坐标
      //       var y = Number(touch.pageY); //页面触点Y坐标
      //       startX = x;
      //       startY = y;
    });
    // console.log();
    // var top = el.scrollTop
    //   , totalScroll = el.scrollHeight
    //   , currentScroll = top + el.offsetHeight


  }
}
