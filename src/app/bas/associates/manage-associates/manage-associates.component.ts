import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import {
  RoleAuth, UserDetails, SortableColums, PaginationClass,
  PaginationControl,
  Associates
} from '../../../utils/models';
import { AssociatesService } from '../associates.service';
import { ConfirmationComponent } from 'src/app/utils/components/confirmation/confirmation.component';
import { SharedService } from 'src/app/utils/services';
import { Subscription } from 'rxjs';
import { SessionStorage } from 'ngx-webstorage';

@Component({
  selector: 'app-manage-associates',
  templateUrl: './manage-associates.component.html',
  styleUrls: ['./manage-associates.component.scss']
})
export class ManageAssociatesComponent implements OnInit, OnDestroy {
  @SessionStorage('mod') public modules: any;
  @SessionStorage('auth') public userDetails: any;

  public manageUserForm: FormGroup;
  public permissions = new RoleAuth([]);
  public pageData = new PaginationClass({ pageSize: 10 });
  public pageControl = new PaginationControl();
  public sortDirection = new SortableColums();
  public allAssociateList = [];
  public filteredAssociateList = [];
  public flagFilterList = [];
  public deletableUsers = [];
  public selectedFlagFilter = 'all';
  public flagText = '';
  public failedList: any;
  public selectAll = false;
  public getAsscSubscription: Subscription;
  public searchSubscription: Subscription;
  public pagination = {
    limit: this.pageData.pageSize,
    offset: this.pageData.pageNumber - 1,
    searchText: ''
  }

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private associateService: AssociatesService,
    private sharedService: SharedService
  ) {
    this.manageUserForm = this.formBuilder.group({
      searchText: [''],
      selectAll: [false],
      allUser: [[]]
    });
    this.flagFilterList = this.associateService.flagFilters;
    // this.listenToEvents();
  }

  ngOnInit() {
    this.checkModulePermissions();
  }

  ngOnDestroy() {
    if (this.getAsscSubscription) {
      this.getAsscSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  /* check module permissions */
  checkModulePermissions() {
    if (this.modules) {
      const currentModule = this.modules.filter(module => module.modulename.toLowerCase() === 'associates' && module.resources.filter(resource => resource.resourcename.toLowerCase() === 'associates').length > 0);
      if (currentModule.length > 0) {
        const currentResource = currentModule[0].resources.filter(resource => resource.resourcename.toLowerCase() === 'associates');
        this.permissions = new RoleAuth(currentResource[0].permissions);
        if (this.permissions.read) {
          this.pageData.searchText = '';
          this.getAllAssociates();
          // if(!this.getAsscSubscription){
          this.listenToEvents();
          // }
        }
        if (this.permissions.create) {
          this.associateService.setSubscription('getAssociate', { showAddAsscBtn: true });
        }
      }
    }
  }

  listenToEvents() {
    console.log('check==================>');
    this.getAsscSubscription = this.associateService.getSubscription('getAssociate').subscribe(res => {
      if (res && res.hasOwnProperty('refresh')) {
        this.getAllAssociates();
      }
    });

    this.searchSubscription = this.associateService.getSubscription('search').subscribe(res => {
      if (res && res.hasOwnProperty('associates') && res.hasOwnProperty('searchText')) {
        this.pagination.searchText = res.searchText.trim();
        this.pagination.offset = 0;
        this.selectedFlagFilter = 'all';
        this.getAllAssociates();
      }
    });
  }

  /* get all users */
  getAllAssociates() {

    this.sharedService.display(true);
    let requestOrgName;

    if (this.userDetails.userDetails.vendor) {
      requestOrgName = this.userDetails.userDetails.vendor.orgName;
    } else {
      requestOrgName = ''
    }
    let request;

    if (this.userDetails.userDetails.role != 'superadmin') {
      request = '?limit=' + this.pagination.limit + '&offset=' +
        this.pagination.offset + '&search=' + this.pagination.searchText + '&orgName=' + this.userDetails.userDetails.vendor.orgName + '&flag=' + this.flagText
      // + '&domainName=' + this.userDetails.userDetails.vendor.domainName;
    } else {
      request = '?limit=' + this.pagination.limit + '&offset=' +
        this.pagination.offset + '&search=' + this.pagination.searchText + '&flag=' + this.flagText;
    }

    this.associateService.get(`associates` + request, true).subscribe((response) => {
      if (response.data && response.data.length > 0) {
        
        this.allAssociateList = [];
        this.selectAll = true;
        response.data.forEach((user) => {
          // check if the user is already in the deletable list and set the flag accordingly
          user['isDelete'] = (this.deletableUsers.filter(usr => usr.toLowerCase() === user.userid.toLowerCase()).length > 0 ? true : false);
          this.selectAll = user['isDelete'] ? this.selectAll : false;
          // this.allAssociateList.unshift(new Associates(user));
          this.allAssociateList.push(new Associates(user));
        });

        this.filteredAssociateList = Object.assign([], this.allAssociateList);

        this.pageData.totalItems = response.total;
        // this.isResetPassword = false;
        this.sharedService.display(false);
      } else {
        this.resetPage();
      }
    }, () => {
      this.resetPage();
    });
  }

  setFlagFilter(flag) {

    this.selectedFlagFilter = flag.type;
    if (this.selectedFlagFilter === 'all') {
      this.allAssociateList = Object.assign([], this.filteredAssociateList);
    } else {
      this.allAssociateList = this.filteredAssociateList.filter(assc => assc.flag === flag.type);
    }

    this.pagination.offset = 0;
    this.pageData.pageNumber = 1;
    this.flagText = flag.value;

    this.getAllAssociates();

  }

  /* reset data */
  resetPage() {
    this.allAssociateList = [];
    this.pageData.totalItems = 0;
    this.sharedService.display(false);
  }

  /* when the checkbox value changes */
  onCheckboxChange(userIndex: number, $event?: any) {
    const allUserCount = this.allAssociateList.length;
    if (userIndex < 0) {
      this.allAssociateList.forEach(user => {
        user.isDelete = this.selectAll;
        if (this.selectAll) {
          // check if element is already in the deletable list, if not then push it to the list
          if (this.deletableUsers.indexOf(user.userid.toLowerCase()) < 0) {
            this.deletableUsers.push(user.userid.toLowerCase());
          }
        } else {
          this.deletableUsers = this.deletableUsers.filter(st => st.toLowerCase() !== user.userid.toLowerCase());
        }
      });
    } else if (allUserCount > 0) {
      if (this.allAssociateList[userIndex].isDelete) {
        this.deletableUsers.push(this.allAssociateList[userIndex].userid.toLowerCase());
      } else {
        this.deletableUsers = this.deletableUsers.filter(usr => usr.toUpperCase() !== this.allAssociateList[userIndex].userid.toUpperCase());
      }
      this.selectAll = ((this.allAssociateList.filter(user => user.isDelete === true)).length === allUserCount) ? true : false
    }
    // this.isUserSelected = ((this.allAssociateList.filter(user => user.isDelete === true)).length > 0) ? true : false
  }

  navigateToUserDetail(user) {
    // this.userService.resumePage = {
    //   pageNumber: this.pageData.pageNumber,
    //   searchText: this.manageUserForm.value.searchText,
    //   pageSize: this.pageData.pageSize
    // };
    // this.viewableUser = { user: user };
    // this.isResetPassword = true;
    this.router.navigateByUrl(`/my-profile/user-details/${user.deleted}/${user.userid}`);
  }

  /* retain the required data before navigation */
  navigatetoEditPage(userid) {
    // this.userService.resumePage = {
    //   pageNumber: this.pageData.pageNumber,
    //   searchText: this.manageUserForm.value.searchText,
    //   pageSize: this.pageData.pageSize
    // };
    this.associateService.setSubscription('getAssociate', { showAddAsscBtn: false });
    this.router.navigateByUrl(`/manage-associates/associates/update/${userid}`);
  }

  confirmDeletion(associate) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title: 'Delete Associate',
        message: `Are you sure to delete "${associate.first_name}" ?`,
        buttonLableSubmit: 'Yes',
        buttonLableCancel: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.deleteUsers(associate);

      }
    });
  }

  /* delete users */
  deleteUsers(associate) {
    let deleteUser = {
      users: this.deletableUsers
    };
    // this.allUserList.forEach(user => {
    //   if (user.isDelete) {
    //     deleteUser.users.push(user.userid);
    //   }
    // });
    this.sharedService.display(true);
    this.associateService.delete(`associates/${associate.id}`, true).subscribe(res => {
      if (res && res.hasOwnProperty('status')) {

        switch (res.status) {
          case 'DELETE_SUCCESS':
            this.snackBar.open(`"${associate.first_name}" has been deleted successfully.`, '', window['snackBarConfig']);
            this.deletableUsers = [];
            this.getAllAssociates();
            this.selectAll = false;
            this.associateService.put('associates/transaction', { createdby: associate.created_by }).subscribe(res => {

            });
            break;
          case 'DELETE_FAILED':

            break;

        }
        // this.isUserSelected = false;
      }
      this.sharedService.display(false);
    }, (error => {
      this.sharedService.display(false);
      this.showError(error);
    }));
  }

  setCurrentPageNumber(evnt) {
    this.pageData.pageNumber = Number(evnt);
    this.pagination.offset = Number(evnt - 1);
    this.getAllAssociates();
    // this.selectAll = false;
    // this.isUserSelected = false;
    // this.onCheckboxChange(-1);
  }

  showError(error: any) {
    this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message : window['serverError'], '',
      window['snackBarConfig']);
  }

}
