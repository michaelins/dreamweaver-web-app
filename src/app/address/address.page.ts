import { Component, OnInit, Input } from '@angular/core';
import { from } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
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

  addresses: Address[];
  collectionOfAddresses: CollectionsOfAddress;
  addressPageSize = 10;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    console.log(this.isModal, this.product);
    this.addressService.getAddressList(1, this.addressPageSize).subscribe(resp => {
      console.log(resp);
      this.addresses = resp.content;
      this.collectionOfAddresses = resp;
    });
  }

  loadData(event) {
    if (this.collectionOfAddresses.last) {
      event.target.complete();
      event.target.disabled = true;
    } else if (this.collectionOfAddresses.number + 2 <= this.collectionOfAddresses.totalPages) {
      this.addressService.getAddressList(
        this.collectionOfAddresses.number + 2,
        this.addressPageSize,
      ).subscribe(resp => {
        console.log(resp);
        this.addresses.push(...resp.content);
        this.collectionOfAddresses = resp;
        event.target.complete();
      }, error => {
        console.log(error);
      });
    }
  }

  onDeleteAddress() {
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
      })
      // switchMap(data => {
      //   if (data && data.role === 'ok') {
      //     const checkedItems = this.cart.items.filter(item => {
      //       return item.checked === true;
      //     }).map<ShoppingCartItemRef>(item => {
      //       return {
      //         goodsId: item.goodsId,
      //         number: 0,
      //         specificationId: item.specificationId,
      //         warehouseId: item.warehouseId
      //       };
      //     });
      //     // console.log(checkedItems);
      //     return this.shoppingCartService.removeFromShoppingCart(checkedItems);
      //   }
      // })
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

  onOpenNewAddressModal() {
    this.modalCtrl.create({
      component: AddressDetailPage,
      componentProps: {
        isModal: true
      }
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(message => {
      console.log(message);
      // if (message.data && message.data.selectedSpec) {
      //   this.selectedSpec = message.data.selectedSpec;
      // }
      // if (message.data && message.data.selectedWarehouse) {
      //   this.selectedWarehouse = message.data.selectedWarehouse;
      // }
    });
  }

}
