import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('searchbar') searchbar: IonSearchbar;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.searchbar);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.setFocus();
  }

  setFocus() {
    this.searchbar.setFocus();
  }

  onDismiss() {
    this.modalCtrl.dismiss();
  }

  onFocus() {
    console.log('focused');
  }

}
