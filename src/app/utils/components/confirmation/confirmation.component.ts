import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/bas/users/users.service';
import { VendorCreateUser } from '../../models/vendors.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { patternValidators } from '../../validators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  public buttonLableSubmit = 'Delete';
  public buttonLableCancel = 'Cancel';
  public selectVendor = false;
  public slectConfirmation = true;
  public vendorCollections = [];
  public userForm: FormGroup;
  public userID: string;
  constructor(
    private dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userService: UsersService,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    this.buttonLableSubmit = data.hasOwnProperty('buttonLableSubmit') ? data.buttonLableSubmit : this.buttonLableSubmit;
    this.buttonLableCancel = data.hasOwnProperty('buttonLableCancel') ? data.buttonLableCancel : this.buttonLableCancel;
    this.userForm = this.formBuilder.group({
      userName: ['',],
      firstname: ['',],
      lastname: ['',],
      reporting_manager: [''],
      email: [''],
      mobile: ['',],
      role: ['',],
      vendor: [undefined, [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.data.title === 'Approve') {
      if (this.data.userData) {
        if (this.data.userData.vendor) {
          this.selectVendor = false;
          this.slectConfirmation = true;
        } else {
          this.data.userData.email = this.data.userData.email.toLowerCase();
          if (this.data.userData.email.includes('@amazon.com')) {
            this.selectVendor = false;
            this.slectConfirmation = true;
          } else {
            this.selectVendor = true;
            this.slectConfirmation = false;
            this.userForm.patchValue(this.data.userData);
            this.userID = this.data.userData._id;
            this.searchVendor();
          }
        }
      }
    }
  }

  /* Pass the status: TRUE or FALSE
   status: TRUE to close the modal 
   status: FALSE to avoid the closing of dialog 
   */
  closeModal(status: boolean) {
    this.dialogRef.close(status);
  }


  searchVendor() {
    this.vendorCollections = [];
    this.userService.get('vendor').subscribe(res => {
      res.message.forEach(element => {
        this.vendorCollections.push(new VendorCreateUser(element));
      });
    });
  }

  onSubmit() {

    let userData = Object.assign({}, this.userForm.value);

    if (userData.vendor) {
      userData['vendor'] = userData.vendor.id;
    }
    delete userData['userName'];
    if (this.userID) {
      // delete userData.password;
      this.userService.put(`user/${this.userID}`, userData).subscribe(response => {
        if (response.success === true) {

          this.handleSuccessResponse();
          this.selectVendor = false;
          this.slectConfirmation = true;
        }
      }, (error => {
        this.showError(error);
      }));
    }
  }

  handleSuccessResponse() {
    const successMessage = this.userID ? 'User Details updated successfully' :
      'User details created successfully';
    this.snackBar.open(successMessage, '', window['snackBarBottom']);
  }

  /* error handler - show error message in the snackbar */
  showError(error: any) {
    this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message :
      window['serverError'], 'okay', window['snackBarBottom']);
  }
}
