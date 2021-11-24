import { TestBed } from '@angular/core/testing';

import { GewinnService } from './gewinn.service';

describe('AdventDaysService', () => {
  let service: GewinnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GewinnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
