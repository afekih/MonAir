import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from "@angular/common/http";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {environment} from "../environments/environment";

import {USE_EMULATOR} from "@angular/fire/compat/database";
import {AuthLayoutModule} from "./layouts/auth-layout/auth-layout.module";
import {AdminLayoutModule} from "./layouts/admin-layout/admin-layout.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    AuthLayoutModule,
    AdminLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
  ],
  providers: [
    {provide: USE_EMULATOR, useValue: environment.useEmulator ? ['localhost', 9000] : undefined},
    // MatDatepickerModule
    // MatDatetimepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
