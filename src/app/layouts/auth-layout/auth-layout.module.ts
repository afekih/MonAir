import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SignInComponent} from "../../pages/sign-in/sign-in.component";
import {AuthLayoutComponent} from './auth-layout.component';
import {AuthLayoutRoutingModule} from "./auth-layout-routing.module";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    SignInComponent,
    AuthLayoutComponent,
  ],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    NgbCarouselModule
  ]
})
export class AuthLayoutModule {
}
