import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClockinRecordPage } from './clockin-record.page';
import { ClockinRecordNewComponent } from './clockin-record-new/clockin-record-new.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ClockinRecordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClockinRecordPage, ClockinRecordNewComponent],
  entryComponents: [ClockinRecordNewComponent]
})
export class ClockinRecordPageModule { }
