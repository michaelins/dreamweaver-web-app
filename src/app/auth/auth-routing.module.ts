import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                loadChildren: './login/login.module#LoginPageModule'
            },
            {
                path: 'password',
                loadChildren: './password-reset/password-reset.module#PasswordResetPageModule'
            },
            {
                path: 'register',
                children: [
                    {
                        path: '',
                        loadChildren: './register/register.module#RegisterPageModule'
                    },
                    {
                        path: 'referral',
                        loadChildren: './register/referral-input/referral-input.module#ReferralInputPageModule'
                    },
                    {
                        path: 'complete',
                        loadChildren: './register/register-complete/register-complete.module#RegisterCompletePageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/auth/login',
                pathMatch: 'full'
            }
        ]
    },
    { path: '**', redirectTo: '/auth/login' }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
