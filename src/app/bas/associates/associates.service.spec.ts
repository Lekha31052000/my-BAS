import { TestBed } from '@angular/core/testing';

import { AssociatesService } from './associates.service';

describe('AssociatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssociatesService = TestBed.get(AssociatesService);
    expect(service).toBeTruthy();
  });
});
