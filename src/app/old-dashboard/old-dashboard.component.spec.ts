import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldDashboardComponent } from './old-dashboard.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('OldDashboardComponent', () => {
  let component: OldDashboardComponent;
  let fixture: ComponentFixture<OldDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OldDashboardComponent ]
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
