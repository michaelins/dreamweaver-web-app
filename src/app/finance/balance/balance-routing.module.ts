import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalancePage } from './balance.page';

const routes: Routes = [
    {
        path: 'balance-detail',
        loadChildren: './balance-detail/balance-detail.module#BalanceDetailPageModule'
    },
    {
        path: 'deposit',
        loadChildren: './deposit/deposit.module#DepositPageModule'
    },
    {
        path: 'withdraw-detail',
        loadChildren: './withdraw-detail/withdraw-detail.module#WithdrawDetailPageModule'
    },
    {
        path: '',
        component: BalancePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BalanceRoutingModule { }
