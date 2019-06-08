import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form: FormGroup;

  isGetAuthCodeDisabled = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      nickeName: new FormControl(null, {
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

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form.value);
    this.authService.registerReq.nickeName = this.form.value.nickeName;
    this.authService.registerReq.phoneNo = this.form.value.phoneNo;
    this.authService.registerReq.code = this.form.value.code;
    this.authService.registerReq.password = this.form.value.password;
    this.navCtrl.navigateForward(['/auth/register/referral']);
  }

  onGetAuthCode() {
    this.isGetAuthCodeDisabled = true;
    console.log(this.form.value.phoneNo);
    this.authService.getAuthCode(this.form.value.phoneNo, 'register').subscribe(response => {
      console.log(response);
      this.authService.registerReq.authKey = response.authKey;
    }, error => {
      console.log(error);
    });
  }
}
