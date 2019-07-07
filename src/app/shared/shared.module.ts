import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login/login.component';
import { IonicPropertyDirective } from './directives/ionic-property.directive';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';

@NgModule({
  declarations: [
    LoginComponent,
    AddToCartComponent,
    IonicPropertyDirective
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    LoginComponent,
    AddToCartComponent,
    IonicPropertyDirective
  ]
})
export class SharedModule { }
