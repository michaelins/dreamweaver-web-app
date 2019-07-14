import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { Product } from '../home/home.service';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {

  constructor(
    private uiStateService: UiStateService,
    private shoppingCartService: ShoppingCartService
  ) { }

  ngOnInit() {
    // this.shoppingCartService.getShoppingCart().subscribe(resp => {
    //   console.log(resp);
    // });
  }

  ionViewWillEnter() {
    this.uiStateService.setTabBarHidden(false);
    console.log('ionViewWillEnter');
  }

  ionViewWillLeave() {
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }
}
