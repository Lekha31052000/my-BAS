import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from './common/app-common.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { MatSidenavModule } from '@angular/material';
import { ApprovalsComponent } from '../app/bas/dashboard/approvals/approvals.component'
import { ManageUsersComponent } from './bas/users/manage-users/manage-users.component';
import { UsersLayoutComponent } from './bas/users/users-layout/users-layout.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgSelectModule,
    AppCommonModule,
    HttpClientModule,
    NgxPaginationModule,
    
    NgxWebstorageModule.forRoot(),
    MatSidenavModule
  ],
  providers: [ApprovalsComponent,ManageUsersComponent,UsersLayoutComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
