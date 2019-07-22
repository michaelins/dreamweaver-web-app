import { TestBed } from '@angular/core/testing';

import { ClockinRecordService } from './clockin-record.service';

describe('ClockinRecordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClockinRecordService = TestBed.get(ClockinRecordService);
    expect(service).toBeTruthy();
  });
});
