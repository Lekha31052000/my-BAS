import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppCommonService } from 'src/app/common/app-common.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'bas-reporting-manager-dialog',
  templateUrl: './reporting-manager-dialog.component.html',
  styleUrls: ['./reporting-manager-dialog.component.scss']
})
export class ReportingManagerDialogComponent implements OnInit {
  public allManagers = [];
  public filteredManager = [];
  public selectedManager = '';
  public searchForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ReportingManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      searchText: ['']
    });

    if (this.data.hasOwnProperty('managerList')) {
      this.allManagers = Object.assign([], this.data.managerList);
    }

    // Filter manager list based on the search list
    this.searchForm.get('searchText').valueChanges.subscribe(val => {
      val = val.toLowerCase();
      this.filteredManager = this.allManagers.filter(manager => manager.name.toLowerCase().indexOf(val) === 0);
    });

  }

  ngOnInit() {
  }

  /* Set the reporting manager on selection */
  onSelectingManager(manager: any) {
    this.selectedManager = manager.hasOwnProperty('name') ? manager.name : this.selectedManager;
    this.searchForm.patchValue({searchText: ''});
  }

  /* Clear the selection */
  clearSelection() {
    this.selectedManager = '';
  }

  /* close the prompt */
  updateUser() {
    this.dialogRef.close({ selectedManager : this.selectedManager });
  }

}
