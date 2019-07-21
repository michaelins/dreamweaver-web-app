import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockinRecordNewComponent } from './clockin-record-new.component';

describe('ClockinRecordNewComponent', () => {
  let component: ClockinRecordNewComponent;
  let fixture: ComponentFixture<ClockinRecordNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockinRecordNewComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockinRecordNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
