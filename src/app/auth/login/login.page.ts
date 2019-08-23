import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  form: FormGroup;
  loginInProcess = false;
  fromUrl: string;
  isSmsLogin = false;
  isGetAuthCodeDisabled = false;
  authKey: string;
  authCodeSubscription: Subscription;
  authCodeCooldown: number;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      accountNo: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(11)]
      }),
      // password: new FormControl(null, {
      //   updateOn: 'change',
      //   validators: [Validators.required]
      // }),
      code: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
    this.loginInProcess = false;
    this.fromUrl = this.route.snapshot.queryParamMap.get('from');
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

  onDismiss() {
    if (this.fromUrl) {
      this.navCtrl.navigateBack(this.fromUrl);
    } else {
      this.navCtrl.navigateBack(['/tabs/profile']);
    }
  }

  getAuthBtnText() {
    if (this.isSmsLogin) {
      if (this.isGetAuthCodeDisabled && this.authCodeCooldown) {
        return this.authCodeCooldown + '秒后重新获取';
      } else {
        return '获取验证码';
      }
    } else {
      return '忘记密码';
    }
  }

  onGetAuthCode() {
    if (this.isSmsLogin) {
      this.isGetAuthCodeDisabled = true;
      this.authCodeSubscription = this.authService.getAuthCode(this.form.value.accountNo, 'smsLogin').pipe(
        switchMap(response => {
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
    } else {
      this.navCtrl.navigateForward(['/auth/password']);
    }
  }

  onChangeLoginMethod() {
    this.form.patchValue({ code: null });
    this.isSmsLogin = !this.isSmsLogin;
  }
  onLogin() {
    if (!this.form.valid) {
      this.alertCtrl.create({
        header: '登录失败',
        message: this.isSmsLogin ? '手机号或验证码不正确' : '手机号或密码不正确',
        buttons: ['确定']
      }).then(alert => {
        alert.present();
      });
      return;
    }

    this.loginInProcess = true;
    let loginObs;
    if (this.isSmsLogin) {
      loginObs = this.authService.loginBySms(
        this.form.value.accountNo,
        this.authKey,
        this.form.value.code
      );
    } else {
      loginObs = this.authService.login({
        accountNo: this.form.value.accountNo,
        password: this.form.value.code,
        loginDeviceType: 'WXH5',
        loginDeviceNum: '1234567890'
      });
    }
    loginObs.subscribe(response => {
      this.loginInProcess = false;
      if (this.fromUrl) {
        this.navCtrl.navigateBack(this.fromUrl);
      } else {
        this.navCtrl.navigateBack(['/tabs/profile']);
      }
    }, error => {
      console.log(error);
      if (error.status === 404 || error.status === 400) {
        this.alertCtrl.create({
          header: '登录失败',
          message: error.error.message,
          buttons: ['确定']
        }).then(alert => {
          alert.present();
        }).finally(() => {
          this.loginInProcess = false;
        });
      }
    });
  }
}
