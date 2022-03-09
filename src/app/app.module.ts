import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {TopBarComponent} from './components/topbar/top-bar.component'
import {OldDashboardComponent} from './old-dashboard/old-dashboard.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {MapComponent} from './components/map/map.component';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HttpClientModule} from "@angular/common/http";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgChartsModule} from "ng2-charts";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {environment} from "../environments/environment";

import {USE_EMULATOR} from "@angular/fire/compat/database";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDividerModule} from "@angular/material/divider";
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faChartLine, faGlobeEurope, faTv} from "@fortawesome/free-solid-svg-icons";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatDatetimepickerModule, MatNativeDatetimeModule} from "@mat-datetimepicker/core";

@NgModule({
  declarations: [
    AppComponent,
    OldDashboardComponent,
    SidebarComponent,
    TopBarComponent,
    DashboardComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    HttpClientModule,
    MatPaginatorModule,
    NgChartsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    FontAwesomeModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule
  ],
  providers: [
    {provide: USE_EMULATOR, useValue: environment.useEmulator ? ['localhost', 9000] : undefined},
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTv, faGlobeEurope, faChartLine);
  }
}
