import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  form: FormGroup;
  isGetAuthCodeDisabled = false;
  saveInProgress = false;
  authKey: string;

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
    console.log(this.form.value.phoneNo);
    this.authService.getAuthCode(this.form.value.phoneNo, 'password').subscribe(response => {
      console.log(response);
      this.authKey = response.authKey;
    }, error => {
      console.log(error);
    });
  }

}
