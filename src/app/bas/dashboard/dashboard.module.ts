import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UtilsModule } from 'src/app/utils/utils.module';
import {
  MatCheckboxModule, MatDialogModule, MatOptionModule, MatSelectModule, MatSliderModule,
  MatSlideToggleModule, MatTabsModule
} from '@angular/material';

// components
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ApprovalsComponent } from './approvals/approvals.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { TransactionComponent } from './transaction/transaction.component';

//plugins
import { NgxPaginationModule } from 'ngx-pagination';
import { HighchartsChartModule } from 'highcharts-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [ApprovalsComponent, DashboardLayoutComponent, TransactionComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    UtilsModule,
    //plugins
    NgxPaginationModule,
    HighchartsChartModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class DashboardModule { }
