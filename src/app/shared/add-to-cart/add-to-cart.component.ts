import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { Product, Specification, Warehouse } from '../../product/product.service';
import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {

  product: Product;
  selectedWarehouse: Warehouse;
  selectedSpec: Specification;
  buyNow = false;
  quantity = 1;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    console.log(this.navParams.get('product'));
    console.log(this.navParams.get('selectedSpec'));
    console.log(this.navParams.get('selectedWarehouse'));
    console.log(this.navParams.get('buyNow'));
    this.product = this.navParams.get('product');
    this.selectedSpec = this.navParams.get('selectedSpec');
    this.selectedWarehouse = this.navParams.get('selectedWarehouse');
    this.buyNow = this.navParams.get('buyNow');
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
    if (this.buyNow) {
      this.navCtrl.navigateForward(['/orders/confirm'], {
        state: {
          data: {
            product: this.product,
            selectedWarehouse: this.selectedWarehouse,
            selectedSpec: this.selectedSpec,
            quantity: this.quantity
          }
        }
      });
      this.onDismiss();
    } else {
      this.shoppingCartService.addToShoppingCart({
        goodsId: this.product.goodsId,
        number: this.quantity,
        specificationId: this.selectedSpec.id,
        warehouseId: this.selectedWarehouse.id
      }).subscribe(resp => {
        this.onDismiss();
        console.log(resp);
      }, error => {
        console.log(error);
      });
    }
  }

  onDismiss() {
    console.log('dismissed');
    this.modalCtrl.dismiss({
      selectedSpec: this.selectedSpec,
      selectedWarehouse: this.selectedWarehouse
    });
  }
}
