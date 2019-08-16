import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiStateService } from '../shared/ui-state.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
  isTabBarHidden: boolean;
  shoppingCartItemSize: number;
  shoppingCartSubscription: Subscription;

  constructor(
    public uiStateService: UiStateService,
    private shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    this.isTabBarHidden = this.uiStateService.getTabBarHidden();
    this.shoppingCartSubscription = this.shoppingCartService.shoppingCartObservable.subscribe(resp => {
      if (resp && resp.items && resp.items.length >= 0) {
        this.shoppingCartItemSize = resp.items.length;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.shoppingCartSubscription) {
      this.shoppingCartSubscription.unsubscribe();
    }
  }

  onTouchMove(event) {
    event.stopPropagation();
    event.preventDefault();
  }
}
