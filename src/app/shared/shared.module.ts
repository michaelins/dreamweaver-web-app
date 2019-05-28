import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login/login.component';
import { IonicPropertyDirective } from './directives/ionic-property.directive';

@NgModule({
  declarations: [
    LoginComponent,
    IonicPropertyDirective
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    LoginComponent,
    IonicPropertyDirective
  ]
})
export class SharedModule { }
