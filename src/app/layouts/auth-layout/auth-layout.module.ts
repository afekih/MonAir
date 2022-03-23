import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginComponent} from "../../pages/login/login.component";
import {AuthLayoutComponent} from './auth-layout.component';
import {AuthLayoutRoutingModule} from "./auth-layout-routing.module";


@NgModule({
  declarations: [
    LoginComponent,
    AuthLayoutComponent,
  ],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule,
  ]
})
export class AuthLayoutModule {
}
