import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import {
  RoleAuth, UserDetails, SortableColums, PaginationClass,
  PaginationControl
} from '../../../utils/models';
import { UsersService } from '../users.service';
import { SessionStorage } from 'ngx-webstorage';
import { ConfirmationComponent } from 'src/app/utils/components/confirmation/confirmation.component';
import { SharedService } from 'src/app/utils/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss', '../manage-users/manage-users.component.scss']
})
export class ManageRolesComponent implements OnInit, OnDestroy {
  @SessionStorage('mod') public userModules: any;
  public manageRoleForm: FormGroup;
  public permissions = new RoleAuth([]);
  public pageData = new PaginationClass({ pageSize: 25 });
  public pageControl = new PaginationControl();
  public sortDirection = new SortableColums();
  private searchSubscription: Subscription;
  public allRoleList = [];
  public deletableUsers = [];
  public failedList: any;
  // public isUserSelected = false;
  public selectAll = false;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private usersService: UsersService,
    private sharedService: SharedService
  ) {
    // this.pageData = new PaginationClass(this.usersService.resumePage);
    this.manageRoleForm = this.formBuilder.group({
      searchText: [''],
      selectAll: [false],
      allUser: this.formBuilder.array([[]])
    });
  }

  ngOnInit() {
    this.checkModulePermissions();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  /* check module permissions */
  checkModulePermissions() {
    if (this.userModules) {
      const currentModule = Object.assign([], this.userModules.filter(module => module.modulename.toLowerCase() === 'user management' && module.resources.filter(resource => resource.resourcename.toLowerCase() === 'roles').length > 0));
      if (currentModule.length > 0) {
        let currentResource = currentModule[0].resources.filter(resource => resource.resourcename.toLowerCase() === 'roles');
        this.permissions = new RoleAuth(currentResource[0].permissions);
        if (this.permissions.read) {
          this.usersService.setSubscription('btn-status', { addRole: this.permissions.create });
          this.usersService.setSubscription('search', { addRole: this.permissions.create });
          this.getAllRole();
          this.listenToEvents();
          if (this.usersService.resumePage.role.searchText && this.usersService.resumePage.role.searchText.trim() !== '') {
            this.filterRole(this.usersService.resumePage.role.searchText);
            this.usersService.resumePage.role.searchText = '';
          }
        }
      }
    }
  }

  listenToEvents() {
    this.searchSubscription = this.usersService.getSubscription('search').subscribe(res => {
      if (res && res.hasOwnProperty('roles') && res.hasOwnProperty('searchText')) {
        this.pageData.searchText = res.searchText;
        this.pageData.pageNumber = 1;
        this.getAllRole();
      }
    });
  }

  /**
  * @method - filter the Class based on search input
  */
  private getAllRole() {
    this.sharedService.display(true);
    this.usersService.post('roles/find', this.pageData).subscribe((response) => {
      if (response.success && response.hasOwnProperty('payload')) {
        this.allRoleList = response.payload.roles;
        this.pageData.totalItems = response.payload.totalRoles;
      } else {
        this.resetPaginationData();
      }
      this.sharedService.display(false);
    }, () => {
      this.sharedService.display(false);
      this.resetPaginationData();
    });
  }

  /* reset data */
  resetPage() {
    this.allRoleList = [];
    this.pageData.totalItems = 0;
  }

  /* when the checkbox value changes */
  onCheckboxChange(userIndex: number, $event?: any) {
    const allUserCount = this.allRoleList.length;
    if (userIndex < 0) {
      this.allRoleList.forEach(user => {
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
      if (this.allRoleList[userIndex].isDelete) {
        this.deletableUsers.push(this.allRoleList[userIndex].userid.toLowerCase());
      } else {
        this.deletableUsers = this.deletableUsers.filter(usr => usr.toUpperCase() !== this.allRoleList[userIndex].userid.toUpperCase());
      }
      this.selectAll = ((this.allRoleList.filter(user => user.isDelete === true)).length === allUserCount) ? true : false
    }
    // this.isUserSelected = ((this.allRoleList.filter(user => user.isDelete === true)).length > 0) ? true : false
  }

  /* filter the roles based on search input */
  filterRole(searchText: string) {
    this.pageData.searchText = searchText;
    this.pageData.pageNumber = 1;
    this.pageData.totalItems = 0;
    this.getAllRole();
  }

  /* called when search icon is clicked */
  searchRole() {
    // do search if search input is given
    if (this.manageRoleForm.value.searchRole.trim() !== '') {
      // this.filterRole(this.manageRoleForm.value.searchRole);
      this.pageData.searchText = this.manageRoleForm.value.searchRole;
      this.getAllRole();
    }
  }

  /* Reset the data */
  resetPaginationData() {
    this.pageData.totalItems = 0;
    this.allRoleList = [];
  }

  /**
   * @method setCurrentPageNumber - set the current page number
   * @param pageNumber - the current page
   */
  setCurrentPageNumber(pageNumber: any) {
    this.pageData.pageNumber = pageNumber;
    this.getAllRole();
  }

  /* action to be performed before navigating to edit page */
  navigateToEditPage(roleId: string) {
    this.usersService.resumePage.role.searchText = this.manageRoleForm.value.searchRole;
    this.usersService.resumePage.role.pageNumber = this.pageData.pageNumber;
    this.usersService.resumePage.role.pageSize = this.pageData.pageSize;
    this.usersService.setSubscription('btn-status', { addRole: false });
    this.usersService.setSubscription('search', { addRole: false });
    this.router.navigateByUrl(`/manage-users/roles/update-role/${roleId}`);
  }

  /* Sort the table contents based on the 'key' being passed */
  sortBy(key: string) {
    this.pageData.sort = {};
    // ascending = 1, descending = -1
    this.sortDirection[key] = this.sortDirection[key] === 1 ? -1 : 1;
    this.pageData.sort[key] = this.sortDirection[key];
    this.getAllRole();
  }

  /* asks for user confirmation before deleting the role */
  confirmDeletion(role) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title: 'Delete Role',
        message: `Are you sure to delete role "${role.role}" ?`,
        buttonLableSubmit: 'Yes',
        buttonLableCancel: 'No'
      }
    });

    dialogRef.afterClosed().subscribe((status: Boolean) => {
      if (status) {
        this.deleteRole(role._id);
      }
    });
  }

  /**
   * @method - get delete the user class
   * @param roleName - to be passed if the specific role has to be deleted
   */
  deleteRole(roleName: string) {
    this.sharedService.display(true);
    this.usersService.delete(`role/${roleName}`).subscribe(response => {
      if (response.success === true) {
        this.snackBar.open(response.message ? response.message : 'Role has been deleted successfully.', 'okay', window['snackBarBottom']);
        this.getAllRole();
      }
      this.sharedService.display(false);
    }, (error => {
      this.showError(error);
    }));
  }

  /* error handler */
  showError(error: any) {
    this.sharedService.display(false);
    this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message :
      window['serverError'], 'okay', window['snackBarBottom']);
  }

}
