import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancePage } from './finance.page';

describe('FinancePage', () => {
  let component: FinancePage;
  let fixture: ComponentFixture<FinancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
