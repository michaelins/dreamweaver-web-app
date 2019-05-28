import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { ModalController } from '@ionic/angular';
import { LoginComponent } from '../shared/login/login.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private uiStateService: UiStateService,
    private modalCtrl: ModalController) { }

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

  onClick() {
    this.modalCtrl.create({
      component: LoginComponent
    }).then(modal => {
      modal.present();
    });
  }
}
