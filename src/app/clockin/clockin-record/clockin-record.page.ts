import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { switchMap, toArray, mergeMap, map } from 'rxjs/operators';
import { ClockinRecordNewComponent } from './clockin-record-new/clockin-record-new.component';
import { ClockinRecordService, CollectionOfRecord, Record } from './clockin-record.service';
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { OssService } from '../../shared/oss.service';

@Component({
  selector: 'app-clockin-record',
  templateUrl: './clockin-record.page.html',
  styleUrls: ['./clockin-record.page.scss'],
})
export class ClockinRecordPage implements OnInit, OnDestroy {

  @ViewChild('photoSwipe') photoSwipe: ElementRef;

  recordsSubscription: Subscription;
  records: Record[];
  collectionOfRecord: CollectionOfRecord = {};
  recordsPageSize = 10;
  equalObjs = [{ eqObj: 0, field: 'status' }];
  sortObjs = [{ direction: 0, field: 'createTime' }];

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private clockinRecordService: ClockinRecordService,
    private ossService: OssService
  ) { }

  ngOnInit() {
    this.recordsSubscription = this.clockinRecordService.recordsObs.subscribe(resp => {
      if (resp) {
        this.records = resp.content;
        this.collectionOfRecord = resp;
      }
    });
    this.clockinRecordService.getRecords(1, this.recordsPageSize, this.equalObjs, this.sortObjs).subscribe();
  }

  ngOnDestroy() {
    this.recordsSubscription.unsubscribe();
  }

  loadData(event) {
    if (this.collectionOfRecord.last) {
      event.target.complete();
      event.target.disabled = true;
    } else if (this.collectionOfRecord.number + 2 <= this.collectionOfRecord.totalPages) {
      this.clockinRecordService.getRecords(
        this.collectionOfRecord.number + 2,
        this.recordsPageSize,
        this.equalObjs,
        this.sortObjs,
        true
      ).subscribe(resp => {
        console.log(resp);
        this.records.push(...resp.content);
        this.collectionOfRecord = resp;
        event.target.complete();
      }, error => {
        console.log(error);
      });
    }
  }

  doRefresh(event?) {
    this.clockinRecordService.getRecords(1, this.recordsPageSize, this.equalObjs, this.sortObjs).subscribe(resp => {
      console.log(resp);
    }, error => {
      console.log(error);
    }, () => {
      if (event) {
        event.target.complete();
      }
    });
  }

  onAdd() {
  }

  openGallery(record: Record) {

    const options = {
      index: 0
    };

    from(this.loadingCtrl.create({
      message: '正在加载...',
      spinner: 'crescent'
    })).pipe(
      switchMap(loading => {
        return loading.present();
      }),
      switchMap(() => {
        return from(record.imgs);
      }),
      mergeMap(img => {
        return this.ossService.getImageInfo(img).pipe(
          map(info => {
            let width, height: number;
            if (info.ImageWidth.value >= info.ImageHeight.value) {
              if (info.ImageWidth.value <= 800) {
                width = info.ImageWidth.value;
                height = info.ImageHeight.value;
              } else {
                width = 800;
                height = info.ImageHeight.value / info.ImageWidth.value * 800;
              }
            } else {
              if (info.ImageHeight.value <= 800) {
                width = info.ImageWidth.value;
                height = info.ImageHeight.value;
              } else {
                height = 800;
                width = info.ImageWidth.value / info.ImageHeight.value * 800;
              }
            }
            return {
              src: `${img}?x-oss-process=image/resize,m_lfit,h_800,w_800`,
              msrc: `${img}?x-oss-process=image/resize,m_lfit,h_100,w_100`,
              w: Math.round(width),
              h: Math.round(height),
              title: record.intro
            };
          })
        );
      }),
      toArray()
    ).subscribe(resp => {
      console.log(resp);
      const gallery = new PhotoSwipe(this.photoSwipe.nativeElement, PhotoSwipeUI_Default, resp, options);
      gallery.init();
    }, error => {
      console.log(error);
      this.loadingCtrl.dismiss();
    }, () => {
      this.loadingCtrl.dismiss();
    });
  }

  preview(event) {
    const files = event.target.files as FileList;
    const base64Files: (string | ArrayBuffer)[] = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files.item(i));
      reader.onload = () => {
        base64Files.push(reader.result);
      };
    }

    from(this.modalCtrl.create({
      component: ClockinRecordNewComponent,
      componentProps: {
        base64Files,
        files
      }
    })).pipe(
      switchMap(modal => {
        modal.present();
        return modal.onDidDismiss();
      })
    ).subscribe();
  }
}
