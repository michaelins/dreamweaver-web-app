import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressPage } from './address.page';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'detail',
                loadChildren: './address-detail/address-detail.module#AddressDetailPageModule'
            },
            {
                path: '',
                component: AddressPage
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddressRoutingModule { }
