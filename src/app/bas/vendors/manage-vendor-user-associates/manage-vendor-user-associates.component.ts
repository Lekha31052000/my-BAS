import { Component, OnInit } from '@angular/core';
import { PaginationClass, PaginationControl, UserDetails, PaginationClassAssociate } from 'src/app/utils/models';
import { FormBuilder } from '@angular/forms';
import { VendorsService } from '../vendors.service';
import { SharedService } from 'src/app/utils/services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SessionStorage } from 'ngx-webstorage';
import { AssociateDetails } from 'src/app/utils/models/vendors.model';

@Component({
  selector: 'bas-manage-vendor-user-associates',
  templateUrl: './manage-vendor-user-associates.component.html',
  styleUrls: ['./manage-vendor-user-associates.component.scss']
})
export class ManageVendorUserAssociatesComponent implements OnInit {
  public pageData = new PaginationClassAssociate({ pageSize: 10, sort: { createddate: -1 } });
  public pageControl = new PaginationControl();
  public vendorId: string;
  public allUserList = [];
  public pagination = {
    limit: this.pageData.pageSize,
    offset: 0,
    searchText: ''
  }
  @SessionStorage('auth') public user;
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
      this.getAllVendorAssociates();
    }
  }


  getAllVendorAssociates() {
    this.sharedService.display(true);
    this.allUserList = [];
    this.vendorService.get(`associates/transactions?createdBy=${this.vendorId}&limit=${this.pageData.pageSize}&offset=${this.pagination.offset}`, true).subscribe(res => {
      if (res.data.length > 0) {
        this.sharedService.display(false);
        res.data.forEach((user) => {
          this.allUserList.push(new AssociateDetails(user));

        });
        this.pageData.totalItems = res.total;
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
    this.pagination.offset = Number(event - 1);
    this.getAllVendorAssociates();
  }

  goBacktoList() {
    this.router.navigate([`manage-vendors/vendors/${this.vendorDetails}`]);
  }
}
