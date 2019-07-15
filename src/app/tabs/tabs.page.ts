import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  isTabBarHidden: boolean;
  shoppingCartItemSize: number;

  constructor(
    public uiStateService: UiStateService,
    private shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    this.isTabBarHidden = this.uiStateService.getTabBarHidden();
    this.shoppingCartService.shoppingCartObservable.pipe(
      switchMap(cart => {
        if (!cart) {
          return this.shoppingCartService.getShoppingCart();
        } else {
          return of(cart);
        }
      })
    ).subscribe(resp => {
      console.log(resp);
      if (resp && resp.items && resp.items.length > 0) {
        this.shoppingCartItemSize = resp.items.length;
      }
    });
  }

  onTouchMove(event) {
    console.log(event);
    event.stopPropagation();
    event.preventDefault();
  }

}
