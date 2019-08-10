import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  loginInProcess = false;
  fromUrl: string;
  isSmsLogin = false;
  isGetAuthCodeDisabled = false;
  authKey: string;

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

  onDismiss() {
    if (this.fromUrl) {
      this.navCtrl.navigateBack(this.fromUrl);
    } else {
      this.navCtrl.navigateBack(['/tabs/profile']);
    }
  }

  onGetAuthCode() {
    if (this.isSmsLogin) {
      this.isGetAuthCodeDisabled = true;
      this.authService.getAuthCode(this.form.value.accountNo, 'smsLogin').subscribe(response => {
        console.log(response);
        this.authKey = response.authKey;
      }, error => {
        console.log(error);
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
