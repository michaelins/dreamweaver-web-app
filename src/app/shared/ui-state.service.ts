import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  private isTabBarHidden = true;

  constructor() { }

  setTabBarHidden(isTabBarHidden: boolean) {
    this.isTabBarHidden = isTabBarHidden;
  }

  getTabBarHidden() {
    return this.isTabBarHidden;
  }
}
