import { TestBed } from '@angular/core/testing';

import { MonAirService } from './mon-air.service';

describe('MonAirService', () => {
  let service: MonAirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonAirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
