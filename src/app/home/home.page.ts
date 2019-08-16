import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { IonSearchbar, NavController } from '@ionic/angular';
import { UiStateService } from '../shared/ui-state.service';
import { Banner, CollectionOfProduct, HomeService, Product } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // @ViewChild('scrollable') scrollable: IonContent;
  @ViewChild('searchbar') searchbar: IonSearchbar;

  banners: Banner[] = [];
  products: Product[];
  collectionOfProduct: CollectionOfProduct = {};
  productsPageSize = 2;
  slideOpts = {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 3000,
    },
    lazy: true
  };
  // toolbarIonicProperties: IonicProperty[] = [{
  //   name: '--background',
  //   value: 'rgba(var(--ion-color-primary-rgb), 0)'
  // }];
  // toolBarOpacity = 1;
  // refresherPullProgress = 0;
  // isRefresherInProgress: boolean;
  // scrollEvents = true;
  // scrollTop: number;
  // scrollHeight: number;
  // offsetHeight: number;
  // pageX: number;
  // pageY: number;
  // refresherAnimationTimer: any;
  // bodyTouchMoveEventSubscription: Subscription;

  constructor(
    private uiStateService: UiStateService,
    private homeService: HomeService,
    private navCtrl: NavController,
    // tslint:disable-next-line: deprecation
    private renderer: Renderer
  ) { }

  ngOnInit(): void {
    // this.isRefresherInProgress = false;
    this.homeService.getBanners().subscribe(resp => {
      this.banners.push(...resp);
    }, error => {
      console.log(error);
    });
    this.homeService.getProducts(1, this.productsPageSize).subscribe(resp => {
      this.products = resp.content;
      this.collectionOfProduct = resp;
    }, error => {
      console.log(error);
    });
  }

  ionViewWillEnter() {
    // this.scrollEvents = true;
    // this.bodyTouchMoveEventSubscription = fromEvent<TouchEvent>(document.body, 'touchmove', { passive: false }).subscribe(e => {
    //   const bottomFaVal = this.scrollHeight - this.offsetHeight;
    //   if (this.scrollTop === 0) {
    //     if (e.touches[0].clientY > this.pageY) {
    //       e.preventDefault();
    //     } else {
    //       e.stopPropagation();
    //     }
    //   } else if (this.scrollTop === bottomFaVal) {
    //     if (e.touches[0].clientY < this.pageY) {
    //       e.preventDefault();
    //     } else {
    //       e.stopPropagation();
    //     }
    //   } else if (this.scrollTop > 0 && this.scrollTop < bottomFaVal) {
    //     e.stopPropagation();
    //   } else {
    //     e.preventDefault();
    //   }
    // });
    this.uiStateService.setTabBarHidden(false);
  }

  ionViewWillLeave() {
    // this.scrollEvents = false;
    // this.bodyTouchMoveEventSubscription.unsubscribe();
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  // onScroll(event: CustomEvent) {
  //   this.toolBarOpacity = 1;
  //   let ratio = event.detail.scrollTop / 150;
  //   if (ratio < 0) {
  //     return;
  //   } else if (ratio > 1) {
  //     ratio = 1;
  //   }
  //   const currentToolbarBackgroundValue = 'rgba(var(--ion-color-primary-rgb), ' + ratio + ')';
  //   if (this.toolbarIonicProperties.length <= 0 || this.toolbarIonicProperties[0].value !== currentToolbarBackgroundValue) {
  //     this.toolbarIonicProperties = [{
  //       name: '--background',
  //       value: 'rgba(var(--ion-color-primary-rgb), ' + ratio + ')'
  //     }];
  //   }
  // }

  loadData(event) {
    if (this.collectionOfProduct.last) {
      event.target.complete();
      event.target.disabled = true;
    } else if (this.collectionOfProduct.number + 2 <= this.collectionOfProduct.totalPages) {
      this.homeService.getProducts(this.collectionOfProduct.number + 2, this.productsPageSize).subscribe(resp => {
        console.log(resp);
        this.products.push(...resp.content);
        this.collectionOfProduct = resp;
        event.target.complete();
      }, error => {
        console.log(error);
      });
    }
    // setTimeout(() => {
    //   // this.products.push(...this.homeService.products);
    //   console.log('Done');
    //   event.target.complete();

    //   // App logic to determine if all data is loaded
    //   // and disable the infinite scroll
    //   // if (this.products.length >= 50) {
    //   event.target.disabled = true;
    //   // }
    // }, 700);
  }

  doRefresh(event) {
    setTimeout(() => {
      // this.products.unshift(...this.homeService.products);
      event.target.complete();
      // this.toolbarIonicProperties = [{
      //   name: '--background',
      //   value: 'rgba(var(--ion-color-primary-rgb), 0)'
      // }];
      // this.searchbarIonicProperties = [{
      //   name: '--background',
      //   value: 'rgba(var(--ion-color-light-rgb), 1)'
      // }];
      // this.refresherPullProgress = 0;
      // this.toolBarOpacity = 1;
      // this.isRefresherInProgress = false;

      // setTimeout(() => {
      //   // this.isRefresherInProgress = false;
      // }, 280);
    }, 400);
  }

  // onRefreshStart(event: CustomEvent) {
  // this.isRefresherInProgress = true;
  // }

  // onRefreshPull(event) {
  // const progress: Promise<number> = event.target.getProgress();
  // progress.then(num => {
  //   this.refresherPullProgress = num;
  //   let ratio = 1 - num;
  //   if (ratio < 0.03) {
  //     ratio = 0;
  //   } else if (ratio > 1) {
  //     ratio = 1;
  //   }
  //   this.toolBarOpacity = ratio;
  // });
  // }

  onSearch(event) {
    this.renderer.invokeElementMethod(event.target, 'blur');
    this.navCtrl.navigateForward(['/search/result'], { queryParams: { keyword: this.searchbar.value } });
  }

  // onTouchEnd(event: TouchEvent) {
  //   if (this.refresherAnimationTimer) {
  //     clearTimeout(this.refresherAnimationTimer);
  //   }
  //   this.refresherAnimationTimer = setTimeout(() => {
  //     if (this.refresherPullProgress > 0 && this.refresherPullProgress < 1) {
  //       this.isRefresherInProgress = false;
  //       this.refresherPullProgress = 0;
  //     }
  //   }, 280);
  // }

  // onTouchMove(event: TouchEvent) {
  //   if (this.isRefresherInProgress) {
  //     event.stopPropagation();
  //     event.preventDefault();
  //   }
  //   this.scrollable.getScrollElement().then(el => {
  //     this.scrollTop = el.scrollTop;
  //     this.scrollHeight = el.scrollHeight;
  //     this.offsetHeight = el.offsetHeight;
  //   });
  // }

  // onTouchStart(event: TouchEvent) {
  //   if (this.isRefresherInProgress) {
  //     event.stopPropagation();
  //     event.preventDefault();
  //   }
  //   this.scrollable.getScrollElement().then(el => {
  //     this.pageX = event.touches[0].pageX;
  //     this.pageY = event.touches[0].pageY;
  //   });
  // }

}
