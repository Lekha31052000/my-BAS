import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewRef } from '@angular/core';
import { ShowModuleResources, RoleAuth, PaginationClass } from 'src/app/utils/models';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { SessionStorage } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/utils/services';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { DownloadFilterDialogComponent } from 'src/app/utils/components/download-filter-dialog/download-filter-dialog.component';
import { VendorsService } from '../../vendors/vendors.service';
import { ManageUsersComponent } from '../manage-users/manage-users.component'

@Component({
  selector: 'app-layout',
  templateUrl: './users-layout.component.html',
  styleUrls: ['./users-layout.component.scss']
})
export class UsersLayoutComponent implements OnInit, OnDestroy {
  @SessionStorage('mod') public userModules: any;
  @SessionStorage('auth') public user: any;
  public permissions = new RoleAuth([]);
  public showResources = new ShowModuleResources({});
  public usersSubscription: Subscription;
  public searchSubscription: Subscription;
  public pageData = new PaginationClass({ pageSize: 10, sort: { createddate: -1 } });
  public searchForm: FormGroup;
  public selectedTabLabel = 'Users';
  public vendorCollections = [];
  public vendor;
  public flag = true;
  public role;
  public allBtns = {
    add:false,
    addUser: false,
    bulkUserUpload: false,
    userReport: false,
    addRole: false,
    search: false
  }

  constructor(
    private router: Router,
    public usersService: UsersService,
    public sharedService: SharedService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private vendorService: VendorsService,
    public ManageUsersComponent: ManageUsersComponent,
    private dialog: MatDialog,
    public changeDetactor: ChangeDetectorRef
  ) {
    this.searchForm = this.formBuilder.group({
      searchText: ['']
    });

  }

  ngOnInit() {
    this.role = this.user.userDetails.role;
    this.getAllVendors()
    this.checkModulePermissions();
    // this.listenToEvents();
  }

  ngOnDestroy() {
    this.searchForm.patchValue({ searchText: '' });
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    // if (this.usersSubscription) {
    //   this.usersSubscription.unsubscribe();
    // }
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

  /* reset data */
  resetPage() {
    this.sharedService.display(false);
    this.pageData.totalItems = 0;
  }

  vendorSelect(data) {
    this.usersService.sendMessage(data);
   
    this.vendor = data;
    if(data === 'all'){
      console.log('selected - all');
      this.vendor = undefined;
    } else {
      console.log('selected - ',data);
    }
    console.log(this.ManageUsersComponent.cameFrom(data));
  }

  /* check module permissions */
  checkModulePermissions() {

    if (this.userModules) {
      const userModule = this.userModules.filter(module => module.modulename.toLowerCase() === 'user management');
      if (userModule.length > 0) {
        this.listenToEvents();
        userModule[0].resources.forEach((resource) => {
          resource.resourcename = resource.resourcename.toLowerCase();
          switch (resource.resourcename.toLowerCase()) {
            case 'users':
              if (resource.permissions.filter(permission => permission.toLowerCase() === 'read').length > 0) {
                this.allBtns.userReport = this.showResources.users = true;
                this.allBtns.search = true;
              }
              if (resource.permissions.filter(permission => permission.toLowerCase() === 'create').length > 0) {
                this.allBtns.bulkUserUpload = this.allBtns.addUser = true;
              }
              if (resource.permissions.filter(permission => permission.toLowerCase() === 'update').length > 0) {
                this.allBtns.bulkUserUpload = true;
              }
              break;
            case 'roles': {
              if (resource.permissions.filter(permission => permission.toLowerCase() === 'read').length > 0) {
                this.showResources.roles = true;
              }
              if (resource.permissions.filter(permission => permission.toLowerCase() === 'create').length > 0) {
                this.allBtns.addRole = true;
              }
              break;
            }
          }
        });
        if (this.showResources.users) {
          this.selectedTabLabel = 'Users';
          this.router.navigateByUrl('/manage-users/users');
        } else if (this.showResources.roles) {
          this.selectedTabLabel = 'Roles';
          this.router.navigateByUrl('/manage-users/roles');
        }
      }
    }
  }

  listenToEvents() {
    this.usersSubscription = this.usersService.getSubscription('btn-status').subscribe(res => {
      if (res) {
        this.allBtns.addRole = res.hasOwnProperty('addRole') ? res.addRole : this.allBtns.addRole;
        this.allBtns.addUser = res.hasOwnProperty('addUser') ? res.addUser : this.allBtns.addUser;
        if (this.changeDetactor && !(this.changeDetactor as ViewRef).destroyed) {
          this.changeDetactor.detectChanges();
        }

        this.allBtns.bulkUserUpload = res.hasOwnProperty('bulkUserUpload') ? res.bulkUserUpload : this.allBtns.bulkUserUpload;
        this.allBtns.userReport = res.hasOwnProperty('userReport') ? res.userReport : this.allBtns.userReport;
      }
    });
    this.searchSubscription = this.usersService.getSubscription('search').subscribe(res => {
      if (res) {
        if (res.searchText === '' || res.searchText) {
          this.allBtns.search = res.hasOwnProperty('users') ? res.users : res.roles;
        } else {
          this.allBtns.search = res.hasOwnProperty('addUser') ? res.addUser : res.addRole;
        }
        this.changeDetactor.detectChanges();
      }
    });
  }

  onTabClick(tabName) {
    this.selectedTabLabel = this.usersService.currentSelectedTab = tabName;
    this.searchForm.patchValue({ searchText: '' });
  }

  onSearch(evnt, canEmit?: boolean) {
    if ((evnt && (evnt.keyCode && evnt.keyCode === 13 || evnt.target.value.trim() === '')) || canEmit) {

      let data = {
        searchText: this.searchForm.value.searchText
      };
      data[this.selectedTabLabel.toLowerCase()] = true;
      this.usersService.setSubscription('search', data);

    }
  }

  navigatePage(action) {
    this.flag = false;
    this.allBtns[action] = false;
    this.allBtns.search = false;
    this.allBtns.add=true;

  }
  downloadCSV(category, fileType, isSample) {

  }

  /* on file upload */
  onfileUploadChange($event) {
    let fileData = $event.file;
    const snackbar = this.snackBar.open('File is uploading......please wait....', '', window['fileUpload']);
    this.usersService.upload('user/upload', fileData).subscribe((response) => {
      if (response && response.hasOwnProperty('success') && response.success) {
        this.snackBar.open('File uploaded successfully', 'okay', window['snackBarBottom']);
        // this.showUploadStatus(response.payload);
        this.onSearch({}, true);
      } else {
        this.snackBar.open('Error while updloading..!', 'okay', window['snackBarBottom']);
        this.sharedService.display(true);
        setTimeout(() => {
          this.sharedService.display(false);
          this.onSearch({}, true);
        }, 2000);
      }
    }, (error) => {
      // this.showUploadStatus(error);
      snackbar.dismiss();
      this.sharedService.display(true);
      setTimeout(() => {
        this.sharedService.display(false);
        this.onSearch({}, true);
      }, 2000);
    });
  }

  filterPopUp() {

    this.usersService.fileDownload('users/download', {}).subscribe(res => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', `user.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

}
