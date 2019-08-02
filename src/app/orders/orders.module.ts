import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersPage } from './orders.page';
import { OrderListComponent } from './order-list/order-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersRoutingModule
  ],
  declarations: [OrdersPage, OrderListComponent]
})
export class OrdersPageModule { }
