import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { Product } from '../home/home.service';
import { ShoppingCartService, ShoppingCartItem, ShoppingCart } from './shopping-cart.service';
import { AuthService } from '../auth/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {

  cart: ShoppingCart;
  quantity = 0;
  editMode = false;
  price = 0;

  constructor(
    private uiStateService: UiStateService,
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.shoppingCartService.shoppingCartObservable.subscribe(resp => {
      if (resp) {
        this.cart = resp;
      }
    });
  }

  ionViewWillEnter() {
    this.uiStateService.setTabBarHidden(false);
    console.log('ionViewWillEnter');
    this.shoppingCartService.getShoppingCart().subscribe(resp => {
      console.log(resp);
    }, error => {
      console.log(error);
    });
  }

  ionViewWillLeave() {
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  switchEditMode() {
    this.editMode = !this.editMode;
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 400);
  }

  onAddQuantity(item: ShoppingCartItem) {
    this.shoppingCartService.addToShoppingCart(
      item.goodsId,
      1,
      item.specificationId,
      item.warehouseId
    ).subscribe(resp => {
      console.log(resp.items.length);
    });
  }

  onReduceQuantity(item: ShoppingCartItem) {
    if (item.number <= 1) {
      return;
    }
    this.shoppingCartService.removeFromShoppingCart(
      item.goodsId,
      item.number - 1,
      item.specificationId,
      item.warehouseId
    ).subscribe(resp => {
      console.log(resp.items.length);
    });
  }

  onSelectAllForEdit(event) {
    const checked = event.target.checked;
    this.cart.items.forEach(item => {
      console.log(item.checked);
      item.checked = checked;
    });
  }

  onSelectForPurchase(item: ShoppingCartItem, event) {
    item.checked = !item.checked;
    this.calcPriceAndQuantity();
  }

  onSelectAllForPurchase(event) {
    const checked = event.target.checked;
    this.cart.items.forEach(item => {
      console.log(item.checked);
      item.checked = checked;
    });
    this.calcPriceAndQuantity();
  }

  calcPriceAndQuantity() {
    let price = 0, quantity = 0;
    this.cart.items.forEach(item => {
      if (item.checked) {
        price += (item.goodsPrice * item.number);
        quantity += 1;
      }
    });
    this.price = price;
    this.quantity = quantity;
  }

  onDeleteItems() {
    this.alertCtrl.create({
      message: '确定删除该商品吗？',
      buttons: [{
        text: '取消',
        role: 'cancel'
      }, {
        text: '确定',
        role: 'ok'
      }]
    }).then(dialog => {
      dialog.present();
      return dialog.onDidDismiss();
    }).then(data => {
      if (data && data.role === 'ok') {
        const checkedItems = this.cart.items.filter(item => {
          return item.checked === true;
        });
        console.log(checkedItems);
      }
      console.log(data);
      console.log(this.cart);
    }).catch(error => {
      console.log(error);
    });
  }
}
