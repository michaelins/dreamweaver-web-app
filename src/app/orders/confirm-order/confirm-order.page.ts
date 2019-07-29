import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService, CreateOrderReq, CreateOrderReqItem } from '../order.service';
import { Address, AddressService } from 'src/app/address/address.service';
import { ShoppingCartService, ShoppingCart } from 'src/app/shopping-cart/shopping-cart.service';
import { Subscription } from 'rxjs';
import { NavController, ModalController } from '@ionic/angular';
import { AddressPage } from 'src/app/address/address.page';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.page.html',
  styleUrls: ['./confirm-order.page.scss'],
})
export class ConfirmOrderPage implements OnInit, OnDestroy {

  shoppingCartObservableSubscription: Subscription;
  cart: ShoppingCart;
  address: Address;
  price = 0;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private addressService: AddressService,
    private orderService: OrderService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.shoppingCartObservableSubscription = this.shoppingCartService.shoppingCartObservable.subscribe(resp => {
      if (resp) {
        resp.items = resp.items.filter(item => {
          return item.checked;
        });
        this.cart = resp;
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
    this.shoppingCartObservableSubscription.unsubscribe();
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
    if (orderReq.items.length === 0) {
      return;
    } else {
      this.orderService.createOrder(orderReq).subscribe(resp => {
        console.log(resp);
        this.navCtrl.navigateForward(['/orders', 'pay', resp.id]);
      });
    }
  }

}
