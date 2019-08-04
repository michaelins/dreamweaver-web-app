import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddressPageModule } from '../address/address.module';
import { AddToCartComponent } from '../shared/add-to-cart/add-to-cart.component';
import { SharedModule } from '../shared/shared.module';
import { ProductPage } from './product.page';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ProductRoutingModule,
    AddressPageModule,
  ],
  declarations: [ProductPage],
  entryComponents: [AddToCartComponent]
})
export class ProductPageModule { }
