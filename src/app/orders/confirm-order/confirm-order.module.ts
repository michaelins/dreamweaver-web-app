import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfirmOrderPage } from './confirm-order.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddressPageModule } from 'src/app/address/address.module';
import { AddressPage } from 'src/app/address/address.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ConfirmOrderPage
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
  declarations: [ConfirmOrderPage],
  entryComponents: []
})
export class ConfirmOrderPageModule { }
