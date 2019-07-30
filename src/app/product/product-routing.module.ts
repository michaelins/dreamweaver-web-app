import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPage } from './product.page';

const routes: Routes = [
    {
        path: ':productId',
        component: ProductPage
    },
    {
        path: '',
        redirectTo: '/tabs/home'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
