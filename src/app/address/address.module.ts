import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { AddressDetailPageModule } from './address-detail/address-detail.module';
import { AddressRoutingModule } from './address-routing.module';
import { AddressPage } from './address.page';


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
  entryComponents: [AddressPage]
})
export class AddressPageModule { }
