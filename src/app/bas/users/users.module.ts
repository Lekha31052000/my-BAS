import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatTabsModule, MatCheckboxModule, MatSliderModule, MatSelectModule, MatOptionModule,
  MatDialogModule, MatSlideToggleModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatMenuModule, MatGridListModule
} from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersRoutingModule } from './users-routing.module';
import {
  UsersLayoutComponent, ManageUsersComponent, PrepareUsersComponent,
  ManageRolesComponent, PrepareRolesComponent
} from './';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ManageUsersComponent,
    PrepareUsersComponent,
    UsersLayoutComponent,
    ManageRolesComponent,
    PrepareRolesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UsersRoutingModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatMenuModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    NgxPaginationModule,
    UtilsModule,
    NgSelectModule
  ]
})
export class UsersModule { }
