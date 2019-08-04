import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderPayPage } from './order-pay.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderPayPage],
  providers: [CurrencyPipe]
})
export class OrderPayPageModule { }
