import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit, OnDestroy {

  form: FormGroup;
  isGetAuthCodeDisabled = false;
  saveInProgress = false;
  authKey: string;
  authCodeSubscription: Subscription;
  authCodeCooldown: number;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
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
    this.saveInProgress = true;
    this.authService.findPassword(
      this.form.value.phoneNo,
      this.authKey,
      this.form.value.code,
      this.form.value.password).subscribe(resp => {
        console.log(resp);
        this.saveInProgress = false;
        this.navCtrl.navigateBack(['/auth/login']);
      }, error => {
        console.log(error);
        this.alertCtrl.create({
          header: '找回密码失败',
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

  onGetAuthCode() {
    this.isGetAuthCodeDisabled = true;
    this.authCodeSubscription = this.authService.getAuthCode(this.form.value.phoneNo, 'password').pipe(
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

}
