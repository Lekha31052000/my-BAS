import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ValidateInputDirective } from './directives/validate-input.directive';

// Components
import { ReportingManagerDialogComponent } from './components/reporting-manager-dialog/reporting-manager-dialog.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DownloadFilterDialogComponent } from './components/download-filter-dialog/download-filter-dialog.component';

// Modules
import { MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusComponent } from './components';

//plugin
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    ConfirmationComponent,
    ValidateInputDirective,
    ReportingManagerDialogComponent,
    StatusComponent,
    FileUploadComponent,
    DownloadFilterDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    // plugins
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  exports: [
    ValidateInputDirective,
    ConfirmationComponent,
    ReportingManagerDialogComponent,
    StatusComponent,
    FileUploadComponent
  ],
  entryComponents: [
    ConfirmationComponent,
    ReportingManagerDialogComponent,
    StatusComponent,
    DownloadFilterDialogComponent
  ]
})
export class UtilsModule { }
