import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerColumnOption, PickerColumn } from '@ionic/core';
import { from, fromEvent, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { AddressReqItem, AddressService, Address } from '../address.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address-detail',
  templateUrl: './address-detail.page.html',
  styleUrls: ['./address-detail.page.scss'],
})
export class AddressDetailPage implements OnInit {

  form: FormGroup;
  addressReqObj: AddressReqItem;
  addressName: string;
  addressCode: string;
  address: Address;

  constructor(
    private pickerCtrl: PickerController,
    private route: ActivatedRoute,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      consignee: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      phoneNo: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(11)]
      }),
      detailedAddress: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      isDefault: new FormControl(null, {
        updateOn: 'change'
      }),
      identificationName: new FormControl(null, {
        updateOn: 'change'
      }),
      identificationNumber: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.maxLength(18)]
      }),
    });


    this.route.params.pipe(switchMap(params => {
      if (params.addressId) {
        console.log(params.addressId);
        return this.addressService.getAddress(params.addressId);
      } else {
        throw new Error('no address id');
      }
    })).subscribe(resp => {
      console.log(resp);
      this.address = resp;
      this.addressCode = resp.addressCode;
      this.addressName = resp.addressName;
      this.form.patchValue({
        consignee: resp.consignee,
        phoneNo: resp.phoneNo,
        detailedAddress: resp.detailedAddress,
        isDefault: resp.isDefault
      });
      if (resp.identificationName) {
        this.form.patchValue({
          identificationName: resp.identificationName
        });
      }
      if (resp.identificationNumber) {
        this.form.patchValue({
          identificationNumber: resp.identificationNumber
        });
      }
    }, error => {
      console.log(error);
      this.form.patchValue({
        isDefault: false
      });
    });
  }

  onSubmit() {
    if (!this.form.valid || !this.addressCode) {
      return;
    }
    const addressReq: AddressReqItem = {
      addressCode: this.addressCode,
      addressName: this.addressName,
      consignee: this.form.value.consignee,
      detailedAddress: this.form.value.detailedAddress,
      phoneNo: this.form.value.phoneNo
    };
    if (this.form.value.identificationName) {
      addressReq.identificationName = this.form.value.identificationName;
    }
    if (this.form.value.identificationNumber) {
      addressReq.identificationNumber = this.form.value.identificationNumber;
    }
    if (this.form.value.isDefault) {
      addressReq.isDefault = this.form.value.isDefault;
    }
    if (this.address && this.address.addressId) {
      addressReq.addressId = this.address.addressId;
      this.addressService.modifyAddress(addressReq).subscribe(resp => {
        console.log(resp);
        this.navBack();
      }, error => console.log);
    } else {
      this.addressService.addAddress(addressReq).subscribe(resp => {
        console.log(resp);
        this.navBack();
      }, error => console.log);
    }
    console.log(addressReq);
  }

  navBack() {

  }

  onPickerSelected() {
    let addressPicker: HTMLIonPickerElement;
    const addressCodes = this.addressService.getAddressCode(this.addressCode);
    this.addressService.generateColumns(addressCodes.provinceCode, addressCodes.cityCode, addressCodes.districtCode).pipe(
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
                this.addressName = '中国||' + val.province.text +
                  '||' + (val.city ? val.city.text : ' ') +
                  '||' + (val.district ? val.district.text : ' ');
                this.addressCode = 'CN||' + val.province.value +
                  '||' + (val.city ? val.city.value : 'null') +
                  '||' + (val.district ? val.district.value : 'null');
              }
            }
          ]
        }));
      }),
      switchMap(picker => {
        const obs = fromEvent<CustomEvent>(picker, 'ionPickerColChange').pipe(
          switchMap(event => {

            const data = event.detail;

            const colSelectedIndex = data.selectedIndex;
            const colOptions = data.options;

            // console.log(data.name, data.options[data.selectedIndex]);
            // console.log(data.options[data.selectedIndex]);
            const provinceCode = picker.columns[0].options[picker.columns[0].selectedIndex].value;
            let cityCode = picker.columns[1] ? picker.columns[1].options[picker.columns[1].selectedIndex].value : null;
            let districtCode = picker.columns[2] ? picker.columns[2].options[picker.columns[2].selectedIndex].value : null;
            if (data.name === 'province') {
              // cityCode = picker.columns[1].options[0].value;
              // districtCode = picker.columns[2].options[0].value;
              cityCode = null;
              districtCode = null;
              picker.columns = [JSON.parse(JSON.stringify(picker.columns[0]))];
            } else if (data.name === 'city') {
              // districtCode = picker.columns[2].options[0].value;
              districtCode = null;
              picker.columns = [JSON.parse(JSON.stringify(picker.columns[0])), JSON.parse(JSON.stringify(picker.columns[1]))];
            } else {
              return of(null);
            }
            console.log(provinceCode, cityCode, districtCode);
            return this.addressService.generateColumns(
              provinceCode,
              cityCode,
              districtCode);
          })
        );
        addressPicker = picker;
        picker.present();
        return obs;
      })
    ).subscribe(columns => {
      console.log(columns);
      if (columns) {
        addressPicker.columns = columns;
      }
    });
  }
}
