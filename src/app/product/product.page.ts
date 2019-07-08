import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonContent, IonGrid, ModalController } from '@ionic/angular';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { ProductService, Product, Warehouse } from './product.service';
import { ActivatedRoute } from '@angular/router';
import { element } from '@angular/core/src/render3';
import { AddToCartComponent } from '../shared/add-to-cart/add-to-cart.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  @ViewChild('scrollable') scrollable: IonContent;
  @ViewChild('detail') detail: ElementRef<HTMLElement>;

  product: Product;
  selectedWarehouseId: number;
  selectedWarehouse: Warehouse;

  sectionId = 1;
  scrollEvents = true;
  slideOpts = {
    speed: 400,
    loop: true,
    lazy: true
  };

  constructor(
    private productService: ProductService,
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
        this.selectedWarehouseId = this.product.warehouses[0].id;
        this.selectedWarehouse = this.product.warehouses[0];
      }
      console.log(resp);
    });
  }

  ionViewWillEnter() {
    this.scrollEvents = true;
  }

  ionViewWillLeave() {
    this.scrollEvents = false;
  }

  onClickWarehouse(id: number) {
    this.selectedWarehouseId = id;
    this.selectedWarehouse = this.product.warehouses.find(warehouse => {
      return warehouse.id === id;
    });
  }

  getWarehouseBtnColor(id: number) {
    return (id === this.selectedWarehouseId) ? 'secondary' : 'light';
  }

  onNav(id: number) {
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
        selectedWarehouseId: this.selectedWarehouseId
      },
      cssClass: 'auto-height bottom'
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(message => {
      console.log(message);
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
}
