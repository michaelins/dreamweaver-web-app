import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-clockin-bodydata',
  templateUrl: './clockin-bodydata.page.html',
  styleUrls: ['./clockin-bodydata.page.scss'],
})
export class ClockinBodydataPage implements OnInit {

  constructor(
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  onClick() {
    from(this.alertCtrl.create({
      header: '编辑身体数据',
      message: '请输入当前体重',
      inputs: [{
        name: 'data',
        type: 'number',
        placeholder: '请输入当前体重'
      }],
      buttons: [{
        text: '取消',
        role: 'cancel'
      }, {
        text: '保存',
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
