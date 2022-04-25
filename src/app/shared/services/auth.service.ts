import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private userData: any;

  constructor(private afAuth: AngularFireAuth, private router: Router, private ngZone: NgZone) {
    // this.userData = afAuth.authState;
    // console.log('in constructor');
    this.afAuth.authState.subscribe((user) => {
      // console.log(user);
      if (user) {
        this.userData = user;
        sessionStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user')!);
      } else {
        sessionStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.userData = result.user;
        sessionStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user')!);
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user')!);
    return user !== null && user.uid !== null;
  }

  // Sign out
  signOut() {
    return this.afAuth.signOut().then(() => {
      sessionStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}
