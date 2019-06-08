import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      accountNo: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(11)]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)]
      })
    });
  }

  onDismiss() {
    this.navCtrl.pop();
  }

  onLogin() {
    console.log(this.form.value);
    this.authService.login({
      accountNo: this.form.value.accountNo,
      password: this.form.value.password,
      loginDeviceType: 'WXH5',
      loginDeviceNum: '1234567890'
    }).subscribe(response => {
      console.log(response);
      this.navCtrl.navigateRoot(['/tabs/profile']);
    }, error => {
      console.log(error);
    });
  }
}
