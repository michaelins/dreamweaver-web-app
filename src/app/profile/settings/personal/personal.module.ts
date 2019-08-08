import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalPage } from './personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonalRoutingModule
  ],
  declarations: [PersonalPage]
})
export class PersonalPageModule { }
