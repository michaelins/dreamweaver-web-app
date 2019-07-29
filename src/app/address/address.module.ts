import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddressPage } from './address.page';
import { AddressRoutingModule } from './address-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AddressDetailPage } from './address-detail/address-detail.page';
import { AddressDetailPageModule } from './address-detail/address-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddressRoutingModule,
    AddressDetailPageModule
  ],
  declarations: [AddressPage],
  exports: [AddressPage],
  entryComponents: [AddressDetailPage]
})
export class AddressPageModule { }
