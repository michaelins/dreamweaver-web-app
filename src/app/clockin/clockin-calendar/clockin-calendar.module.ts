import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClockinCalendarPage } from './clockin-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: ClockinCalendarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClockinCalendarPage]
})
export class ClockinCalendarPageModule {}
