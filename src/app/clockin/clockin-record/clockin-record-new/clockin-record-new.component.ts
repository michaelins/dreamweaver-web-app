import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { from, of } from 'rxjs';
import { concatMap, mergeAll, toArray, map, switchMap } from 'rxjs/operators';
import { UiStateService } from 'src/app/shared/ui-state.service';
import { OssService } from 'src/app/shared/oss.service';
import { FormGroup } from '@angular/forms';
import { ClockinRecordService } from '../clockin-record.service';

@Component({
  selector: 'app-clockin-record-new',
  templateUrl: './clockin-record-new.component.html',
  styleUrls: ['./clockin-record-new.component.scss'],
})
export class ClockinRecordNewComponent implements OnInit {

  @Input() files: FileList;
  @Input() base64Files: (string | ArrayBuffer)[] = [];
  intro: string;

  constructor(
    private modalCtrl: ModalController,
    private uiService: UiStateService,
    private ossService: OssService,
    private clockinRecordService: ClockinRecordService
  ) { }

  ngOnInit() {
    console.log(this.files);
    console.log(this.base64Files);
  }

  onDismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  onSubmit() {
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
    });
  }
}
