import { Component, OnInit } from '@angular/core';
import { Record, ClockinRecordService } from './clockin-record/clockin-record.service';
import { ClockinService, BodyData } from './clockin.service';

@Component({
  selector: 'app-clockin',
  templateUrl: './clockin.page.html',
  styleUrls: ['./clockin.page.scss'],
})
export class ClockinPage implements OnInit {

  records: Record[];
  recordsPageSize = 1;
  equalObjs = [{ eqObj: 0, field: 'status' }];
  sortObjs = [{ direction: 0, field: 'createTime' }];
  totalDays: number;
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
    this.clockinRecordService.getRecords(1, this.recordsPageSize, this.equalObjs, this.sortObjs).subscribe(resp => {
      console.log(resp);
      this.records = resp.content;
    }, error => {
      console.log(error);
    });
    this.clockinService.getTotalDays().subscribe(resp => {
      console.log(resp);
      this.totalDays = resp.count;
    });
    this.clockinService.getBodyData().subscribe(bodyData => {
      console.log(bodyData);
      this.bodyData = bodyData;
    }, error => {
      console.log(error);
    });
  }

}
