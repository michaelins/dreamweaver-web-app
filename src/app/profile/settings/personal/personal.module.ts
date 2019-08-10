import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalPage } from './personal.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PersonalRoutingModule
  ],
  declarations: [PersonalPage]
})
export class PersonalPageModule { }
