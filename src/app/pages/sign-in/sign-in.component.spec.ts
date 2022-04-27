import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignInComponent} from './sign-in.component';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

describe('LoginComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  const authServiceMock = jasmine.createSpyObj('AuthService', ['signIn', 'isLoggedIn']);
  const routerMock = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInComponent],
      providers: [
        {provide: AuthService, useValue: authServiceMock},
        {provide: Router, useValue: routerMock}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    authServiceMock.signIn.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty email and password fields', () => {
    expect(component.email).toBeDefined();
    expect(component.email).toEqual('');
    expect(component.password).toBeDefined();
    expect(component.password).toEqual('');
  });

  it('should call signIn() of AuthService if email and password are given', () => {
    authServiceMock.signIn.and.callThrough();
    component.email = 'test@test.com';
    component.password = 'test';
    component.signIn();
    expect(authServiceMock.signIn).toHaveBeenCalledTimes(1);
  });

  it('should not call signIn() of AuthService is email or password are empty', () => {
    authServiceMock.signIn.and.callThrough();
    component.email = '';
    component.password = '';
    component.signIn();
    expect(authServiceMock.signIn).toHaveBeenCalledTimes(0);
  });
});
