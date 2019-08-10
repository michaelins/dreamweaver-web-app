import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePage } from './profile.page';

const routes: Routes = [
    {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsPageModule'
    },
    {
        path: '',
        component: ProfilePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
