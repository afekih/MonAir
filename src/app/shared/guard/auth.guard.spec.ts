import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import {AuthService} from "../services/auth.service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const routerMock = jasmine.createSpyObj('Router', ['navigate']);
  const authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: AuthService, useValue: authServiceMock},
        {provide: Router, useValue: routerMock}
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true for canActivate()', ()=> {
    authServiceMock.isLoggedIn.and.returnValue(true);
    const result = guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'testUrl'});
    expect(result).toBeTrue();
  });

  it('should return false for canActivate()', ()=> {
    authServiceMock.isLoggedIn.and.returnValue(false);
    const result = guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'testUrl'});
    expect(result).toEqual(false);
  });

});
