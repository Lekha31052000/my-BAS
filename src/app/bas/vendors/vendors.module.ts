import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsRoutingModule } from './vendors-routing.module';
import { PrepareVendorsComponent } from './prepare-vendors/prepare-vendors.component';
import { ManageVendorsComponent } from './manage-vendors/manage-vendors.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { ManageVendorUsersComponent } from './manage-vendor-users/manage-vendor-users.component';
import { MatSlideToggleModule } from '@angular/material';
import { ManageVendorUserAssociatesComponent } from './manage-vendor-user-associates/manage-vendor-user-associates.component';

@NgModule({
  declarations: [PrepareVendorsComponent, ManageVendorsComponent, ManageVendorUsersComponent, ManageVendorUserAssociatesComponent],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NgxPaginationModule
  ]
})
export class VendorsModule { }
