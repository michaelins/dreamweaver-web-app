import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService, UserInfo } from '../../../../auth/auth.service';

const passwordConfirmValidator: ValidatorFn = (form: FormGroup) => {
  const password = form.get('newPassword').value;
  const passwordConfirm = form.get('newPasswordConfirm').value;
  return password !== null && passwordConfirm !== null && password === passwordConfirm ? null : { newPasswordConfirm: true };
};

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  form: FormGroup;
  saveInProgress = false;
  user: UserInfo;
  isGetAuthCodeDisabled = false;
  authKey: string;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      newPassword: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      newPasswordConfirm: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      code: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    }, { validators: passwordConfirmValidator });
    this.authService.user.pipe(
      switchMap(user => {
        console.log(user);
        if (user) {
          return this.authService.getUserInfo();
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      this.user = user;
    }, error => {
      console.log(error);
    });
  }

  onGetAuthCode() {
    this.isGetAuthCodeDisabled = true;
    console.log(this.form.value.phoneNo);
    this.authService.getAuthCode(this.user.accountNo, 'password').subscribe(response => {
      console.log(response);
      this.authKey = response.authKey;
    }, error => {
      console.log(error);
    });
  }

  onSubmit() {
    this.saveInProgress = true;
    from(this.alertCtrl.create({
      message: '是否确定修改密码?',
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
          return this.authService.changePassword(
            this.user.accountNo,
            this.authKey,
            this.form.value.code,
            this.form.value.newPassword
          );
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
