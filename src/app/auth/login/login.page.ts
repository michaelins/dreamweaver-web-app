import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  loginInProcess = false;

  constructor(
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
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
    this.loginInProcess = false;
  }

  onDismiss() {
    this.navCtrl.pop();
  }

  onLogin() {
    if (!this.form.value.accountNo || !this.form.value.password) {
      this.alertCtrl.create({
        header: '登录失败',
        message: '请输入手机号和密码',
        buttons: ['确定']
      }).then(alert => {
        alert.present();
      });
      return;
    }

    this.loginInProcess = true;
    this.authService.login({
      accountNo: this.form.value.accountNo,
      password: this.form.value.password,
      loginDeviceType: 'WXH5',
      loginDeviceNum: '1234567890'
    }).subscribe(response => {
      this.loginInProcess = false;
      this.navCtrl.navigateRoot(['/tabs/profile']);
    }, error => {
      console.log(error);
      if (error.status === 404 || error.status === 400) {
        this.alertCtrl.create({
          header: '登录失败',
          message: '手机号或密码错误',
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
