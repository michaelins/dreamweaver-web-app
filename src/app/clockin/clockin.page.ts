import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClockinRecordService, Record } from './clockin-record/clockin-record.service';
import { BodyData, ClockinService } from './clockin.service';

@Component({
  selector: 'app-clockin',
  templateUrl: './clockin.page.html',
  styleUrls: ['./clockin.page.scss'],
})
export class ClockinPage implements OnInit, OnDestroy {

  recordsSubscription: Subscription;
  records: Record[];
  recordsPageSize = 1;
  equalObjs = [{ eqObj: 0, field: 'status' }];
  sortObjs = [{ direction: 0, field: 'createTime' }];
  totalDays: number;
  totalDaysSubscription: Subscription;
  bodyDataSubscription: Subscription;
  bodyData: BodyData;
  slideOpts = {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 3000,
    },
    lazy: true
  };

  constructor(
    private clockinRecordService: ClockinRecordService,
    private clockinService: ClockinService
  ) { }

  ngOnInit() {
    this.recordsSubscription = this.clockinRecordService.recordsObs.subscribe(resp => {
      if (resp) {
        this.records = resp.content;
      }
    });
    this.totalDaysSubscription = this.clockinService.totalDaysObs.subscribe(resp => {
      if (resp) {
        this.totalDays = resp.count;
      }
    });
    this.bodyDataSubscription = this.clockinService.bodyDataObs.subscribe(resp => {
      this.bodyData = resp;
    });
    this.clockinService.getTotalDays().subscribe();
    this.clockinRecordService.getRecords(1, this.recordsPageSize, this.equalObjs, this.sortObjs).subscribe();
    this.clockinService.getBodyData().subscribe();
  }

  ngOnDestroy() {
    this.bodyDataSubscription.unsubscribe();
    this.recordsSubscription.unsubscribe();
    this.totalDaysSubscription.unsubscribe();
  }
}
