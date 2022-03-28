import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public email: string = '';
  public password: string = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit(): void {
  }

  signIn() {
    this.authService.signIn(this.email, this.password);
  }

  signOut() {
    this.authService.signOut();
  }

}
