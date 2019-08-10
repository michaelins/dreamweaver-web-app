import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalPage } from './personal.page';

const routes: Routes = [
    {
        path: 'reset-nickname',
        loadChildren: './reset-nickname/reset-nickname.module#ResetNicknamePageModule'
    },
    {
        path: 'reset-password',
        loadChildren: './reset-password/reset-password.module#ResetPasswordPageModule'
    },
    {
        path: '',
        component: PersonalPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PersonalRoutingModule { }
