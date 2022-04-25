import {TestBed} from '@angular/core/testing';

import {MonAirService} from './mon-air.service';
import {Observable} from "rxjs";
import {AngularFireDatabase} from "@angular/fire/compat/database";

describe('MonAirService', () => {
  let service: MonAirService;
  let list: Record<string, number> = {'element1': 1, 'element2': 2};

  function recordsToSnapshotList(records: Record<string, number>) {
    return Object.keys(records).map(($key) => ({
      exists: true,
      val: () => records[$key],
      key: $key
    }));
  }

  const angularFireDBMock: any = {
    list: () => {
      return {
        snapshotChanges: () => new Observable((sub) => sub.next(
          recordsToSnapshotList(list)
        )),
        valueChanges: () => new Observable((sub) => sub.next(
          Object.values(list)
        ))
      }
    },
    object() {
      return {
        valueChanges: () => new Observable((sub) => sub.next(
          Object.values(list)[0]
        ))
      }
    }
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        // AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      providers: [
        {provide: AngularFireDatabase, useValue: angularFireDBMock}
      ]
    });
    service = TestBed.inject(MonAirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return observable of nodes list', ((done) => {
    service.getTotalNodesList().subscribe((data: any) => {
      expect(data).toEqual([1, 2])
      done();
    });
  }));

  it('should return observable of number of measures', ((done) => {
    service.getTotalNumberOfMeasures().subscribe((data: any) => {
      expect(data).toEqual(1);
      done();
    });
  }));

  it('should return the correct unit of the selected parameter', () => {
    let unit = service.getParamUnit('temperature');
    expect(unit).toEqual('°C');
  });


});
