import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockinBodydataPage } from './clockin-bodydata.page';

describe('ClockinBodydataPage', () => {
  let component: ClockinBodydataPage;
  let fixture: ComponentFixture<ClockinBodydataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockinBodydataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockinBodydataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
