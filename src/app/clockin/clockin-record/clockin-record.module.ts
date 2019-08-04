import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { ClockinRecordNewComponent } from './clockin-record-new/clockin-record-new.component';
import { ClockinRecordPage } from './clockin-record.page';

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
