import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsPage } from './settings.page';

const routes: Routes = [
    {
        path: 'personal',
        loadChildren: './personal/personal.module#PersonalPageModule'
    },
    {
        path: 'identification',
        loadChildren: './identification/identification.module#IdentificationPageModule'
    },
    {
        path: 'change-referral-code',
        loadChildren: './change-referral-code/change-referral-code.module#ChangeReferralCodePageModule'
    },
    {
        path: '',
        component: SettingsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
