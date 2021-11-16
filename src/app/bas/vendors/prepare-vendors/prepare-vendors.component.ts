import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorsService } from '../vendors.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/utils/services';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'bas-prepare-vendors',
  templateUrl: './prepare-vendors.component.html',
  styleUrls: ['./prepare-vendors.component.scss']
})
export class PrepareVendorsComponent implements OnInit {
  public vednorForm: FormGroup;
  public vendorId = '';
  public canNavigate = true;

  constructor(private vendorService: VendorsService,
    public formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    public snackBar: MatSnackBar,
    public activatedRoute: ActivatedRoute,
  ) {
    this.vednorForm = this.formBuilder.group({
      organizationname: ['', [Validators.required]],
      domainname: ['', [Validators.required]],
      contactperson: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.vendorId) {
      this.vendorId = this.activatedRoute.snapshot.params.vendorId;
    }
    if (this.vendorId) {
      this.getUserDetails();
    }
  }

  getUserDetails() {
    this.vendorService.get(`vendor/${this.vendorId}`).subscribe(res => {
      if (res.success = true) {
        this.vednorForm.patchValue(res.message);
        Object.keys(this.vednorForm.controls).forEach(ctrl => {
          this.vednorForm.get(ctrl).markAsTouched();
        });
      }
    }, err => {
      this.showError(err);
    })
  }

  /* show the navigation confirmation before navigating with unsaved data */
  canDeactivate() {
    return (this.vednorForm.dirty && this.canNavigate);
  }

  onSubmit() {
    this.canNavigate = false;
    let vendorData = this.vednorForm.value;
    this.sharedService.display(true);
    if (this.vendorId) {
      this.vendorService.put(`vendor/${this.vendorId}`, vendorData).subscribe(res => {
        this.sharedService.display(false);
        if (res.success === true) {
          this.handleSuccessResponse();
        }
      }, (err) => {
        this.showError(err);
      });
    } else {
      this.vendorService.post('vendor', vendorData).subscribe(res => {
        this.sharedService.display(false);
        if (res.success === true) {
          this.handleSuccessResponse();
        }
      }, (err) => {
        this.showError(err);
      });
    }
  }

  handleSuccessResponse() {
    this.sharedService.display(false);
    const successMessage = this.vendorId ? 'Vendor Details updated successfully' :
      'Vendor details created successfully';
    this.snackBar.open(successMessage, '', window['snackBarBottom']);
    this.router.navigateByUrl('/manage-vendors/vendors');
  }

  onCancel() {
    // this.usersService.currentSelectedTab = 'Roles';
    this.router.navigate(['/manage-vendors/vendors']);
  }
  /* error handler - show error message in the snackbar */
  showError(error: any) {
    this.sharedService.display(false);
    this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message :
      window['serverError'], 'okay', window['snackBarBottom']);
  }

  goBacktoList() {
    this.router.navigate(['manage-vendors/vendors']);
  }
}
