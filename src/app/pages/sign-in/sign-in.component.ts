import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {NgbCarousel} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  @ViewChild('carousel', {static: true}) carousel: NgbCarousel | undefined;

  public email: string = '';
  public password: string = '';
  public carouselImages = [
    {src: "assets/img/backgrounds/monair-slide1.png", desc: "Small sensors that involves citizens in mobile participatory sensing of air pollution and urban heat islands"},
    // {src: "assets/img/backgrounds/login-background.png", desc: "3M\'Air Sensor"},
    {src: "assets/img/backgrounds/monair-slide2.svg", desc: "Mon'Air platform allows you to visualize collected measurements using 3M'Air sensors"}
  ]

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit(): void {
    // this.carousel?.pause();
  }

  signIn() {
    this.authService.signIn(this.email, this.password);
  }

  signOut() {
    this.authService.signOut();
  }

}
