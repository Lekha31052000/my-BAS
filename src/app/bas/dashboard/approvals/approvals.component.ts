import { Component, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlTree, UrlSegmentGroup, PRIMARY_OUTLET, UrlSegment } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import {
  RoleAuth, UserDetails, SortableColums, PaginationClass,
  PaginationControl
} from '../../../utils/models';
import { UsersService } from '../../users/users.service';
import { DashboardService } from '../dashboard.service';
import { ConfirmationComponent } from 'src/app/utils/components/confirmation/confirmation.component';
import { SharedService } from 'src/app/utils/services';
import { SessionStorage } from 'ngx-webstorage';
import { FormGroup } from '@angular/forms';
import { VendorsService } from '../../vendors/vendors.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  @SessionStorage('mod') public userModules: any;
  @SessionStorage('auth') public user: any;
  public userForm: FormGroup;
  public permissions = new RoleAuth([]);
  public pageData = new PaginationClass({ pageSize: 10 });
  public pageControl = new PaginationControl();
  public sortDirection = new SortableColums();
  public allApprovalList = [];
  public deletableUsers = [];
  public vendorCollections = [];
  public failedList: any;
  public vendor: string;
  public role;
  public selectAll = false;
  public routeSegmentId: string;
  public showBack = false;
  message: any;
  subscription: Subscription;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private router: Router,
    private dashboardService: DashboardService,
    private vendorService: VendorsService,
    private sharedService: SharedService,
    public activatedRoute: ActivatedRoute,)
     {
     this.subscription = this.dashboardService.getMessage().subscribe(message => { 
       this.message = message; 
       console.log("message",message)
       this.pageData.vendor = this.message
       this.sharedService.display(true);
       this.dashboardService.post('users/approval', this.pageData).subscribe((response) => {
         if (response.success === true) {
           this.allApprovalList = response.payload.users;
           console.log('filled---->', this.allApprovalList);  
           this.pageData.totalItems = response.payload.totalUsers;
         }
         this.sharedService.display(false);
       }, (err) => {
         this.allApprovalList = [];
         console.log('empty here--------->', this.allApprovalList); 
         this.sharedService.display(false);
         this.resetPage();
         // if(!hideError){
         //   this.showError(err);
         // }
       });
      });
    }

  ngOnInit() {
    this.role = this.user.userDetails.role;
    this.getAllVendors();
    const urlTree: UrlTree = this.router.parseUrl(this.router.url);
    const segmentGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    const urlSegment: UrlSegment[] = segmentGroup.segments;
    this.routeSegmentId = urlSegment[urlSegment.length - 1].path;
    if (this.userModules) {

      const currentModule = this.userModules.filter(module => module.modulename.toLowerCase() === 'dashboard' && module.resources.filter(resource => resource.resourcename.toLowerCase() === 'approvals').length > 0);
      if (currentModule.length > 0) {
        const dashBoardModule = this.userModules.filter(module => module.modulename.toLowerCase() === 'dashboard' && module.resources.filter(resource => resource.resourcename.toLowerCase() === 'dashboard').length > 0);
        this.showBack = dashBoardModule.length > 0 && dashBoardModule[0].resources[0].permissions.length > 0 ? true : false;
        const currentResource = currentModule[0].resources.filter(resource => resource.resourcename.toLowerCase() === 'approvals');
        this.permissions = new RoleAuth(currentResource[0].permissions);
        if (this.permissions.read) {
          this.getAllUsers();
          if (this.dashboardService.resumePage.approvals.searchText.trim() !== '') {
            this.filterRole(this.dashboardService.resumePage.approvals.searchText);
            this.dashboardService.resumePage.approvals.searchText = '';
          }
        }
      }
    }
  }

  vendorSelect(data) {
    this.vendor = data;
    if(data === 'all'){
      console.log('selected - all');
      this.vendor = undefined;
    } else {
      console.log('selected - ',data);
      
    }
    this.getAllUsers()
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

  /* filter the roles based on search input */
  filterRole(searchText: string) {
    this.pageData.searchText = searchText;
    this.pageData.pageNumber = 1;
    this.pageData.totalItems = 0;
    this.getAllUsers();
  }
 
  /* get all users */
  getAllUsers(hideError?: boolean) {
    console.log('call here');
    this.pageData.vendor = this.vendor
    this.sharedService.display(true);
    this.dashboardService.post('users/approval', this.pageData).subscribe((response) => {
      if (response.success === true) {
        this.allApprovalList = response.payload.users;
        console.log('filled---->', this.allApprovalList);  
        this.pageData.totalItems = response.payload.totalUsers;
      }
      this.sharedService.display(false);
    }, (err) => {
      this.allApprovalList = [];
      console.log('empty here--------->', this.allApprovalList); 
      this.sharedService.display(false);
      this.resetPage();
      // if(!hideError){
      //   this.showError(err);
      // }
    });
  }

  /* reset data */
  resetPage() {
    console.log('page reset before ----------->',this.allApprovalList);
    this.allApprovalList = [];
    this.pageData.totalItems = 0;
    console.log('page reset after----------->',this.allApprovalList);
  }





  /* when the checkbox value changes */
  onCheckboxChange(userIndex: number, $event?: any) {
    const allUserCount = this.allApprovalList.length;
    if (userIndex < 0) {
      this.allApprovalList.forEach(user => {
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
      if (this.allApprovalList[userIndex].isDelete) {
        this.deletableUsers.push(this.allApprovalList[userIndex].userid.toLowerCase());
      } else {
        this.deletableUsers = this.deletableUsers.filter(usr => usr.toUpperCase() !== this.allApprovalList[userIndex].userid.toUpperCase());
      }
      this.selectAll = ((this.allApprovalList.filter(user => user.isDelete === true)).length === allUserCount) ? true : false
    }
    // this.isUserSelected = ((this.allApprovalList.filter(user => user.isDelete === true)).length > 0) ? true : false
  }

  approveOrReject(isApprove: boolean, user: string) {
    let userData = {
      email: user['email']
    }
    if (isApprove) {
      userData['approved'] = true;
    } else {
      userData['rejected'] = true;
    }
    this.sharedService.display(true);
    this.dashboardService.post('user/approve', userData).subscribe((response) => {
      if (response.success === true) {
        this.snackBar.open(response.hasOwnProperty('message') ? response.message : 'User Approved Successfully', '', window['snackBarConfig']);
        this.getAllUsers(true);
      }
      this.sharedService.display(false);
    }, (err) => {
      this.sharedService.display(false);
      this.showError(err);
    });
  }

  confirmApproveOrReject(isApprove: boolean, user: string) {
    let action = isApprove ? 'Approve' : 'Reject';

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title: action,
        message: `Are you sure to ${action} "${user['firstname']} ${user['lastname']}" ?`,
        userData: user,
        buttonLableSubmit: 'Yes',
        buttonLableCancel: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.approveOrReject(isApprove, user);
      } else {
        this.getAllUsers();
      }
    });
  }

  setCurrentPageNumber(event) {
    this.pageData.pageNumber = event;
    this.getAllUsers();
    this.selectAll = false;
    // this.isUserSelected = false;
    // this.onCheckboxChange(-1);
  }

  showError(err) {
    this.snackBar.open((err.hasOwnProperty('error') && err.error.hasOwnProperty('message')) ? err.error.message : 'Server Error', '', window['snackBarConfig']);
  }

  dashboard() {
    this.router.navigate(['dashboard']);
  }
}
