import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { text } from '@angular/core/src/render3';
import { from, fromEvent } from 'rxjs';
import { AddressService } from '../address.service';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-address-detail',
  templateUrl: './address-detail.page.html',
  styleUrls: ['./address-detail.page.scss'],
})
export class AddressDetailPage implements OnInit {

  constructor(
    private pickerCtrl: PickerController,
    private addressService: AddressService,
    private shoppingCartService: ShoppingCartService
  ) { }

  ngOnInit() {
  }

  onPickerSelected() {
    let addressPicker: HTMLIonPickerElement;
    this.addressService.generateColumns(0).pipe(
      switchMap(data => {
        return from(this.pickerCtrl.create({
          columns: data,
          buttons: [
            {
              text: '取消',
              role: 'cancel',
              handler: val => {
                console.log(val);
              }
            },
            {
              text: '确认',
              role: 'ok',
              handler: val => {
                console.log(val);
              }
            }
          ]
        }));
      }),
      switchMap(picker => {
        addressPicker = picker;
        picker.present();
        return fromEvent<CustomEvent>(picker, 'ionPickerColChange').pipe(
          switchMap(event => {

            const data = event.detail;

            const colSelectedIndex = data.selectedIndex;
            const colOptions = data.options;

            console.log(colSelectedIndex, colOptions);
            return this.addressService.generateColumns(colSelectedIndex);
          })
        );
      })
    ).subscribe(columns => {
      console.log(columns);
      console.log(addressPicker.columns);
      addressPicker.columns = columns;
    });
  }
}
