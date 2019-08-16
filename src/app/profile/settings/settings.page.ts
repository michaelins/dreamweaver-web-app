import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  logoutInProgress = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  onLogout() {
    this.logoutInProgress = true;
    from(this.alertCtrl.create({
      message: '是否确定退出登录?',
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
          return this.authService.logout();
        } else {
          return ['canceled'];
        }
      })
    ).subscribe(resp => {
      this.logoutInProgress = false;
      if (resp && resp === 'canceled') {
        console.log('canceled');
      } else {
        this.navCtrl.navigateBack(['/tabs/profile']);
      }
    }, console.log, () => {
      this.logoutInProgress = false;
    });
  }
}
