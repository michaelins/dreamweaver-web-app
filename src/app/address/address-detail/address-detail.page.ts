import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { text } from '@angular/core/src/render3';
import { from, fromEvent } from 'rxjs';
import { AddressService } from '../address.service';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { switchMap, tap } from 'rxjs/operators';
import { PickerColumnOption } from '@ionic/core';

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

  createDummyPickerColumnOptions(): PickerColumnOption[] {
    const columnOptions: PickerColumnOption[] = [];
    for (let index = 0; index < 100; index++) {
      columnOptions.push({
        text: '' + index,
        value: index
      });
    }
    return columnOptions;
  }

  onPickerSelected() {
    let addressPicker: HTMLIonPickerElement;
    this.addressService.generateColumns(null, null, null).pipe(
      switchMap(data => {
        return from(this.pickerCtrl.create({
          columns: data,
          cssClass: 'my-column',
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

            // console.log(data.name, data.options[data.selectedIndex]);
            // console.log(data.options[data.selectedIndex]);
            const provinceCode = picker.columns[0].options[picker.columns[0].selectedIndex].value;
            let cityCode = picker.columns[1].options[picker.columns[1].selectedIndex].value;
            let districtCode = picker.columns[2].options[picker.columns[2].selectedIndex].value;
            if (data.name === 'province') {
              cityCode = picker.columns[1].options[0].value;
              districtCode = picker.columns[2].options[0].value;
            } else if (data.name === 'city') {
              districtCode = picker.columns[2].options[0].value;
            }
            console.log(provinceCode, cityCode, districtCode);
            return this.addressService.generateColumns(
              provinceCode,
              cityCode,
              districtCode);
          })
        );
      })
    ).subscribe(columns => {
      // addressPicker.columns[1].options = this.createDummyPickerColumnOptions();
      // addressPicker.columns[2].options = this.createDummyPickerColumnOptions();
      addressPicker.columns = columns;
      console.log(addressPicker.columns);

      addressPicker.getColumn('city').then(column => {
        column.selectedIndex = 1;
        console.log(addressPicker.columns);
      });
    });
  }
}
