import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FinancePage } from './finance.page';
import { FinanceRoutingModule } from './finance-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinanceRoutingModule
  ],
  declarations: [FinancePage]
})
export class FinancePageModule { }
