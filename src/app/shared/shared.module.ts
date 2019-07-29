import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { IonicPropertyDirective } from './directives/ionic-property.directive';
import { LoginComponent } from './login/login.component';
import { AddressDisplayPipe } from './pipes/address-display.pipe';
import { HidePhoneNumberPipe } from './pipes/hide-phone-number.pipe';

@NgModule({
  declarations: [
    LoginComponent,
    AddToCartComponent,
    IonicPropertyDirective,
    AddressDisplayPipe,
    HidePhoneNumberPipe
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    LoginComponent,
    AddToCartComponent,
    IonicPropertyDirective,
    AddressDisplayPipe,
    HidePhoneNumberPipe
  ]
})
export class SharedModule { }
