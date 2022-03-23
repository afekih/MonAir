import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminLayoutRoutingModule} from './admin-layout-routing';
import {OldDashboardComponent} from "../../old-dashboard/old-dashboard.component";
import {SidebarComponent} from "../../components/sidebar/sidebar.component";
import {TopBarComponent} from "../../components/topbar/top-bar.component";
import {DashboardComponent} from "../../pages/dashboard/dashboard.component";
import {MapComponent} from "../../pages/map/map.component";
import {AdminLayoutComponent} from './admin-layout.component';
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faChartLine, faGlobeEurope, faTv} from "@fortawesome/free-solid-svg-icons";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDividerModule} from "@angular/material/divider";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {NgChartsModule} from "ng2-charts";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    OldDashboardComponent,
    SidebarComponent,
    TopBarComponent,
    DashboardComponent,
    MapComponent,
    AdminLayoutComponent,
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    FontAwesomeModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    // MatNativeDateModule,
    MatDatetimepickerModule,
    // MatNativeDatetimeModule,
    MatMomentDatetimeModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminLayoutModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTv, faGlobeEurope, faChartLine);
  }
}
