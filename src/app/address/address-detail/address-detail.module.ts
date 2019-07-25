import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddressDetailPage } from './address-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddressDisplayPipe } from 'src/app/shared/pipes/address-display.pipe';

const routes: Routes = [
  {
    path: '',
    component: AddressDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddressDetailPage, AddressDisplayPipe]
})
export class AddressDetailPageModule { }
