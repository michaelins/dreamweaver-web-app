import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChangeReferralCodePage } from './change-referral-code.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeReferralCodePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChangeReferralCodePage]
})
export class ChangeReferralCodePageModule {}
