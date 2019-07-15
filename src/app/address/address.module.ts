import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddressPage } from './address.page';
import { AddressRoutingModule } from './address-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressRoutingModule
  ],
  declarations: [AddressPage]
})
export class AddressPageModule { }
