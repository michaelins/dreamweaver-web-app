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
      password: new FormControl(null, {
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
      this.navCtrl.navigateBack(['/tabs/home']);
    }
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
      if (this.fromUrl) {
        this.navCtrl.navigateBack(this.fromUrl);
      } else {
        this.navCtrl.navigateBack(['/tabs/home']);
      }
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
