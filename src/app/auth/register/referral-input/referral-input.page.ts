import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-referral-input',
  templateUrl: './referral-input.page.html',
  styleUrls: ['./referral-input.page.scss'],
})
export class ReferralInputPage implements OnInit {

  form: FormGroup;
  constructor(
    private authService: AuthService,
    private navCtrl: NavController
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

  }

  onNoReferralCodeClick() {
    
  }
}
