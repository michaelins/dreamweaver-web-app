import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Product, Specification, Warehouse } from 'src/app/product/product.service';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {

  product: Product;
  selectedWarehouse: Warehouse;
  selectedSpec: Specification;
  quantity = 1;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    console.log(this.navParams.get('product'));
    console.log(this.navParams.get('selectedSpec'));
    console.log(this.navParams.get('selectedWarehouse'));
    this.product = this.navParams.get('product');
    this.selectedSpec = this.navParams.get('selectedSpec');
    this.selectedWarehouse = this.navParams.get('selectedWarehouse');
  }

  onSelectSpec(spec: Specification) {
    this.selectedSpec = spec;
  }

  onSelectWarehouse(warehouse: Warehouse) {
    this.selectedWarehouse = warehouse;
  }

  onAddQuantity() {
    this.quantity++;
  }

  onReduceQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onSubmit() {
    this.shoppingCartService.addToShoppingCart(
      this.product.goodsId,
      this.quantity,
      this.selectedSpec.id,
      this.selectedWarehouse.id).subscribe(resp => {
        this.onDismiss();
        console.log(resp);
      }, error => {
        console.log(error);
      });
  }

  onDismiss() {
    console.log('dismissed');
    this.modalCtrl.dismiss({
      selectedSpec: this.selectedSpec,
      selectedWarehouse: this.selectedWarehouse
    });
  }
}
