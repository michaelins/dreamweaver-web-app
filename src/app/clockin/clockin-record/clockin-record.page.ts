import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ClockinRecordNewComponent } from './clockin-record-new/clockin-record-new.component';
import { ClockinRecordService, CollectionOfRecord, Record } from './clockin-record.service';

@Component({
  selector: 'app-clockin-record',
  templateUrl: './clockin-record.page.html',
  styleUrls: ['./clockin-record.page.scss'],
})
export class ClockinRecordPage implements OnInit {


  records: Record[];
  collectionOfRecord: CollectionOfRecord = {};
  recordsPageSize = 10;
  equalObjs = [{ eqObj: 0, field: 'status' }];
  sortObjs = [{ direction: 0, field: 'createTime' }];

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private clockinRecordService: ClockinRecordService
  ) { }

  ngOnInit() {
    this.clockinRecordService.getRecords(1, this.recordsPageSize, this.equalObjs, this.sortObjs).subscribe(resp => {
      console.log(resp);
      this.records = resp.content;
      this.collectionOfRecord = resp;
    }, error => {
      console.log(error);
    });
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
        this.sortObjs
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
      this.records = resp.content;
      this.collectionOfRecord = resp;
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
    ).subscribe(data => {
      console.log(data.data.refresh);
      if (data.data.refresh) {
        this.doRefresh();
      }
    }, console.log);
  }
}
