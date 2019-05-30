import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  isTabBarHidden: boolean;

  constructor(private uiStateService: UiStateService) { }

  ngOnInit() {
    this.isTabBarHidden = this.uiStateService.getTabBarHidden();
  }

  onTouchMove(event) {
    console.log(event);
    event.stopPropagation();
    event.preventDefault();
  }

}
