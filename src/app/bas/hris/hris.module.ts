import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { AssociatesRoutingModule } from './associates-routing.module';
// import { ManageAssociatesComponent } from './manage-associates/manage-associates.component';
// import { PrepareAssociatesComponent } from './prepare-associates/prepare-associates.component';
// import { AssociateLayoutComponent } from './associate-layout/associate-layout.component';
// import { UtilsModule } from 'src/app/utils/utils.module';
import {
  MatCheckboxModule, MatDialogModule, MatOptionModule, MatSelectModule, MatSliderModule,
  MatSlideToggleModule, MatTabsModule, MatFormFieldModule, MatCardModule
} from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { SeparationComponent } from './separation/separation.component';
import { HrisRoutingModule } from './hris-routing.module';
import { OnBoardingComponent } from './onboarding/onboarding.component';
import { SeparateComponent } from './separationn/separate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// import { FingerprintComponent } from './fingerprint/fingerprint.component';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { RedFlagHistoryComponent } from './red-flag-history/red-flag-history.component';


@NgModule({
  declarations: [
    SeparationComponent,
    OnBoardingComponent,
    SeparateComponent,
    
  ],
  imports: [
    CommonModule,
    HrisRoutingModule,
    MatCheckboxModule, 
    MatDialogModule, 
    MatOptionModule,
     MatSelectModule, 
     MatSliderModule,
    MatSlideToggleModule,
     MatTabsModule, 
     MatFormFieldModule,
     MatCardModule,
     NgxPaginationModule,
     MatDialogModule,
    FormsModule,
    ReactiveFormsModule
   
    
  ],
  exports: [
    // FingerprintComponent
  ],
  entryComponents: [
   
  ]
})
export class HrisModule { }
