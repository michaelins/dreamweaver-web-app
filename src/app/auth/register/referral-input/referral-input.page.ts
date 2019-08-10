import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-referral-input',
  templateUrl: './referral-input.page.html',
  styleUrls: ['./referral-input.page.scss'],
})
export class ReferralInputPage implements OnInit {

  form: FormGroup;
  checkInProcess = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      referralCode: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  onPrevStep() {
    this.navCtrl.pop();
  }

  onNextStep() {
    this.checkInProcess = true;
    this.authService.getReferralInfo(this.form.value.referralCode).subscribe(resp => {
      this.checkInProcess = false;
      console.log(resp);
      this.authService.referralInfo = resp;
      this.authService.registerReq.referralCode = this.form.value.referralCode;
      this.navCtrl.navigateForward(['/auth/register/complete']);
    }, error => {
      console.log(error);
      this.alertCtrl.create({
        header: '获取推荐人信息失败',
        message: error.error.message,
        buttons: ['确定']
      }).then(alert => {
        alert.present();
      }).finally(() => {
        this.checkInProcess = false;
      });
    });
  }

  onNoReferralCodeClick() {
    this.authService.referralInfo = null;
    delete this.authService.registerReq.referralCode;
    this.navCtrl.navigateForward(['/auth/register/complete']);
  }
}
