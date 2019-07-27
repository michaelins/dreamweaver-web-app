import { Component, OnInit, Input } from '@angular/core';
import { from } from 'rxjs';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AddressService, Address, CollectionsOfAddress } from './address.service';
import { Product } from '../product/product.service';
import { AddressDetailPage } from './address-detail/address-detail.page';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  @Input() isModal: boolean;
  @Input() product: Product;

  infiniteScrollDisabled = false;
  addresses: Address[];
  collectionOfAddresses: CollectionsOfAddress;
  addressPageSize = 10;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    console.log(this.isModal, this.product);
    this.addressService.latestAddresses.subscribe(addresses => {
      if (addresses) {
        console.log(addresses);
        this.addresses = addresses;
        this.infiniteScrollDisabled = false;
      }
    });
    this.addressService.fetchLatestAddresses().subscribe();
  }

  onDeleteAddress(addressId: string) {
    from(this.alertCtrl.create({
      message: '确定删除该收货地址吗？',
      buttons: [{
        text: '取消',
        role: 'cancel'
      }, {
        text: '确定',
        role: 'ok'
      }]
    })).pipe(
      switchMap(dialog => {
        dialog.present();
        return dialog.onDidDismiss();
      }),
      switchMap(data => {
        if (data && data.role === 'ok') {
          console.log('deleting address: ', addressId);
          return this.addressService.deleteAddress(addressId);
        }
      })
    ).subscribe(console.log, console.log);
  }

  onDismissModal() {
    if (this.isModal) {
      this.modalCtrl.dismiss({
        selectedAddress: null
      });
    }
  }

  onSelectAddress(address: Address) {
    if (this.isModal) {
      console.log(address);
      this.modalCtrl.dismiss({
        selectedAddress: address
      });
    }
  }

  onOpenDetailAddress(addressId?: string) {
    if (this.isModal) {
      this.modalCtrl.create({
        component: AddressDetailPage,
        componentProps: {
          isModal: true,
          addressId
        }
      }).then(modal => {
        modal.present();
        return modal.onDidDismiss();
      }).then(message => {
        console.log(message);
        if (message.data && message.data.savedAddress) {
          this.onSelectAddress(message.data.savedAddress);
        }
      });
    } else {
      const url = ['/address', 'detail'];
      if (addressId) {
        url.push(addressId);
      }
      this.navCtrl.navigateForward(url);
    }

  }

}
