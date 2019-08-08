import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancePage } from './finance.page';

const routes: Routes = [
    {
        path: 'balance',
        loadChildren: './balance/balance.module#BalancePageModule'
    },
    {
        path: 'rank',
        loadChildren: './finance-rank/finance-rank.module#FinanceRankPageModule'
    },
    {
        path: '',
        component: FinancePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinanceRoutingModule { }
