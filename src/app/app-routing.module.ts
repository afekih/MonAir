import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OldDashboardComponent} from "./old-dashboard/old-dashboard.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {MapComponent} from "./components/map/map.component";

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'old_dashboard', component: OldDashboardComponent },
  { path: 'map', component: MapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
