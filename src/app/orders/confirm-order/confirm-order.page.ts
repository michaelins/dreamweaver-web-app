import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { AddressPage } from '../../address/address.page';
import { Address, AddressService } from '../../address/address.service';
import { Product, Specification, Warehouse } from '../../product/product.service';
import { ShoppingCart, ShoppingCartFeeInfoReqItem, ShoppingCartService, ShoppingCartFeeInfo } from '../../shopping-cart/shopping-cart.service';
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
  buyNow = false;
  product: Product;
  selectedWarehouse: Warehouse;
  selectedSpec: Specification;
  quantity: number;
  feeInfo: ShoppingCartFeeInfo = {
    actuallyGoodsPrice: 0,
    actuallyPaid: 0,
    totalFreight: 0,
    totalTax: 0
  };

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
          concatMap(shoppingCart => {
            const feeInfoReqItems: ShoppingCartFeeInfoReqItem[] = [];
            if (state.data) {
              this.buyNow = true;
              this.product = state.data.product;
              this.selectedWarehouse = state.data.selectedWarehouse;
              this.selectedSpec = state.data.selectedSpec;
              this.quantity = state.data.quantity;
              feeInfoReqItems.push({
                goodsId: state.data.product.goodsId,
                number: state.data.quantity,
                realGoodsPrice: state.data.product.realPrice,
                warehouseId: state.data.selectedWarehouse.id
              });
            } else if (shoppingCart) {
              const localShoppingCart = { ...shoppingCart };
              this.buyNow = false;
              localShoppingCart.items = localShoppingCart.items.filter(item => {
                return item.checked;
              });
              this.cart = localShoppingCart;
              feeInfoReqItems.push(...localShoppingCart.items.map(item => {
                return {
                  goodsId: item.goodsId,
                  number: item.number,
                  realGoodsPrice: item.realGoodsPrice,
                  warehouseId: item.warehouseId
                } as ShoppingCartFeeInfoReqItem;
              }));
            }
            return this.shoppingCartService.getShoppingCartFeeInfo(feeInfoReqItems);
          })
        );
      }),
    ).subscribe(feeInfo => {
      this.feeInfo = feeInfo;
    });
    if (!this.orderService.orderReq || !this.orderService.orderReq.addressId) {
      this.addressService.getDefaultAddress().subscribe(addr => {
        this.address = addr;
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
      this.orderService.createOrder(orderReq).pipe(
        take(1)
      ).subscribe(resp => {
        this.navCtrl.navigateForward(['/orders', 'pay', resp.data.id]);
      });
    }
  }

}
