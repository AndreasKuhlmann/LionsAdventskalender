import { TestBed } from '@angular/core/testing';

import { AdventDaysService } from './advent-days.service';

describe('AdventDaysService', () => {
  let service: AdventDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdventDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
