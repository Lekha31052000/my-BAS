import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewRef } from '@angular/core';
import { AssociateTabs, RoleAuth,  PaginationClass, PaginationControl} from 'src/app/utils/models';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FingerprintComponent } from '../fingerprint/fingerprint.component';
import { AssociatesService } from '../associates.service';
import { Subscription } from 'rxjs';
import { SessionStorage } from 'ngx-webstorage';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DownloadFilterDialogComponent } from 'src/app/utils/components/download-filter-dialog/download-filter-dialog.component';
import { SharedService } from 'src/app/utils/services';
import { UsersService } from "../../users/users.service";
import { RedFlagHistoryComponent } from "../red-flag-history/red-flag-history.component";

@Component({
  selector: 'app-associate-layout',
  templateUrl: './associate-layout.component.html',
  styleUrls: ['./associate-layout.component.scss']
})
export class AssociateLayoutComponent implements OnInit, OnDestroy {
  @SessionStorage('mod') public modules: any;
  @SessionStorage('auth') public user: any;
  public permissions = new RoleAuth([]);
  public selectedTabLabel = '';
  public showResources = new AssociateTabs();
  public getAsscSubscription: Subscription;
  public pageData = new PaginationClass({ pageSize: 10 });
  public pageControl = new PaginationControl();
  public searchForm: FormGroup;
  public allBtns = {
    addAssociate: false,
    associateReport: false
  }
  public pagination = {
    limit: this.pageData.pageSize,
    offset: this.pageData.pageNumber - 1,
    searchText: "",
  };
  public allAssociateList = [];
  public hideData = true;
  public role;
  redflaghistory: boolean;

  constructor(
    private router: Router,
    public associateService: AssociatesService,
    private dialog: MatDialog,
    public formBuilder: FormBuilder,
    public changeDetactor: ChangeDetectorRef,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    public usersService: UsersService
  ) {
    this.searchForm = this.formBuilder.group({
      searchText: ['']
    });
    this.checkModulePermissions();
    this.onSearch();
  }

  ngOnInit() {
    this.role = this.user.userDetails.role;
    if(this.role === 'Admin' || this.role === 'superadmin'){
      this.redflaghistory = true;
    }
    else{     
      this.redflaghistory = false;
    }
  }
  redFlaggedHistory(tabName) {
    console.log(this.searchForm,'before');
    this.searchForm.controls['searchText'].patchValue(null);
    this.associateService.setSubscription('search', this.searchForm.value.searchText);
    console.log(this.searchForm,'after');
    this.selectedTabLabel = tabName;
    this.hideData = false;
    this.showResources.associates = true;
  }


  /* check module permissions */
  checkModulePermissions() {
    // if (this.modules) {
    //   const userModule = this.modules.filter(module => module.modulename.toLowerCase() === 'associates' && module.resources.filter(resource => resource.resourcename.toLowerCase() === 'associates').length > 0);
    //   if (userModule.length > 0) {
    //     this.permissions = new RoleAuth(userModule[0].resources[0].permissions);
    //   }
    // }

    if (this.modules) {
      const userModule = this.modules.filter(module => module.modulename.toLowerCase() === 'associates');
      if (userModule.length > 0) {
        this.listenToEvents();
        userModule[0].resources.forEach((resource) => {
          switch (resource.resourcename.toLowerCase()) {
            case 'associates': {
              if (resource.permissions.filter(permission => permission.toLowerCase() === 'read').length > 0) {
                this.showResources[resource.resourcename.toLowerCase()] = true;
              }
              break;
            }
          }
        });
      }
      if (this.showResources.associates) {
        this.selectedTabLabel = 'Associates';
        this.router.navigateByUrl('/manage-associates/associates');
      }
    }
  }

  listenToEvents() {
    this.getAsscSubscription = this.associateService.getSubscription('getAssociate').subscribe(res => {
      if (res) {
        this.allBtns.addAssociate = res.hasOwnProperty('showAddAsscBtn') ? res.showAddAsscBtn : this.allBtns.addAssociate;
        // this.changeDetactor.detectChanges();
      }
    });
  }

  addAssociate() {
    const dialogRef = this.dialog.open(FingerprintComponent, {
      disableClose: true,
      backdropClass: 'add-associate-backdrop',
      panelClass: 'add-associate-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.associateService.setSubscription('getAssociate', { refresh: true });
    });
  }

  filterPopUp() {
    const dialogRef = this.dialog.open(DownloadFilterDialogComponent, {
      width: '70vw',
      height: '50vh',
      data: this.selectedTabLabel,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }


  /**
   * @method - called whenever the tab is changed
   * @param  tabEvent - contains the selected tab details
   */
  selectedTabChange(tabEvent: any) {
    this.selectedTabLabel = tabEvent.tab.textLabel;
  }

  onSearch(evnt?, canEmit?: boolean) {
    //debugger
    if ((evnt && (evnt.keyCode && evnt.keyCode === 13 || evnt.target.value.trim() === '')) || canEmit) {
      let data = {
        searchText: this.searchForm.value.searchText
      };
      data[this.selectedTabLabel.toLowerCase()] = true;
      this.associateService.setSubscription('search', data);
    } 
    else {
      this.associateService.setSubscription('search', this.searchForm.value.searchText);
    }
  }

  

  resetPage() {
    this.allAssociateList = [];
    this.pageData.totalItems = 0;
    this.sharedService.display(false);
  }

  uploadExcel(event) {
    let fileName;
    if (event.target.files[0].name) {
      fileName = event.target.files[0];
    }

    const formData: FormData = new FormData();
    formData.append('file', fileName);
    this.sharedService.display(true);
    this.associateService.upload('associates/upload', formData, true).subscribe(res => {
      this.sharedService.display(false);
      this.snackBar.open('Associate Detail Updated', 'okay', window['snackBarBottom']);
      event.target.value = '';
    },
      err => {
        this.sharedService.display(false);
        event.target.value = '';
      }
    );
  }

  onTabClick(tabName) {
    this.usersService.currentSelectedTab = tabName;
    this.selectedTabLabel =tabName; 
    this.searchForm.controls['searchText'].patchValue(null);
    this.associateService.setSubscription('search', this.searchForm.value.searchText);
  }

  ngOnDestroy() {
    if (this.getAsscSubscription) {
      this.getAsscSubscription.unsubscribe();
    }
  }

}
