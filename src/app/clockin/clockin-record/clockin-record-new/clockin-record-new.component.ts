import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { from } from 'rxjs';
import { concatMap, map, switchMap, toArray } from 'rxjs/operators';
import { OssService } from '../../../shared/oss.service';
import { ClockinRecordService } from '../clockin-record.service';

@Component({
  selector: 'app-clockin-record-new',
  templateUrl: './clockin-record-new.component.html',
  styleUrls: ['./clockin-record-new.component.scss'],
})
export class ClockinRecordNewComponent implements OnInit {

  @Input() files: FileList;
  @Input() base64Files: (string | ArrayBuffer)[] = [];
  intro = '';

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private ossService: OssService,
    private clockinRecordService: ClockinRecordService
  ) { }

  ngOnInit() {
    console.log(this.files);
    console.log(this.base64Files);
  }

  onDismiss() {
    this.modalCtrl.dismiss({
      refresh: false
    });
  }

  onSubmit() {
    this.loadingCtrl.create({
      message: '正在上传...',
      spinner: 'crescent'
    }).then(loading => {
      loading.present();
    });

    from(this.files).pipe(
      concatMap(file => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.ossService.uploadImage(formData);
      }),
      map(resp => {
        return resp.imgUrl;
      }),
      toArray(),
      switchMap(urls => {
        return this.clockinRecordService.createRecord(urls, this.intro);
      })
    ).subscribe(resp => {
      console.log(resp);
      this.loadingCtrl.dismiss();
      this.modalCtrl.dismiss();
    }, error => {
      alert(JSON.stringify(error));
      this.loadingCtrl.dismiss();

    }, () => {
      this.loadingCtrl.dismiss();
    });
  }
}
