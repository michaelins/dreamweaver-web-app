import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { RegisterPage } from './register.page';

const routes: Routes = [
    {
        path: 'complete',
        loadChildren: './register-complete/register-complete.module#RegisterCompletePageModule'
    },
    {
        path: 'referral',
        loadChildren: './referral-input/referral-input.module#ReferralInputPageModule'
    },
    {
        path: '',
        component: RegisterPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegisterRoutingModule { }
