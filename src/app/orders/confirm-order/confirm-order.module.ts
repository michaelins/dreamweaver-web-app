import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddressPageModule } from '../../address/address.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmOrderRoutingModule } from './confirm-order-routing.module';
import { ConfirmOrderPage } from './confirm-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ConfirmOrderRoutingModule,
    AddressPageModule,
  ],
  declarations: [ConfirmOrderPage]
})
export class ConfirmOrderPageModule { }
