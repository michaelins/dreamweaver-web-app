import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { AddressDetailPage } from './address-detail.page';

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
  declarations: [AddressDetailPage],
  exports: [AddressDetailPage],
  entryComponents: [AddressDetailPage]
})
export class AddressDetailPageModule { }
