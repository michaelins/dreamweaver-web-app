import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductPage } from './product.page';
import { AddToCartComponent } from '../shared/add-to-cart/add-to-cart.component';
import { SharedModule } from '../shared/shared.module';
import { AddressPageModule } from '../address/address.module';
import { AddressPage } from '../address/address.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':productId',
        component: ProductPage
      },
      {
        path: '',
        redirectTo: '/tabs/home'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddressPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductPage],
  entryComponents: [AddToCartComponent, AddressPage]
})
export class ProductPageModule { }
