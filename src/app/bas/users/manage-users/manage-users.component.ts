import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import {
  RoleAuth, UserDetails, SortableColums, PaginationClass,
  PaginationControl
} from '../../../utils/models';
import { UsersService } from '../users.service';
import { ConfirmationComponent, StatusComponent } from 'src/app/utils/components';
import { SharedService } from 'src/app/utils/services';
import { SessionStorage } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { VendorsService } from '../../vendors/vendors.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  @SessionStorage('mod') public modules: any;
  @SessionStorage('auth') public user: any;
  public manageUserForm: FormGroup;
  public filterForm: FormGroup;
  public permissions = new RoleAuth([]);
  public pageData = new PaginationClass({ pageSize: 10, sort: { createddate: -1 } });
  public pageControl = new PaginationControl();
  public sortDirection = new SortableColums();
  public allUserList = [];
  public allRoles = [];
  public recentUsers = [];
  public deletableUsers = [];
  public vendorCollections = [];
  public vendor;
  public failedList: any;
  public role;
  public currentFilter = 'role';
  // public isUserSelected = false;
  public selectAll = false;
  private searchSubscription: Subscription;
  color = 'accent';
  message: any;
  subscription: Subscription;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private usersService: UsersService,
    private sharedService: SharedService,
    private vendorService: VendorsService,
    // public cdr: ChangeDetectorRef
  ) {
    // this.pageData = new PaginationClass(this.usersService.resumePage);
    this.manageUserForm = this.formBuilder.group({
      searchText: [''],
      selectAll: [false],
      allUser: this.formBuilder.array([[]])
    });

    this.filterForm = this.formBuilder.group({
      role: [''],
      recent_user: [''],
    });
    // this.usersService.resumePage = new PreservePageData({pageSize : 100});

    this.subscription = this.usersService.getMessage().subscribe(message => { 
      this.message = message; 

      this.pageData.vendor = this.message
      this.sharedService.display(true);
      this.pageData.filter = {};
    
      this.usersService.post('users/find', this.pageData).subscribe((response) => {
        if (response.success === true) {
          this.allUserList = [];
          this.selectAll = true;
          console.log('check before-------->', this.allUserList);
          
          response.payload.users.forEach((user) => {
            // check if the user is already in the deletable list and set the flag accordingly
            user['isDelete'] = (this.deletableUsers.filter(usr => usr.toLowerCase() === user.userid.toLowerCase()).length > 0 ? true : false);
            this.selectAll = user['isDelete'] ? this.selectAll : false;
            this.allUserList.push(new UserDetails(user));
          });
          this.pageData.totalItems = response.payload.totalUsers;
          // this.isResetPassword = false;
          this.sharedService.display(false);
          console.log('check after-------->', this.allUserList);
        } else {
          this.resetPage();
        }
      }, () => {
        this.resetPage();
      });

     });
  }

  ngOnInit() {
    this.role = this.user.userDetails.role;
    this.getAllVendors()
    // this.cameFrom()s
    this.checkModulePermissions();
  }

  ngOnDestroy() {
    
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();    
    }
  }

  getAllVendors() {
    this.sharedService.display(true);
    this.vendorService.post('vendors', this.pageData).subscribe(res => {
      console.log('result from vendor------->', res.message.Vendors);
      res.message.Vendors.map((ele) => {
        this.vendorCollections.push(ele.organizationname)
      });
    }, err => {
      this.resetPage();
    })
  }

  cameFrom(data) {
    console.log('data coming from layout---------->', data);
    this.vendor = data;
    this.getAllUsers();
  }

  /* check module permissions */
  checkModulePermissions() {
    if (this.modules) {
      const currentModule = this.modules.filter(module => module.modulename.toLowerCase() === 'user management' && module.resources.filter(resource => resource.resourcename.toLowerCase() === 'users').length > 0);
      if (currentModule.length > 0) {
        let currentResource = currentModule[0].resources.filter(resource => resource.resourcename.toLowerCase() === 'users');
        this.permissions = new RoleAuth(currentResource[0].permissions);
        if (this.permissions.read) {
          this.pageData.searchText = '';
          this.getAllUsers(true);
          this.getAllRoles();
          this.usersService.setSubscription('btn-status', { addUser: this.permissions.create });
          this.usersService.setSubscription('search', { addUser: this.permissions.create })
          this.listenToEvents();
        } else {
          const nextResource = currentModule[0].resources.filter(resource => resource.resourcename.toLowerCase() === 'roles');
          const permissions = new RoleAuth(nextResource[0].permissions);
          if (permissions.read) {
            this.router.navigateByUrl('/manage-users/roles');
          }
        }
      }
    }
  }

  listenToEvents() {
    this.searchSubscription = this.usersService.getSubscription('search').subscribe(res => {
      
      if (res && res.hasOwnProperty('users') && res.hasOwnProperty('searchText')) {
        this.pageData.searchText = res.searchText;
        this.pageData.pageNumber = 1;
        this.getAllUsers();

      }
    });
  }

  /* get the list of roles */
  getAllRoles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.usersService.get('roles').subscribe(response => {
        if (response.success === true && response.hasOwnProperty('payload')) {
          this.allRoles = response.payload;
        }
        resolve(1);
      }, (error => {
        // this.showError(error);
        reject(1);
      }));
    });
  }

  /* get all users */
  getAllUsers(spliceRecentData?: boolean, hasFilter?: boolean) {
    this.pageData.vendor = this.vendor
    this.sharedService.display(true);
    this.pageData.filter = {};
    if (hasFilter && this.currentFilter.trim() !== '') {
      this.pageData.filter[this.currentFilter] = this.filterForm.value.role;
    }
    this.usersService.post('users/find', this.pageData).subscribe((response) => {
      if (response.success === true) {
        this.allUserList = [];
        this.selectAll = true;
        console.log('check before-------->', this.allUserList);
        
        response.payload.users.forEach((user) => {
          // check if the user is already in the deletable list and set the flag accordingly
          user['isDelete'] = (this.deletableUsers.filter(usr => usr.toLowerCase() === user.userid.toLowerCase()).length > 0 ? true : false);
          this.selectAll = user['isDelete'] ? this.selectAll : false;
          this.allUserList.push(new UserDetails(user));
        });
        this.pageData.totalItems = response.payload.totalUsers;
        if (spliceRecentData) {
          this.recentUsers = this.allUserList.slice(0, 5);
        }
        // this.isResetPassword = false;
        this.sharedService.display(false);
        console.log('check after-------->', this.allUserList);
      } else {
        this.resetPage();
      }
    }, () => {
      this.resetPage();
    });
  }

  fiterUsers(filterType) {
    this.currentFilter = filterType;
    this.getAllUsers(false, true);
  }

  selectUser() {

  }

  /* reset data */
  resetPage() {
    this.sharedService.display(false);
    this.allUserList = [];
    this.pageData.totalItems = 0;
  }

  /* when the checkbox value changes */
  onCheckboxChange(userIndex: number, $event?: any) {
    const allUserCount = this.allUserList.length;
    if (userIndex < 0) {
      this.allUserList.forEach(user => {
        user.isDelete = this.selectAll;
        if (this.selectAll) {
          // check if element is already in the deletable list, if not then push it to the list
          if (this.deletableUsers.indexOf(user.email.toLowerCase()) < 0) {
            this.deletableUsers.push(user.email.toLowerCase());
          }
        } else {
          this.deletableUsers = this.deletableUsers.filter(st => st.toLowerCase() !== user.email.toLowerCase());
        }
      });
    } else if (allUserCount > 0) {
      if (this.allUserList[userIndex].isDelete) {
        this.deletableUsers.push(this.allUserList[userIndex].email.toLowerCase());
      } else {
        this.deletableUsers = this.deletableUsers.filter(usr => usr.toUpperCase() !== this.allUserList[userIndex].email.toUpperCase());
      }
      this.selectAll = ((this.allUserList.filter(user => user.isDelete === true)).length === allUserCount) ? true : false
    }
    // this.isUserSelected = ((this.allUserList.filter(user => user.isDelete === true)).length > 0) ? true : false
  }

  navigateToUserDetail(user) {
    // this.usersService.resumePage = {
    //   pageNumber: this.pageData.pageNumber,
    //   searchText: this.manageUserForm.value.searchText,
    //   pageSize: this.pageData.pageSize
    // };
    // this.viewableUser = { user: user };
    // this.isResetPassword = true;
    this.usersService.setSubscription('btn-status', { addUser: false });
    this.router.navigateByUrl(`/my-profile/user-details/${user.deleted}/${user.email}`);
  }

  /* retain the required data before navigation */
  navigatetoEditPage(userid) {
    // this.usersService.resumePage = {
    //   pageNumber: this.pageData.pageNumber,
    //   searchText: this.manageUserForm.value.searchText,
    //   pageSize: this.pageData.pageSize
    // };
    
    this.usersService.setSubscription('btn-status', { addUser: false });
    this.usersService.setSubscription('search', { addUser: false })
    this.router.navigateByUrl(`/manage-users/users/update-user/${userid}`);
  }

  /* To show the report/status of the uploaded user data through CSV*/
  showUploadStatus(uploadStatus: any) {
    this.failedList = uploadStatus.error ? uploadStatus.error : uploadStatus;
    const dialogRef = this.dialog.open(StatusComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'status-section-custom-dialog',
      backdropClass: 'custom-backdrop',
      data: { category: 'csv-upload', status: 'Success', response: uploadStatus }
    });

    dialogRef.afterClosed().subscribe((status) => {
      if (status === 'download') {
        this.downloadCSV('Failed-user-data', 'csv', false);
      }
    });
  }

  /* ask for confirmation before archive the user */
  confirmArchive(user) {
    let statusMessage = `Do you want to ${(user.deleted ? 'Disable' : 'Enable')} "${user.firstname} ${user.lastname}" ?`;
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title: user.deleted ? 'Disable User' : 'Enable User',
        message: statusMessage,
        buttonLableSubmit: user.deleted ? 'Disable' : 'Enable'
      }
    });

    dialogRef.afterClosed().subscribe((status: Boolean) => {
      if (status && user.deleted) {
        this.archiveUser(user);
      } else if (status && !user.deleted) {
        this.activeUser(user);
      } else {
        user.deleted = !user.deleted;
      }
    });
  }

  /* api request to archive the user */
  archiveUser(user) {
    user.deleteddate = new Date();
    let statusMessage = `User "${user.firstname}" has been ${user.deleted ? 'disabled.' : 'enabled.'}`;
    this.usersService.delete(`user/${user._id}`).subscribe((response) => {
      if (response.success) {
        this.snackBar.open(statusMessage, 'okay', window['snackBarBottom']);
      }
    }, (error) => {
      // if unable to archive reset the archive status
      user.deleted = !user.deleted;
      this.snackBar.open(error.error && error.error.message ? error.error.message : window['serverError'], 'okay', window['snackBarBottom']);
    });
  }

  activeUser(user) {
    let statusMessage = `User "${user.firstname}" has been ${user.deleted ? 'disabled.' : 'enabled.'}`;
    this.usersService.put(`users/reactivate/${user._id}`, {}).subscribe((response) => {
      if (response.success) {
        this.snackBar.open(statusMessage, 'okay', window['snackBarBottom']);
      }
    }, (error) => {
      // if unable to archive reset the archive status
      user.deleted = !user.deleted;
      this.snackBar.open(error.error && error.error.message ? error.error.message : window['serverError'], 'okay', window['snackBarBottom']);
    });
  }

  /* delete bulk users */
  deleteBulkUsers() {
    let deleteUser = {
      users: this.deletableUsers
    };
    // this.allUserList.forEach(user => {
    //   if (user.isDelete) {
    //     deleteUser.users.push(user.userid);
    //   }
    // });
    this.usersService.post('users/delete', deleteUser).subscribe(response => {
      if (response.success === true) {
        this.snackBar.open(`${this.deletableUsers.length} users has been deleted successfully.`, 'okay', window['snackBarBottom']);
        this.deletableUsers = [];
        this.getAllUsers();
        this.selectAll = false;
        // this.isUserSelected = false;
      }
    }, (error => {
      this.showError(error);
    }));
  }

  /* delete users */
  deleteSingleUser(user) {
    this.sharedService.display(true);
    this.usersService.delete(`users/delete/${user._id}`).subscribe(response => {
      this.sharedService.display(false);
      if (response.success === true) {
        this.snackBar.open(`User has been deleted successfully.`, '', window['snackBarBottom']);
        this.deletableUsers = [];
        this.getAllUsers();
        this.selectAll = false;
        // this.isUserSelected = false;
      }
    }, (error => {
      this.showError(error);
    }));
  }

  /* error handler - show error message in snackbar */
  showError(error: any) {
    this.sharedService.display(false);
    this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message : window['serverError'], 'okay',
      window['snackBarBottom']);
  }

  /* filter users based on search input */
  filterUser(searchText) {
    this.pageData.searchText = searchText;
    this.pageData.pageNumber = 1;
    this.selectAll = false;
    this.getAllUsers();
  }

  /* sort user based on the 'key' passed */
  sortBy(key: string) {
    this.pageData.sort = {};
    // ascending = 1, descending = -1
    this.sortDirection[key] = this.sortDirection[key] === 1 ? -1 : 1;
    this.pageData.sort[key] = this.sortDirection[key];
    this.getAllUsers();
  }

  /* set current page number */
  setCurrentPageNumber(event) {
    this.pageData.pageNumber = event;
    this.getAllUsers();
    this.selectAll = false;
    // this.isUserSelected = false;
    // this.onCheckboxChange(-1);
  }

  /* uncheck all selected users on cancel */
  onCancel() {
    // this.selectAll = false;
    // this.onCheckboxChange(-1);
    this.deletableUsers = [];
    this.allUserList.forEach(user => user.isDelete = false);
  }

  /* ask for confirmation before deleting the selected users */
  confirmDeletion(user, isBulkDelete: boolean) {
    const selectedUserCount = (this.allUserList.filter(user => user.isDelete === true)).length;
    let confirmMsg = `Are you sure to delete "${user.firstname} ${user.lastname}" ?`;
    if (isBulkDelete) {
      confirmMsg = `Are you sure to delete ${this.deletableUsers.length} users?`
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title: `Delete User${isBulkDelete ? 's' : ''}`,
        message: confirmMsg
      }
    });

    dialogRef.afterClosed().subscribe((status: Boolean) => {
      if (status) {
        if (isBulkDelete) {
          this.deleteBulkUsers();
        } else {
          this.deleteSingleUser(user);
        }
      }
    });
  }

  /* api request to download the user list as file */
  downloadCSV(fileName: string, fileType: string, isSampleCSV: boolean) {
    const fileTypes = this.usersService.getFileType();
    if (isSampleCSV) {
      this.usersService.downloadCSV('sample/Sample-Users-CSV.csv').subscribe((response) => {
        this.downloadFile(response, fileName, fileTypes[fileType]);
      }, (error) => {
        this.snackBar.open('Error while downloading sample CSV', 'okay', window['snackBarBottom']);
      });
    } else if (fileName === 'Failed-user-data') {
      this.usersService.downloadDataCSV('users/download/failed', this.failedList.errors).subscribe((response) => {
        this.downloadFile(response, fileName, fileTypes[fileType]);
      }, () => {
        this.snackBar.open('Error while downloading CSV', 'okay', window['snackBarBottom']);
      });
    } else {
      this.usersService.downloadDataCSV('users/download', this.pageData).subscribe((response) => {
        this.downloadFile(response, fileName, fileTypes[fileType]);
      }, () => {
        this.snackBar.open('Error while downloading CSV', 'okay', window['snackBarBottom']);
      });
    }
  }

  /* convert blob to CSV and download */
  downloadFile(response: any, filename: string, fileType: string) {
    const blob = new Blob([response._body], { 'type': fileType });
    const link = document.createElement('a');
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
