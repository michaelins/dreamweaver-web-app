import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCompletePage } from './register-complete.page';

describe('RegisterCompletePage', () => {
  let component: RegisterCompletePage;
  let fixture: ComponentFixture<RegisterCompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterCompletePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
