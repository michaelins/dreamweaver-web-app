import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { from, interval, of, Subscription } from 'rxjs';
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
export class ResetPasswordPage implements OnInit, OnDestroy {

  form: FormGroup;
  saveInProgress = false;
  user: UserInfo;
  isGetAuthCodeDisabled = false;
  authKey: string;
  authCodeSubscription: Subscription;
  authCodeCooldown: number;

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

  ngOnDestroy() {
    if (this.authCodeSubscription) {
      this.authCodeSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.isGetAuthCodeDisabled = false;
    this.authCodeCooldown = undefined;
  }

  ionViewWillLeave() {
    if (this.authCodeSubscription) {
      this.authCodeSubscription.unsubscribe();
    }
  }

  onGetAuthCode() {
    this.isGetAuthCodeDisabled = true;
    this.authCodeSubscription = this.authService.getAuthCode(this.user.accountNo, 'password').pipe(
      switchMap(response => {
        console.log(response);
        this.authKey = response.authKey;
        return interval(1000);
      })
    ).subscribe(response => {
      console.log(response);
      const cooldown = 60 - response;
      if (cooldown <= 0) {
        this.authCodeSubscription.unsubscribe();
        this.isGetAuthCodeDisabled = false;
      } else {
        this.authCodeCooldown = cooldown;
      }
    }, error => {
      console.log(error);
      if (error.status === 404 || error.status === 400) {
        this.alertCtrl.create({
          header: '短信验证失败',
          message: error.error.message,
          buttons: ['确定']
        }).then(alert => {
          alert.present();
        }).finally(() => {
          this.isGetAuthCodeDisabled = false;
        });
      }
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
