import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NavController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-complete',
  templateUrl: './register-complete.page.html',
  styleUrls: ['./register-complete.page.scss'],
})
export class RegisterCompletePage implements OnInit {

  form: FormGroup;
  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({});
  }

  onPrevStep() {
    this.navCtrl.pop();
  }

  onRegister() {
    console.log(this.authService.registerReq);
    this.authService.register().subscribe(response => {
      console.log(response);
      this.navCtrl.navigateRoot(['/tabs/profile']);
    }, error => {
      console.log(error);
    });
  }
}
