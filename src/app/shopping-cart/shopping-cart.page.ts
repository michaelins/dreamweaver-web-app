import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UiStateService } from '../shared/ui-state.service';
import { ShoppingCart, ShoppingCartItem, ShoppingCartItemRef, ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit, OnDestroy {

  cart: ShoppingCart;
  quantity = 0;
  editMode = false;
  price = 0;
  userSubscription: Subscription;
  shoppingCartSubscription: Subscription;

  constructor(
    private uiStateService: UiStateService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(() => {
      this.shoppingCartService.getShoppingCart().subscribe();
    }, error => {
      console.log(error);
    });
    this.shoppingCartSubscription = this.shoppingCartService.shoppingCartObservable.subscribe(resp => {
      if (resp) {
        this.cart = resp;
      }
    });
  }

  ngOnDestroy() {
    console.log('shopping cart page destroyed.');
    this.userSubscription.unsubscribe();
    this.shoppingCartSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.uiStateService.setTabBarHidden(false);
    console.log('ionViewWillEnter');
  }

  ionViewWillLeave() {
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    this.editMode = false;
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
    this.shoppingCartService.addToShoppingCart({
      goodsId: item.goodsId,
      number: 1,
      specificationId: item.specificationId,
      warehouseId: item.warehouseId
    }).subscribe(resp => {
      console.log(resp.items.length);
    });
  }

  onReduceQuantity(item: ShoppingCartItem) {
    if (item.number <= 1) {
      return;
    }
    this.shoppingCartService.removeFromShoppingCart([{
      goodsId: item.goodsId,
      number: item.number - 1,
      specificationId: item.specificationId,
      warehouseId: item.warehouseId
    }]).subscribe(resp => {
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

  onCreateOrder() {
    if (this.quantity === 0) {
      return;
    } else {
      this.navCtrl.navigateForward(['/orders/confirm']);
    }
  }

  onDeleteItems() {
    from(this.alertCtrl.create({
      message: '确定删除该商品吗？',
      buttons: [{
        text: '取消',
        role: 'cancel'
      }, {
        text: '确定',
        role: 'ok'
      }]
    })).pipe(
      switchMap(dialog => {
        dialog.present();
        return dialog.onDidDismiss();
      }),
      switchMap(data => {
        if (data && data.role === 'ok') {
          const checkedItems = this.cart.items.filter(item => {
            return item.checked === true;
          }).map<ShoppingCartItemRef>(item => {
            return {
              goodsId: item.goodsId,
              number: 0,
              specificationId: item.specificationId,
              warehouseId: item.warehouseId
            };
          });
          // console.log(checkedItems);
          return this.shoppingCartService.removeFromShoppingCart(checkedItems);
        }
      })
    ).subscribe(resp => {
      console.log(resp);
      this.cart = resp;
    }, console.log);
  }
}
