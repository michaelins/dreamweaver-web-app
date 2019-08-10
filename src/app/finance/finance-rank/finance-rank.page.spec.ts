import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceRankPage } from './finance-rank.page';

describe('FinanceRankPage', () => {
  let component: FinanceRankPage;
  let fixture: ComponentFixture<FinanceRankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceRankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceRankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
