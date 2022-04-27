import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopBarComponent} from './top-bar.component';
import {AuthService} from "../../shared/services/auth.service";
import {Location} from "@angular/common";

describe('TopbarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  const authServiceMock = jasmine.createSpyObj('AuthService', ['signOut']);
  const locationMock = jasmine.createSpyObj('Location', ['prepareExternalUrl', 'path'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarComponent],
      providers: [
        {provide: AuthService, useValue: authServiceMock},
        {provide: Location, useValue: locationMock}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    authServiceMock.signOut.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call signOut() of AuthService', () => {
    authServiceMock.signOut.and.callThrough();
    component.signOut();
    expect(authServiceMock.signOut).toHaveBeenCalledTimes(1)
  });

  it('should return \'Dashboard\' if an unknown path is provided', () => {
    locationMock.prepareExternalUrl.and.returnValue('/url')
    component.listTitles = [
      {path: '/test', title: 'Test', icon: ['fas','tv'], class: ''},
    ];
    expect(component.getTitle()).toEqual('Dashboard');
  });

  it('should return the correct title if a known path is provided', () => {
    locationMock.prepareExternalUrl.and.returnValue('/test')
    component.listTitles = [
      {path: '/test', title: 'Test', icon: ['fas','tv'], class: ''},
    ];
    expect(component.getTitle()).toEqual('Test');
  });
});
