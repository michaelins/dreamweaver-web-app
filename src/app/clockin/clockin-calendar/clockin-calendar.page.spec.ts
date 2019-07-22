import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockinCalendarPage } from './clockin-calendar.page';

describe('ClockinCalendarPage', () => {
  let component: ClockinCalendarPage;
  let fixture: ComponentFixture<ClockinCalendarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockinCalendarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockinCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
