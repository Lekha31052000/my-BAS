import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProfileRoutingModule } from './my-profile-routing.module';
import { UtilsModule } from 'src/app/utils/utils.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { DialogComponent } from './dialog/dialog.component';


@NgModule({
  declarations: [
    ChangePasswordComponent,
    ProfileLayoutComponent,
    ProfileComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyProfileRoutingModule,
    UtilsModule
  ],
  entryComponents: [
    DialogComponent
  ],
  exports: [
    DialogComponent
  ]
})
export class MyProfileModule { }
