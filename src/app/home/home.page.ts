import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { Product } from '../shared/model/product.model';
import { HomeService } from './home.service';
import { IonicProperty } from '../shared/model/ionic-property.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  products: Product[] = [];
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  toolbarIonicProperties: IonicProperty[] = [{
    name: '--background',
    value: 'rgba(var(--ion-color-dark-rgb), 0)'
  }];
  searchbarIonicProperties: IonicProperty[] = [{
    name: '--background',
    value: 'rgba(var(--ion-color-light-rgb), 0.07)'
  }];
  toolBarOpacity = 1;
  refresherPullProgress = 0;

  constructor(
    private uiStateService: UiStateService,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
    this.products.push(...this.homeService.products);
    this.products.push(...this.homeService.products);
    this.products.push(...this.homeService.products);
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
    if (ratio < 0.07) {
      ratio = 0.07;
    }
    const currentSearchbarBackgroundValue = 'rgba(var(--ion-color-light-rgb), ' + ratio + ')';
    if (this.searchbarIonicProperties.length <= 0 || this.searchbarIonicProperties[0].value !== currentSearchbarBackgroundValue) {
      this.searchbarIonicProperties = [{
        name: '--background',
        value: 'rgba(var(--ion-color-light-rgb), ' + ratio + ')'
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
      this.searchbarIonicProperties = [{
        name: '--background',
        value: 'rgba(var(--ion-color-light-rgb), 0.07)'
      }];
      this.toolBarOpacity = 1;
    }, 1000);
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
      console.log(event);
    });
  }

  onTouchEnd(event) {
    if (this.refresherPullProgress < 1 && this.toolBarOpacity < 1) {
      this.toolBarOpacity = 1;
    }
  }

}
