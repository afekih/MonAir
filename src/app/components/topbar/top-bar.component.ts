import { Component, OnInit } from '@angular/core';
import {ROUTES} from '../sidebar/sidebar.component';
import {Location} from '@angular/common';
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  // public focus;
  public listTitles: any[] = [];
  public location: Location;

  constructor(location: Location, private authService: AuthService) {
    this.location = location;
  }

  ngOnInit(): void {
    this.listTitles = ROUTES;
    console.log('routes', ROUTES);
  }

  getTitle() {
    let title = this.location.prepareExternalUrl(this.location.path());
    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === title) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  signOut() {
    this.authService.signOut();
  }

}
