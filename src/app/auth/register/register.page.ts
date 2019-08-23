import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {

  form: FormGroup;

  isGetAuthCodeDisabled = false;
  authCodeSubscription: Subscription;
  authCodeCooldown: number;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      nickName: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(15)]
      }),
      phoneNo: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(11)]
      }),
      code: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)]
      })
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

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form.value);
    this.authService.registerReq.nickName = this.form.value.nickName;
    this.authService.registerReq.phoneNo = this.form.value.phoneNo;
    this.authService.registerReq.code = this.form.value.code;
    this.authService.registerReq.password = this.form.value.password;
    this.navCtrl.navigateForward(['/auth/register/referral']);
  }

  onGetAuthCode() {
    this.isGetAuthCodeDisabled = true;
    console.log(this.form.value.phoneNo);
    this.authCodeSubscription = this.authService.getAuthCode(this.form.value.phoneNo, 'register').pipe(
      switchMap(response => {
        console.log(response);
        this.authService.registerReq.authKey = response.authKey;
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
}
