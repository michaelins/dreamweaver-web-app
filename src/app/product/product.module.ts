import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductPage } from './product.page';
import { AddToCartComponent } from '../shared/add-to-cart/add-to-cart.component';
import { SharedModule } from '../shared/shared.module';

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
    RouterModule.forChild(routes)
  ],
  declarations: [ProductPage],
  entryComponents: [AddToCartComponent]
})
export class ProductPageModule { }
