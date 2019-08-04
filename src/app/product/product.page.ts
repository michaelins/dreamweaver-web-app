import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AddressPage } from '../address/address.page';
import { Address, AddressService } from '../address/address.service';
import { AddToCartComponent } from '../shared/add-to-cart/add-to-cart.component';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { Product, ProductService, Specification, Warehouse } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  @ViewChild('scrollable') scrollable: IonContent;
  @ViewChild('detail') detail: ElementRef<HTMLElement>;

  product: Product;
  selectedWarehouse: Warehouse;
  selectedSpec: Specification;
  shoppingCartItemSize: number;
  address: Address;

  sectionId = 1;
  scrollEvents = true;
  isScrolling = false;
  slideOpts = {
    speed: 400,
    loop: true,
    lazy: true
  };

  constructor(
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.route.params.pipe(switchMap(params => {
      if (params.productId) {
        console.log(params.productId);
        return this.productService.getProduct(params.productId);
      }
    })).subscribe(resp => {
      this.product = resp;
      if (this.product.warehouses && this.product.warehouses.length > 0) {
        this.selectedWarehouse = this.product.warehouses[0];
      }
      if (this.product.specifications && this.product.specifications.length > 0) {
        this.selectedSpec = this.product.specifications[0];
      }
      console.log(resp);
    });
    this.shoppingCartService.shoppingCartObservable.subscribe(resp => {
      console.log(resp);
      if (resp && resp.items && resp.items.length > 0) {
        this.shoppingCartItemSize = resp.items.length;
      }
    });
    this.addressService.getDefaultAddress().subscribe(resp => {
      this.address = resp;
    });
  }

  ionViewWillEnter() {
    this.scrollEvents = true;
  }

  ionViewWillLeave() {
    this.scrollEvents = false;
  }

  onClickWarehouse(warehouse: Warehouse) {
    this.selectedWarehouse = warehouse;
  }

  onNav(id: number) {
    if (this.isScrolling) {
      console.log('scrolling, ignore nav');
      return;
    }
    this.sectionId = id;
    if (this.sectionId === 1) {
      this.scrollable.scrollToTop(100);
    } else if (this.sectionId === 2) {
      this.scrollable.scrollToPoint(0, this.detail.nativeElement.offsetTop, 100);
    }
  }

  onAddToCart() {
    this.modalCtrl.create({
      component: AddToCartComponent,
      componentProps: {
        product: this.product,
        selectedSpec: this.selectedSpec,
        selectedWarehouse: this.selectedWarehouse
      },
      cssClass: 'auto-height bottom'
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(message => {
      console.log(message);
      if (message.data && message.data.selectedSpec) {
        this.selectedSpec = message.data.selectedSpec;
      }
      if (message.data && message.data.selectedWarehouse) {
        this.selectedWarehouse = message.data.selectedWarehouse;
      }
    });
  }

  onSelectAddress() {
    this.modalCtrl.create({
      component: AddressPage,
      componentProps: {
        isModal: true
      }
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(message => {
      console.log(message);
      if (message.data && message.data.selectedAddress) {
        this.address = message.data.selectedAddress;
      }
    });
  }

  onScroll(event: CustomEvent) {
    this.scrollable.getScrollElement().then(el => {
      const bottomVal = el.scrollHeight - el.offsetHeight;
      if (el.scrollTop === bottomVal) {
        this.sectionId = 2;
      } else if (el.scrollTop < bottomVal) {
        if (event.detail.scrollTop < this.detail.nativeElement.offsetTop) {
          this.sectionId = 1;
        } else {
          this.sectionId = 2;
        }
      }
    });
  }

  onIonScrollStart() {
    this.isScrolling = true;
    console.log('onIonScrollStart');
  }

  onIonScrollEnd() {
    this.isScrolling = false;
    console.log('onIonScrollEnd');
  }
}
