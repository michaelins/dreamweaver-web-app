import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchRoutingModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule { }
