import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationPage } from './identification.page';

describe('IdentificationPage', () => {
  let component: IdentificationPage;
  let fixture: ComponentFixture<IdentificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
