import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
// import { jsCalendar } from 'simple-jscalendar';

@Component({
  selector: 'app-clockin-calendar',
  templateUrl: './clockin-calendar.page.html',
  styleUrls: ['./clockin-calendar.page.scss'],
})
export class ClockinCalendarPage implements OnInit {

  dateMulti: Date[];
  calendarOptions: CalendarComponentOptions;


  constructor() { }

  ngOnInit() {
    this.calendarOptions = {
      from: new Date(2018, 1, 1),
      to: 0,
      pickMode: 'multi',
      monthFormat: 'YYYY / MM',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      monthPickerFormat: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    const dates: Date[] = [];
    dates.push(new Date(2019, 6, 1));
    dates.push(new Date(2019, 6, 2));
    dates.push(new Date(2019, 6, 22));

    this.dateMulti = dates;
  }

  onChange($event) {
    console.log(this.dateMulti);
  }

}
