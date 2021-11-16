import { Component, OnInit } from '@angular/core';
import { VendorsService } from '../vendors.service';
import { FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/utils/services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PaginationClass, UserDetails, PaginationControl } from 'src/app/utils/models';
import { SessionStorage } from 'ngx-webstorage';

@Component({
  selector: 'bas-manage-vendor-users',
  templateUrl: './manage-vendor-users.component.html',
  styleUrls: ['./manage-vendor-users.component.scss']
})
export class ManageVendorUsersComponent implements OnInit {
  public pageData = new PaginationClass({ pageSize: 10, sort: { createddate: -1 } });
  public pageControl = new PaginationControl();
  public vendorId: string;
  public allUserList = [];
  @SessionStorage('vendor') public vendorDetails: any;

  constructor(private vendorService: VendorsService,
    public formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.vendorId) {
      this.vendorId = this.activatedRoute.snapshot.params.vendorId;
      this.getAllVendors()
    }
  }


  getAllVendors() {
    this.sharedService.display(true);
    // this.pageData.searchText = this.searchForm.value.searchText;
    const obj = {
      pageSize: 10,
      pageNumber: this.pageData.pageNumber,
      filter: {
        vendor: this.vendorId
      }
    }
    this.allUserList = [];
    this.vendorService.post('users/find', obj).subscribe(res => {
      if (res.success === true) {
        this.sharedService.display(false);
        res.payload.users.forEach((user) => {
          this.allUserList.push(new UserDetails(user));
        });
        this.pageData.totalItems = res.payload.totalUsers;
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
    this.allUserList = [];
    this.pageData.totalItems = 0;
  }

  /* set current page number */
  setCurrentPageNumber(event) {
    this.pageData.pageNumber = event;
    this.getAllVendors();
  }

  vendorAssociates(id) {
    this.vendorDetails = this.vendorId;
    this.router.navigate([`manage-vendors/vendors/users/${id}`])
  }

  goBacktoList() {
    this.router.navigate(['manage-vendors/vendors']);
  }
}
