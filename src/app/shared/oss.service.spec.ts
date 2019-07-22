import { TestBed } from '@angular/core/testing';

import { OssService } from './oss.service';

describe('OssService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OssService = TestBed.get(OssService);
    expect(service).toBeTruthy();
  });
});
