import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DashboardComponent} from './dashboard.component';
import {MonAirService} from "../../shared/services/mon-air.service";
import {Observable} from "rxjs";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDividerModule} from "@angular/material/divider";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  // const measure: any = {
  //   'measure1': {
  //     'temperature': 20,
  //     'humidity': 60
  //   }
  // }
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
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatTableModule,
        MatProgressBarModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatDividerModule
      ],
      declarations: [DashboardComponent],
      providers: [
        {provide: MonAirService, useValue: monAirServiceMock}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    // service = de.injector.get(MonAirService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get list of measures per month', () => {
    let spy = spyOn(monAirServiceMock, 'getMeasuresPerMonth').and.callThrough();
    component.getMeasuresPerMonth('2019');
    expect(spy).toHaveBeenCalled();
    expect(Object.keys(component.yearlyNodeIDsList).length).toBeGreaterThan(0);
    expect(component.yearlyNodesNumber).toBeGreaterThan(0);
  });

  it('should get list of nodes', () => {
    let spy = spyOn(monAirServiceMock, 'getTotalNodesList').and.callThrough();
    component.getTotalNumberOfMeasures();
    expect(spy).toHaveBeenCalled();
    expect(component.nodesList).toBeDefined();
  });

  it('should get the yearly number of measures', () => {
    let spy = spyOn(monAirServiceMock, 'getMeasuresPerMonth').and.callThrough();
    component.getMeasuresPerMonth('2019');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.yearlyNumberOfMeasures).toEqual(15);
  });

  it('should get total number of measures', () => {
    let spy = spyOn(monAirServiceMock, 'getTotalNumberOfMeasures').and.callThrough();
    component.getTotalNumberOfMeasures();
    expect(spy).toHaveBeenCalled();
    expect(component.totalNumberOfMeasures).toEqual(20);
  });


});
