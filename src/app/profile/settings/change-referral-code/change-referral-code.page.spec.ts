import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeReferralCodePage } from './change-referral-code.page';

describe('ChangeReferralCodePage', () => {
  let component: ChangeReferralCodePage;
  let fixture: ComponentFixture<ChangeReferralCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeReferralCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeReferralCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
