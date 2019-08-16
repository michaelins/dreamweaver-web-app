import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { from, Subscription, of } from 'rxjs';
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
  selectAllChecked: boolean;

  constructor(
    private uiStateService: UiStateService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
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
        this.updateSelectAllStatus();
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
      this.toastCtrl.create({
        message: '只有1件了，真的不能再少了哦',
        position: 'middle',
        color: 'dark',
        duration: 2000
      }).then(toast => {
        toast.present();
      });
    } else {
      this.shoppingCartService.removeFromShoppingCart([{
        goodsId: item.goodsId,
        number: item.number - 1,
        specificationId: item.specificationId,
        warehouseId: item.warehouseId
      }]).subscribe(resp => {
        console.log(resp.items.length);
      });
    }
  }

  updateSelectAllStatus() {
    const foundUnchecked = this.cart.items.find(unchecked => !unchecked.checked);
    const foundchecked = this.cart.items.find(checked => checked.checked);
    if (!foundUnchecked) {
      this.selectAllChecked = true;
    } else if ((foundUnchecked && foundchecked) || !foundchecked) {
      this.selectAllChecked = false;
    }
  }

  onSelectAllForEdit(event) {
    const checked = event.target.checked;
    this.cart.items.forEach(item => {
      console.log(item.checked);
      item.checked = checked;
    });
    this.selectAllChecked = checked;
  }

  onSelectForPurchase(item: ShoppingCartItem, event) {
    item.checked = !item.checked;
    this.updateSelectAllStatus();
    this.calcPriceAndQuantity();
  }

  onSelectAllForPurchase(event) {
    const checked = event.target.checked;
    this.cart.items.forEach(item => {
      item.checked = checked;
    });
    this.selectAllChecked = checked;
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
      this.toastCtrl.create({
        message: '您还没有选择商品哦',
        position: 'middle',
        color: 'dark',
        duration: 2000
      }).then(toast => {
        toast.present();
      });
    } else {
      this.navCtrl.navigateForward(['/orders/confirm']);
    }
  }

  onDeleteItems(itemToDelete?: ShoppingCartItem) {
    const itemsToDelete = [] as ShoppingCartItemRef[];
    if (itemToDelete) {
      itemsToDelete.push({
        goodsId: itemToDelete.goodsId,
        number: 0,
        specificationId: itemToDelete.specificationId,
        warehouseId: itemToDelete.warehouseId
      });
    } else {
      itemsToDelete.push(...this.cart.items.filter(item => {
        return item.checked === true;
      }).map<ShoppingCartItemRef>(item => {
        return {
          goodsId: item.goodsId,
          number: 0,
          specificationId: item.specificationId,
          warehouseId: item.warehouseId
        };
      }));
    }
    console.log(itemsToDelete);
    if (itemsToDelete.length === 0) {
      this.toastCtrl.create({
        message: '您还没有选择要删除商品哦',
        position: 'middle',
        color: 'dark',
        duration: 2000
      }).then(toast => {
        toast.present();
      });
      return;
    }

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
          return this.shoppingCartService.removeFromShoppingCart(itemsToDelete);
        } else {
          return of(null);
        }
      })
    ).subscribe(() => {
      this.updateSelectAllStatus();
      this.calcPriceAndQuantity();
      this.editMode = !this.editMode;
    });
  }
}
