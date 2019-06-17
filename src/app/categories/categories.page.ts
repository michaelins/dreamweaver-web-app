import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  title = 'fuck';
  categorId = 1;

  constructor(
    private uiStateService: UiStateService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.uiStateService.setTabBarHidden(false);
    console.log('ionViewWillEnter');
  }

  ionViewWillLeave() {
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  onNav(id: number) {
    this.title = 'Nav done ' + id;
    this.categorId = id;
  }
}
