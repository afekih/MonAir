import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MapComponent} from './map.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MonAirService} from "../../shared/services/mon-air.service";
import {Observable} from "rxjs";

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  const monAirServiceMock: any = {
    getParamRanges(): Observable<any> {
      return new Observable<any>(sub => sub.next({}))
    },

    getParamUnit(): { [key: string]: string } {
      return {
        'temperature': '°C'
      }
    }

  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MapComponent],
      providers: [
        {provide: MonAirService, useValue: monAirServiceMock}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
