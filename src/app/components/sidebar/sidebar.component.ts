import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: any;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  {path: '/dashboard', title: 'Dashboard', icon: ['fas','tv'], class: ''},
  {path: '/map', title: 'Map', icon: ['fas', 'globe-europe'], class: ''},
  {path: '/old_dashboard', title: 'Old dashboard', icon: ['fas', 'chart-line'], class: ''},
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

}
