import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() { }

  onDismiss() {
    this.modalCtrl.dismiss();
  }

  onForgetPassword() {
    this.modalCtrl.dismiss().then(a => {
      console.log(a);
      this.navCtrl.navigateForward('/register');
    });

    this.navCtrl.navigateForward('/register');

  }
}
