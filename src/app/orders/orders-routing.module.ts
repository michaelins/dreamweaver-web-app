import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersPage } from './orders.page';

const routes: Routes = [
    {
        path: 'confirm',
        loadChildren: './confirm-order/confirm-order.module#ConfirmOrderPageModule'
    },
    {
        path: 'success/:orderId',
        loadChildren: './order-success/order-success.module#OrderSuccessPageModule'
    },
    {
        path: 'pay/:orderId',
        loadChildren: './order-pay/order-pay.module#OrderPayPageModule'
    },
    {
        path: ':orderId',
        loadChildren: './order-detail/order-detail.module#OrderDetailPageModule'
    },
    {
        path: '',
        component: OrdersPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }
