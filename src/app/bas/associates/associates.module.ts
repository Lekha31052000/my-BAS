import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssociatesRoutingModule } from './associates-routing.module';
import { ManageAssociatesComponent } from './manage-associates/manage-associates.component';
import { PrepareAssociatesComponent } from './prepare-associates/prepare-associates.component';
import { AssociateLayoutComponent } from './associate-layout/associate-layout.component';
import { UtilsModule } from 'src/app/utils/utils.module';
import {
  MatCheckboxModule, MatDialogModule, MatOptionModule, MatSelectModule, MatSliderModule,
  MatSlideToggleModule, MatTabsModule, MatFormFieldModule
} from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { FingerprintComponent } from './fingerprint/fingerprint.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RedFlagHistoryComponent } from './red-flag-history/red-flag-history.component';


@NgModule({
  declarations: [
    ManageAssociatesComponent,
    PrepareAssociatesComponent,
    AssociateLayoutComponent,
    FingerprintComponent,
    RedFlagHistoryComponent
  ],
  imports: [
    CommonModule,
    AssociatesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatTabsModule,
    NgxPaginationModule,
    UtilsModule,
    NgSelectModule
  ],
  exports: [
    // FingerprintComponent
  ],
  entryComponents: [
    FingerprintComponent
  ]
})
export class AssociatesModule { }
