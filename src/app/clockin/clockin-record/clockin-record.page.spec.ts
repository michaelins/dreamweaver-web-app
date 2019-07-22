import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockinRecordPage } from './clockin-record.page';

describe('ClockinRecordPage', () => {
  let component: ClockinRecordPage;
  let fixture: ComponentFixture<ClockinRecordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockinRecordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockinRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
