import { Component, OnInit } from '@angular/core';
import {ROUTES} from '../sidebar/sidebar.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  // public focus;
  public listTitles: any[] = [];
  public location: Location;

  constructor(location: Location) {
    this.location = location;
  }

  ngOnInit(): void {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }

  getTitle() {
    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice(2);
    }
    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === title) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

}
