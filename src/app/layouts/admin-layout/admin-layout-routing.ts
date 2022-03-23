import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "../../pages/dashboard/dashboard.component";
import {OldDashboardComponent} from "../../old-dashboard/old-dashboard.component";
import {MapComponent} from "../../pages/map/map.component";
import {NgModule} from "@angular/core";

export const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'old_dashboard', component: OldDashboardComponent},
  {path: 'map', component: MapComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminLayoutRoutingModule {}
