import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'address', loadChildren: './address/address.module#AddressPageModule' },
  { path: 'clockin', loadChildren: './clockin/clockin.module#ClockinPageModule' },
  { path: 'orders', loadChildren: './orders/orders.module#OrdersPageModule' },
  { path: 'product', loadChildren: './product/product.module#ProductPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: '**', redirectTo: '/tabs/home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
