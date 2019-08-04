import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmOrderPage } from './confirm-order.page';

const routes: Routes = [
    {
        path: '',
        component: ConfirmOrderPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfirmOrderRoutingModule { }
