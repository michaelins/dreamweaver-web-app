import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralInputPage } from './referral-input.page';

describe('ReferralInputPage', () => {
  let component: ReferralInputPage;
  let fixture: ComponentFixture<ReferralInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
