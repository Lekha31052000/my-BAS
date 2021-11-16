import { TestBed } from '@angular/core/testing';

import { AppCommonService } from './app-common.service';

describe('AppCommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppCommonService = TestBed.get(AppCommonService);
    expect(service).toBeTruthy();
  });
});
