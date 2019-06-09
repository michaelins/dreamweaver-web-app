import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { ModalController, PickerController } from '@ionic/angular';
import { LoginComponent } from '../shared/login/login.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  nickName: string;

  constructor(
    private uiStateService: UiStateService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private pickerCtrl: PickerController) {
  }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      if (user) {
        console.log(user);
        this.nickName = user.nickName;
      }
    }, error => {
      console.log(error);
    });
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
