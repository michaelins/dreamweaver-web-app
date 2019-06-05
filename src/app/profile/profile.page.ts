import { Component, OnInit } from '@angular/core';
import { PickerService } from 'ng-zorro-antd-mobile';
import { UiStateService } from '../shared/ui-state.service';
import { ModalController, PickerController } from '@ionic/angular';
import { LoginComponent } from '../shared/login/login.component';
// import { district, provinceLite } from 'antd-mobile-demo-data';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // data = district;
  // asynData = provinceLite;
  delayData = [];
  singleArea = [
    '东城区',
    '西城区',
    '崇文区',
    '宣武区',
    '朝阳区',
    '丰台区',
    '石景山区',
    '海淀区',
    '门头沟区',
    '房山区',
    '通州区',
    '顺义区',
    '昌平区',
    '大兴区',
    '平谷区',
    '怀柔区',
    '密云县',
    '延庆县'
  ];
  seasons = [
    {
      label: '2013',
      children: [
        {
          label: '春',
          children: []
        },
        {
          label: '夏',
          children: []
        }
      ]
    },
    {
      label: '2014',
      children: [
        {
          label: '春'
        },
        {
          label: '夏'
        }
      ]
    }
  ];
  name = '选择';
  name1 = '选择';
  name2 = '选择';
  name3 = '选择';
  name4 = '选择';
  value = [];
  value1 = [];
  value2 = [];
  value3 = [];
  value4 = [];
  cols = 1;

  constructor(
    private uiStateService: UiStateService,
    private modalCtrl: ModalController,
    private pickerCtrl: PickerController,
    private picker: PickerService) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.uiStateService.setTabBarHidden(false);
    console.log('ionViewWillEnter');
  }

  ionViewWillLeave() {
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  onClick() {
    this.modalCtrl.create({
      component: LoginComponent
    }).then(modal => {
      modal.present();
    });
  }

  onSelect() {
    PickerService.showPicker(
      { value: this.value, data: this.singleArea },
      result => {
        console.log(result);
      },
      cancel => {
        console.log('cancel');

      }
    );

    // this.pickerCtrl.create({
    //   buttons: [
    //     {
    //       text: '确定'
    //     },
    //     {
    //       text: '取消'
    //     }
    //   ],
    //   columns: [
    //     {
    //       name: '省',
    //       options: [
    //         {
    //           text: '四川',
    //           value: 'bj'
    //         },
    //         {
    //           text: '山西',
    //           value: 'sh'
    //         }
    //       ]
    //     },
    //     {
    //       name: '市',
    //       options: [
    //         {
    //           text: '北京1',
    //           value: 'bj'
    //         },
    //         {
    //           text: '上海2',
    //           value: 'sh'
    //         }
    //       ]
    //     }
    //   ]
    // }).then(picker => (
    //   // picker.present()
    // ));
  }

  onDismiss1() {
    console.log('cancel');
  }

  onOk1(result) {
    this.name1 = this.getResult(result);
  }

  onOk2(result) {
    this.name2 = this.getResult(result);
  }

  onOk3(result) {
    this.name3 = this.getResult(result);
  }

  onOk4(result) {
    this.name4 = this.getResult(result);
  }

  // onPickerChange(result) {
  //   const val = this.getValue(result);
  //   console.log(val);
  //   let colNum = 1;
  //   const d = [...this.asynData];
  //   const asyncValue = [...val];
  //   if (val[0] === 'zj') {
  //     d.forEach((i) => {
  //       if (i.value === 'zj') {
  //         colNum = 2;
  //         if (!i.children) {
  //           i.children = [{
  //             value: 'zj-nb',
  //             label: '宁波',
  //           }, {
  //             value: 'zj-hz',
  //             label: '杭州',
  //           }];
  //           asyncValue.push('zj-nb');
  //         } else if (val[1] === 'zj-hz') {
  //           i.children.forEach((j) => {
  //             if (j.value === 'zj-hz') {
  //               j.children = [{
  //                 value: 'zj-hz-xh',
  //                 label: '西湖区',
  //               }];
  //               asyncValue.push('zj-hz-xh');
  //             }
  //           });
  //           colNum = 3;
  //         }
  //       }
  //     });
  //   } else {
  //     colNum = 1;
  //   }
  //   this.asynData = d;
  //   this.cols = colNum;
  //   this.value4 = asyncValue;
  // }

  getResult(result) {
    this.value = [];
    let temp = '';
    result.forEach(item => {
      this.value.push(item.label || item);
      temp += item.label || item;
    });
    return this.value.map(v => v).join(',');
  }

  getValue(result) {
    let value = [];
    let temp = '';
    result.forEach(item => {
      value.push(item.value || item);
      temp += item.value || item;
    });
    return value;
  }

  showPicker() {
    PickerService.showPicker(
      { value: this.value, data: this.singleArea },
      result => {
        this.name = this.getResult(result);
        this.value = this.getValue(result);
      },
      cancel => {
        console.log('cancel');

      }
    );
  }
}
