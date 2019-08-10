import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-change-referral-code',
  templateUrl: './change-referral-code.page.html',
  styleUrls: ['./change-referral-code.page.scss'],
})
export class ChangeReferralCodePage implements OnInit {

  form: FormGroup;
  saveInProgress = false;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      referralCode: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    this.saveInProgress = true;
    from(this.alertCtrl.create({
      message: '确定要保存吗?您只有一次修改优惠码的机会哦',
      buttons: [{
        text: '取消',
        role: 'cancel'
      }, {
        text: '确定',
        role: 'ok'
      }]
    })).pipe(
      switchMap(dialog => {
        dialog.present();
        return dialog.onDidDismiss();
      }),
      switchMap(data => {
        if (data && data.role === 'ok') {
          return this.authService.bindReferralCode(this.form.value.referralCode);
        }
      })
    ).subscribe(resp => {
      console.log(resp);
      this.saveInProgress = false;
      this.navCtrl.navigateBack(['/tabs/profile']);
    }, error => {
      this.alertCtrl.create({
        header: '保存失败',
        message: '您输入的推荐码不正确',
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
}
