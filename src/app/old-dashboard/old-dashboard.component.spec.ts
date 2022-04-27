import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldDashboardComponent } from './old-dashboard.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Observable} from "rxjs";
import {MonAirService} from "../shared/services/mon-air.service";

describe('OldDashboardComponent', () => {
  let component: OldDashboardComponent;
  let fixture: ComponentFixture<OldDashboardComponent>;

  const nodesList: any = [
    {
      'nodeId': 1,
      'node_eui': '1234',
      'measures_count': 3,
      'last_seen': "2021-10-18T09:13:59.000Z"
    },
    {
      'nodeId': 2,
      'node_eui': '2345',
      'measures_count': 10,
      'last_seen': "2021-10-18T09:13:59.000Z"
    }
  ]
  const stats: any = {
    measures_count: 20,
    measures_per_year: {
      '2019': {
        "monthly_stats": [
          10,
          5
        ],
        "nodes": [
          11,
          4
        ]
      },
      '2020': {
        "monthly_stats": [
          5
        ],
        "nodes": [
          1,
          3,
          1
        ]
      }
    }
  }
  const monAirServiceMock: any = {
    getMeasuresPerMonth(year: string): Observable<any> {
      return new Observable(sub => sub.next(stats['measures_per_year'][year]));
    },

    getTotalNodesList(): Observable<any[]> {
      return new Observable<any[]>(sub => {
        sub.next(nodesList)
      })
    },

    getTotalNumberOfMeasures(): Observable<any> {
      return new Observable<any>(sub => sub.next(stats));
    }

  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OldDashboardComponent ],
      providers: [
        {provide: MonAirService, useValue: monAirServiceMock}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
