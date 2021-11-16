import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatSnackBarModule, MatSidenavModule, MatIconModule, MatListModule,
  MatMenuModule, MatDialogModule
} from '@angular/material';
import { AppCommonRoutingModule } from './app-common-routing.module';
import { UtilsModule } from '../utils/utils.module';

import { AppCommonService } from './app-common.service';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpComponent } from './otp/otp.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyProfileModule } from '../bas/my-profile/my-profile.module';
import { NgxCaptchaModule } from 'ngx-captcha';
@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    OtpComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    SignUpComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AppCommonRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyProfileModule,
    UtilsModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatSnackBarModule,
    NgxCaptchaModule
  ],
  exports: [
    LayoutComponent, SidebarComponent, HeaderComponent
  ],
  providers: [
    AppCommonService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppCommonModule { }
