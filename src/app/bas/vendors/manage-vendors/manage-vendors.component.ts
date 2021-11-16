import { Component, OnInit } from '@angular/core';
import { VendorsService } from '../vendors.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaginationClass, PaginationControl, RoleAuth } from 'src/app/utils/models';
import { SharedService } from 'src/app/utils/services';
import { VendorDetails } from 'src/app/utils/models/vendors.model';
import { SessionStorage } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/utils/components';
import { MatSnackBar, MatDialog } from '@angular/material';

@Component({
  selector: 'bas-manage-vendors',
  templateUrl: './manage-vendors.component.html',
  styleUrls: ['./manage-vendors.component.scss']
})
export class ManageVendorsComponent implements OnInit {
  @SessionStorage('mod') public modules: any;
  @SessionStorage('vendor') public vendorDetails: any;

  public pageData = new PaginationClass({ pageSize: 10, sort: { createddate: -1 } });
  public searchForm: FormGroup;
  public pageControl = new PaginationControl();
  public permissions = new RoleAuth([]);
  public allVendorList = [];
  public deletableUsers = [];

  constructor(
    private vendorService: VendorsService,
    public formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.searchForm = this.formBuilder.group({
      searchText: ['']
    });
  }

  ngOnInit() {
    this.vendorDetails = ''
    this.checkModulePermissions();
  }

  /* check module permissions */
  checkModulePermissions() {
    if (this.modules) {
      const currentModule = this.modules.filter(module => module.modulename.toLowerCase() === 'vendors' && module.resources.filter(resource => resource.resourcename.toLowerCase() === 'vendors').length > 0);
      if (currentModule.length > 0) {
        let currentResource = currentModule[0].resources.filter(resource => resource.resourcename.toLowerCase() === 'vendors');
        this.permissions = new RoleAuth(currentResource[0].permissions);
        

        if (this.permissions.read) {
          this.getAllVendors();
        }
      }
    }
  }

  /* Get the vendor list */
  getAllVendors() {
    this.sharedService.display(true);
    this.pageData.searchText = this.searchForm.value.searchText;
    this.vendorService.post('vendors', this.pageData).subscribe(res => {
      if (res.success === true) {
        this.allVendorList = [];
        res.message.Vendors.forEach((user) => {
          this.allVendorList.push(new VendorDetails(user));
        });
        this.pageData.totalItems = res.message.totalVendors;
        this.sharedService.display(false);
      } else {
        this.resetPage();
      }
    }, err => {
      this.resetPage();
    })
  }


  /* reset data */
  resetPage() {
    this.sharedService.display(false);
    this.allVendorList = [];
    this.pageData.totalItems = 0;
  }

  /* set current page number */
  setCurrentPageNumber(event) {
    this.pageData.pageNumber = event;
    this.getAllVendors();
  }

  /* ask for confirmation before deleting the selected users */
  confirmDeletion(user, isBulkDelete: boolean) {
    const selectedUserCount = (this.allVendorList.filter(user => user.isDelete === true)).length;
    let confirmMsg = `Are you sure to delete "${user.organizationname}" ?`;
    if (isBulkDelete) {
      confirmMsg = `Are you sure to delete ${this.deletableUsers.length} vendors?`
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title: `Delete Vendor${isBulkDelete ? 's' : ''}`,
        message: confirmMsg
      }
    });

    dialogRef.afterClosed().subscribe((status: Boolean) => {
      if (status) {
        
        if (isBulkDelete) {
          // this.deleteBulkUsers();
        } else {
          this.deleteSingleUser(user);
        }
      }
    });
  }


  /* delete users */
  deleteSingleUser(user) {
    this.sharedService.display(true);
    this.vendorService.delete(`vendor/delete/${user.id}`).subscribe(response => {
      this.sharedService.display(false);
      if (response.success === true) {
        this.snackBar.open(`Vendor has been deleted successfully.`, '', window['snackBarBottom']);
        this.deletableUsers = [];
        this.getAllVendors();
      }
    }, (error => {
      this.showError(error);
    }));
  }


  /* ask for confirmation before archive the user */
  confirmEnable(user) {    
    let statusMessage = `Do you want to ${(user.deleted ? 'Disable' : 'Enable')} "${user.organizationname}" ?`;
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title: user.deleted ? 'Disable Vendor' : 'Enable Vendor',
        message: statusMessage,
        buttonLableSubmit: user.deleted ? 'Disable' : 'Enable'
      }
    });
    
    dialogRef.afterClosed().subscribe((status: Boolean) => {

      if (status && user.deleted) {
        this.activeVendor(user);
      } else if (status && !user.deleted) {
        this.activeVendor(user);
      } else {
        user.deleted = !user.deleted;
      }
    });
  }

  activeVendor(user) {
    const id = user.id;
    delete user['id'];
    delete user['totalAssociates'];
    this.vendorService.delete(`vendor/${id}`).subscribe(res => {
      if (res.success === true) {
        this.handleSuccessResponse();
      }
    }, (err) => {
      this.showError(err);
    });
  }

  downloadVendorReport(){
    this.vendorService.fileDownload('vendor/download', {}).subscribe(res => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', `vendor.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  handleSuccessResponse() {
    this.sharedService.display(false);
    const successMessage = 'Vendor is Active';
    this.snackBar.open(successMessage, '', window['snackBarBottom']);
    this.router.navigateByUrl('/manage-vendors/vendors');
  }
  /* search api on 'ENTER' or reset on clear searchbox */
  onSearch(evnt) {
    if ((evnt && (evnt.keyCode && evnt.keyCode === 13 || evnt.target.value.trim() === ''))) {
      this.pageData.searchText = evnt.target.value;
      this.getAllVendors();
    }
  }

  /* naviage to vendor update page */
  navigatetoEditPage(id: String) {
    this.router.navigate([`/manage-vendors/vendors/update-vendor/${id}`]);
  }

  /* naviage to add vendor page */
  addVendor() {
    this.router.navigate(['/manage-vendors/vendors/create-vendor']);
  }

  vendorUser(id: String) {
    this.router.navigate([`/manage-vendors/vendors/${id}`]);
  }

  /* error handler - show error message in snackbar */
  showError(error: any) {
    this.sharedService.display(false);
    this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message : window['serverError'], '',
      window['snackBarBottom']);
  }
}
