import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { ClockinService } from '../clockin.service';
import { switchMap, map } from 'rxjs/operators';
// import { jsCalendar } from 'simple-jscalendar';

@Component({
  selector: 'app-clockin-calendar',
  templateUrl: './clockin-calendar.page.html',
  styleUrls: ['./clockin-calendar.page.scss'],
})
export class ClockinCalendarPage implements OnInit {

  dateMulti: Date[];
  calendarOptions: CalendarComponentOptions;
  totalDays: number;
  continuousDays: number;
  equalObjs = [{ eqObj: 0, field: 'status' }];
  sortObjs = [{ direction: 0, field: 'day' }];

  constructor(
    private clockinService: ClockinService
  ) { }

  ngOnInit() {
    this.clockinService.getTotalDays().pipe(
      switchMap(days => {
        this.totalDays = days.count;
        return this.clockinService.getContinuousDays();
      }),
      switchMap(days => {
        this.continuousDays = days.count;
        return this.clockinService.getHistory(1, 100, this.equalObjs, this.sortObjs);
      }),
      map(resp => {
        if (resp.content && resp.content.length > 0) {
          return resp.content.map(item => {
            return new Date(item.day);
          });
        } else {
          return [] as Date[];
        }
      })
    ).subscribe(resp => {
      this.calendarOptions = {
        from: new Date(2018, 1, 1),
        to: 0,
        pickMode: 'multi',
        monthFormat: 'YYYY / MM',
        weekdays: ['日', '一', '二', '三', '四', '五', '六'],
        monthPickerFormat: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      };
      const dates: Date[] = [...resp];
      // dates.push(new Date(2019, 6, 1));
      // dates.push(new Date(2019, 6, 2));
      console.log(dates);
      this.dateMulti = dates;
    });
  }

  onChange($event) {
    console.log(this.dateMulti);
  }

}
