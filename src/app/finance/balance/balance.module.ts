import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BalanceRoutingModule } from './balance-routing.module';
import { BalancePage } from './balance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceRoutingModule
  ],
  declarations: [BalancePage]
})
export class BalancePageModule { }
