import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";


describe('AuthService', () => {
  let service: AuthService;
  const authState: any = {
    displayName: null,
    isAnonymous: true,
    uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2'
  };

  const angularFireAuthMock: any = {
    authState: of(authState),
    signInWithEmailAndPassword() {
      sessionStorage.setItem('user', JSON.stringify(''));
    },
    signOut() {
      sessionStorage.removeItem('user');
    }
  };

  beforeEach(() => {
    sessionStorage.removeItem('user');
    TestBed.configureTestingModule({
      imports: [
        // AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule
      ],
      providers: [
        {provide: AngularFireAuth, useValue: angularFireAuthMock},
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use angularFireAuth signIn method', (done: DoneFn) => {
    const username = 'test@test.com';
    const password = 'test';

    spyOn(angularFireAuthMock, 'signInWithEmailAndPassword').and.resolveTo(1);
    service.signIn(username, password).then(done);
    // service.signIn(username, password).then(done);
    expect(angularFireAuthMock.signInWithEmailAndPassword).toHaveBeenCalled();
  });

  it('should return true if user is logged in', () => {
    // sessionStorage.setItem('user', JSON.stringify(''));
    expect(service.isLoggedIn).toEqual(true);
  });

  it('should use angularFireAuth signOut method', (done: DoneFn) => {
    spyOn(angularFireAuthMock, 'signOut').and.resolveTo(1);
    service.signOut().then(done);
    expect(angularFireAuthMock.signOut).toHaveBeenCalled();
  });

  it('should return false if user is not logged in', () => {
    sessionStorage.removeItem('user');
    expect(service.isLoggedIn).toEqual(false);
  });

  afterEach(() => {
    sessionStorage.removeItem('user');
  });
});
