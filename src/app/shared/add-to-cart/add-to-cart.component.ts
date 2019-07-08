import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Product } from 'src/app/product/product.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {

  product: Product;
  selectedWarehouseId: number;
  selectedSpecId: number;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.product = this.navParams.get('product');
    this.selectedWarehouseId = this.navParams.get('selectedWarehouseId');
    if (this.product && this.product.specifications && this.product.specifications.length > 0) {
      this.selectedSpecId = this.product.specifications[0].id;
    }
    console.log(this.navParams.get('product'));
    console.log(this.navParams.get('selectedWarehouseId'));
  }

  onSelectSpec(id: number) {
    this.selectedSpecId = id;
  }

  onSelectWarehouse(id: number) {
    this.selectedWarehouseId = id;
  }

  onDismiss() {
    console.log('dismissed');
    this.modalCtrl.dismiss({ message: 'hello' });
  }
}
