import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { AddressPage } from '../../address/address.page';
import { Address, AddressService } from '../../address/address.service';
import { Product, Specification, Warehouse } from '../../product/product.service';
import { ShoppingCart, ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { CreateOrderReq, CreateOrderReqItem, OrderService } from '../order.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.page.html',
  styleUrls: ['./confirm-order.page.scss'],
})
export class ConfirmOrderPage implements OnInit, OnDestroy {

  subscription: Subscription;
  cart: ShoppingCart;
  address: Address;
  price = 0;
  buyNow = false;
  product: Product;
  selectedWarehouse: Warehouse;
  selectedSpec: Specification;
  quantity: number;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private addressService: AddressService,
    private orderService: OrderService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.route.paramMap.pipe(
      map(() => window.history.state as {
        data: {
          product: Product,
          selectedWarehouse: Warehouse,
          selectedSpec: Specification,
          quantity: number;
        }
      }),
      concatMap(state => {
        return this.shoppingCartService.shoppingCartObservable.pipe(
          map(shoppingCart => {
            return { state, shoppingCart };
          })
        );
      })
    ).subscribe(resp => {
      console.log(resp);
      if (resp.state.data) {
        this.buyNow = true;
        this.product = resp.state.data.product;
        this.selectedWarehouse = resp.state.data.selectedWarehouse;
        this.selectedSpec = resp.state.data.selectedSpec;
        this.quantity = resp.state.data.quantity;
      } else if (resp.shoppingCart) {
        const shoppingCart = { ...resp.shoppingCart };
        this.buyNow = false;
        shoppingCart.items = shoppingCart.items.filter(item => {
          return item.checked;
        });
        this.cart = shoppingCart;
        let price = 0;
        this.cart.items.forEach(item => {
          if (item.checked) {
            price += (item.goodsPrice * item.number);
          }
        });
        this.price = price;
        console.log(this.cart);
      }
    });
    if (!this.orderService.orderReq || !this.orderService.orderReq.addressId) {
      this.addressService.getDefaultAddress().subscribe(addr => {
        this.address = addr;
        console.log(addr);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  onSubmit() {
    const orderReq: CreateOrderReq = {
      addressId: this.address.addressId,
      items: []
    };
    if (this.buyNow) {
      orderReq.items.push({
        amount: this.quantity,
        goodsId: this.product.goodsId,
        specificationId: this.selectedSpec.id,
        warehouseId: this.selectedWarehouse.id
      } as CreateOrderReqItem);
    } else {
      this.cart.items.forEach(item => {
        if (item.checked) {
          orderReq.items.push({
            amount: item.number,
            goodsId: item.goodsId,
            specificationId: item.specificationId,
            warehouseId: item.warehouseId
          } as CreateOrderReqItem);
        }
      });
    }

    if (orderReq.items.length === 0) {
      return;
    } else {
      this.orderService.createOrder(orderReq).subscribe(resp => {
        console.log(resp);
        this.navCtrl.navigateForward(['/orders', 'pay', resp.data.id]);
      });
    }
  }

}
