import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, PickerController } from '@ionic/angular';
import { from, fromEvent, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Address, AddressReqItem, AddressService } from '../address.service';

@Component({
  selector: 'app-address-detail',
  templateUrl: './address-detail.page.html',
  styleUrls: ['./address-detail.page.scss'],
})
export class AddressDetailPage implements OnInit {

  @Input() isModal: boolean;
  @Input() addressId: string;

  form: FormGroup;
  addressReqObj: AddressReqItem;
  addressName: string;
  addressCode: string;
  address: Address;
  editMode = false;

  constructor(
    private pickerCtrl: PickerController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
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
        validators: [Validators.required, Validators.minLength(11), Validators.maxLength(11)]
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

    if (this.isModal) {
      if (this.addressId) {
        this.editMode = true;
        this.addressService.getAddress(this.addressId).subscribe(resp => {
          this.loadAddress(resp);
        }, error => {
          console.log(error);
          this.form.patchValue({
            isDefault: false
          });
        });
      } else {
        this.editMode = false;
      }
    } else {
      this.route.params.pipe(switchMap(params => {
        if (params.addressId) {
          this.editMode = true;
          console.log(params.addressId);
          return this.addressService.getAddress(params.addressId);
        } else {
          this.editMode = false;
          throw new Error('no address id');
        }
      })).subscribe(resp => {
        this.loadAddress(resp);
      }, error => {
        console.log(error);
        this.form.patchValue({
          isDefault: false
        });
      });
    }

  }

  loadAddress(loadedAddress: Address) {
    console.log(loadedAddress);
    this.address = loadedAddress;
    this.addressCode = loadedAddress.addressCode;
    this.addressName = loadedAddress.addressName;
    this.form.patchValue({
      consignee: loadedAddress.consignee,
      phoneNo: loadedAddress.phoneNo,
      detailedAddress: loadedAddress.detailedAddress,
      isDefault: loadedAddress.isDefault
    });
    if (loadedAddress.identificationName) {
      this.form.patchValue({
        identificationName: loadedAddress.identificationName
      });
    }
    if (loadedAddress.identificationNumber) {
      this.form.patchValue({
        identificationNumber: loadedAddress.identificationNumber
      });
    }
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
      this.address.addressCode = this.addressCode;
      this.address.addressName = this.addressName;
      this.address.consignee = this.form.value.consignee;
      this.address.detailedAddress = this.form.value.detailedAddress;
      this.address.phoneNo = this.form.value.phoneNo;
      if (this.form.value.identificationName) {
        this.address.identificationName = this.form.value.identificationName;
      }
      if (this.form.value.identificationNumber) {
        this.address.identificationNumber = this.form.value.identificationNumber;
      }
      if (this.form.value.isDefault) {
        this.address.isDefault = this.form.value.isDefault;
      }
      addressReq.addressId = this.address.addressId;
      this.addressService.modifyAddress(addressReq).subscribe(resp => {
        console.log(this.address);
        this.navBack(this.address);
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.alertCtrl.create({
            header: '修改地址失败',
            message: error.error.message,
            buttons: ['确定']
          }).then(alert => {
            alert.present();
          });
        }
      });
    } else {
      this.addressService.addAddress(addressReq).subscribe(addedAddress => {
        console.log(addedAddress);
        this.navBack(addedAddress);
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.alertCtrl.create({
            header: '新建地址失败',
            message: error.error.message,
            buttons: ['确定']
          }).then(alert => {
            alert.present();
          });
        }
      });
    }
    console.log(addressReq);
  }

  onDismissModal() {
    if (this.isModal) {
      this.modalCtrl.dismiss({
        selectedAddress: null
      });
    }
  }

  navBack(address: Address) {
    this.addressService.fetchLatestAddresses().subscribe(() => {
      if (this.isModal) {
        this.modalCtrl.dismiss({
          savedAddress: address
        });
      } else {
        this.navCtrl.pop();
      }
    });
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
