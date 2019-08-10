import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService, UserInfo } from '../../../../auth/auth.service';

@Component({
  selector: 'app-reset-nickname',
  templateUrl: './reset-nickname.page.html',
  styleUrls: ['./reset-nickname.page.scss'],
})
export class ResetNicknamePage implements OnInit {

  form: FormGroup;
  isGetAuthCodeDisabled = false;
  saveInProgress = false;
  user: UserInfo;
  authKey: string;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      nickname: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    this.saveInProgress = true;
    from(this.alertCtrl.create({
      message: '是否确定修改昵称?',
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
          const userInfo = { nickName: this.form.value.nickname } as { headPortrait?: string, nickName?: string };
          return this.authService.changeUserInfo(userInfo);
        }
      })
    ).subscribe(resp => {
      console.log(resp);
      this.saveInProgress = false;
      this.navCtrl.navigateBack(['/tabs/profile']);
    }, error => {
      this.alertCtrl.create({
        header: '修改失败',
        message: error.error.message,
        buttons: ['确定']
      }).then(alert => {
        alert.present();
      }).finally(() => {
        this.saveInProgress = false;
      });
    }, () => {
      this.saveInProgress = false;
    });
  }

}
