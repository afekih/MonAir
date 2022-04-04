import { TestBed } from '@angular/core/testing';

import { MonAirService } from './mon-air.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AngularFireModule} from "@angular/fire/compat";

describe('MonAirService', () => {
  let service: MonAirService;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularFireModule],
    });
    service = TestBed.inject(MonAirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
