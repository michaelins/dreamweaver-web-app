import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetNicknamePage } from './reset-nickname.page';

describe('ResetNicknamePage', () => {
  let component: ResetNicknamePage;
  let fixture: ComponentFixture<ResetNicknamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetNicknamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetNicknamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
