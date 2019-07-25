import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AddressService } from './address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    this.addressService.getAddressList(1, 10).subscribe(resp => {
      console.log(resp);
    });
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

}
