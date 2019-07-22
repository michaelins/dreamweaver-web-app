import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClockinBodydataPage } from './clockin-bodydata.page';

const routes: Routes = [
  {
    path: '',
    component: ClockinBodydataPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClockinBodydataPage]
})
export class ClockinBodydataPageModule {}
