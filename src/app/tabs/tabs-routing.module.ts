import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: '../home/home.module#HomePageModule'
            },
            {
                path: 'categories',
                loadChildren: '../categories/categories.module#CategoriesPageModule'
            },
            {
                path: 'cart',
                loadChildren: '../shopping-cart/shopping-cart.module#ShoppingCartPageModule',
                canLoad: [AuthGuard]
            },
            {
                path: 'profile',
                loadChildren: '../profile/profile.module#ProfilePageModule',
                canLoad: [AuthGuard]
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsRoutingModule { }