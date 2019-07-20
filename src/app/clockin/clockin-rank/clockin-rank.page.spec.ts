import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockinRankPage } from './clockin-rank.page';

describe('ClockinRankPage', () => {
  let component: ClockinRankPage;
  let fixture: ComponentFixture<ClockinRankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockinRankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockinRankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
