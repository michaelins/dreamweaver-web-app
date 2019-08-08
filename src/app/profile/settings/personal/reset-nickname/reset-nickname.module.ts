import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResetNicknamePage } from './reset-nickname.page';

const routes: Routes = [
  {
    path: '',
    component: ResetNicknamePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResetNicknamePage]
})
export class ResetNicknamePageModule {}
