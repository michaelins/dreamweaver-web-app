import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDetailPage } from './address-detail.page';

describe('AddressDetailPage', () => {
  let component: AddressDetailPage;
  let fixture: ComponentFixture<AddressDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
