import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { from } from 'rxjs';
import { concatMap, map, switchMap, toArray } from 'rxjs/operators';
import { OssService } from '../../../shared/oss.service';
import { ClockinRecordService } from '../clockin-record.service';
import Compressor from 'compressorjs';

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
      switchMap(file => {
        return from(new Promise<Blob>((resolve, reject) => {
          const compresser = new Compressor(file, {
            success: resolve,
            error: reject,
            maxHeight: 800,
            maxWidth: 800,
            quality: 0.8,
            convertSize: 2000000
          });
        })).pipe(
          map(result => {
            console.log(result);
            return { result, file };
          })
        );
      }),
      concatMap(result => {
        console.log(result);

        // const compresser = new Compressor(this.files[0], {
        //   quality: 0.6,
        //   success(result) {
        //     const formData1 = new FormData();

        //     // The third parameter is required for server
        //     formData1.append('file', result, result.name);

        //     // Send the compressed image file to server with XMLHttpRequest.
        //     axios.post('/path/to/upload', formData).then(() => {
        //       console.log('Upload success');
        //     });
        //   },
        //   error(err) {
        //     console.log(err.message);
        //   },
        // });

        const formData = new FormData();
        formData.append('file', result.result, result.file.name);
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
