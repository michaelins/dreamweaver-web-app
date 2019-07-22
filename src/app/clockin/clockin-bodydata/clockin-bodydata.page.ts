import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BodyData, ClockinService } from '../clockin.service';

export enum BodyDataType {
  Weight,
  Height,
  Circumference,
  Hipline,
  Waistline,
}

@Component({
  selector: 'app-clockin-bodydata',
  templateUrl: './clockin-bodydata.page.html',
  styleUrls: ['./clockin-bodydata.page.scss'],
})
export class ClockinBodydataPage implements OnInit {

  BodyDataType = BodyDataType;
  bodyData: BodyData = {
    height: null,
    weight: null,
    circumference: null,
    waistline: null,
    hipline: null
  };

  constructor(
    private alertCtrl: AlertController,
    private clockinService: ClockinService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.clockinService.getBodyData().subscribe(bodyData => {
      console.log(bodyData);
      this.bodyData = bodyData;
    }, error => {
      console.log(error);
    });
  }

  onClick(dataType: BodyDataType) {
    let labelName: string;
    switch (dataType) {
      case BodyDataType.Height:
        labelName = '身高';
        break;
      case BodyDataType.Weight:
        labelName = '体重';
        break;
      case BodyDataType.Circumference:
        labelName = '胸围';
        break;
      case BodyDataType.Waistline:
        labelName = '腰围';
        break;
      case BodyDataType.Hipline:
        labelName = '臀围';
        break;
      default:
        break;
    }

    from(this.alertCtrl.create({
      header: '编辑身体数据',
      message: '请输入当前' + labelName,
      inputs: [{
        name: 'data',
        type: 'number',
        placeholder: '请输入当前' + labelName
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
    ).subscribe(data => {
      // console.log(data.data.values.data);
      switch (dataType) {
        case BodyDataType.Height:
          this.bodyData.height = data.data.values.data;
          break;
        case BodyDataType.Weight:
          this.bodyData.weight = data.data.values.data;
          break;
        case BodyDataType.Circumference:
          this.bodyData.circumference = data.data.values.data;
          break;
        case BodyDataType.Waistline:
          this.bodyData.waistline = data.data.values.data;
          break;
        case BodyDataType.Hipline:
          this.bodyData.hipline = data.data.values.data;
          break;
        default:
          break;
      }

      console.log(this.bodyData);

    }, console.log);
  }

  onSubmit() {
    if (this.bodyData.weight && this.bodyData.height && this.bodyData.circumference && this.bodyData.waistline && this.bodyData.hipline) {
      this.clockinService.saveBodyData(
        this.bodyData.height,
        this.bodyData.weight,
        this.bodyData.circumference,
        this.bodyData.waistline,
        this.bodyData.hipline).subscribe(resp => {
          console.log(resp);
          this.navCtrl.pop();
        }, error => {
          console.log(error);
        });
    } else {
      from(this.alertCtrl.create({
        header: '身体数据不完整',
        message: '请填入所有的身体数据',
        buttons: [{
          text: '确定',
          role: 'ok'
        }]
      })).pipe(
        switchMap(dialog => {
          dialog.present();
          return dialog.onDidDismiss();
        })
      ).subscribe(data => {
        console.log(data);
      }, console.log);
    }
  }
}
