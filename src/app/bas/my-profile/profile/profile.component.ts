import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyProfileService } from '../my-profile.service';
import { SharedService } from 'src/app/utils/services';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { patternValidators } from 'src/app/utils/validators';
import { SessionStorage } from 'ngx-webstorage';
import { Auth } from 'src/app/utils/models';

@Component({
  selector: 'bas-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../change-password/change-password.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  @SessionStorage('auth') public authDetails;
  public saveAuthDetails: any;


  constructor(
    public formBuilder: FormBuilder,
    private myProfileService: MyProfileService,
    public sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    // initialize the form
    this.profileForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(patternValidators().mobileNumberRegExp)]]
    }
    );
    this.saveAuthDetails = this.authDetails;
  }

  ngOnInit() {
    this.bindUserDetails();
  }

  bindUserDetails() {
    this.profileForm.patchValue(this.authDetails.userDetails);
  }
  updateProfile() {
    debugger
    this.authDetails.userDetails.firstname = this.profileForm.value.firstname;
    this.authDetails.userDetails.lastname = this.profileForm.value.lastname;
    this.authDetails.userDetails.mobile = this.profileForm.value.mobile;
    this.authDetails = new Auth(this.authDetails)
    // this.authDetails = JSON.stringify(this.saveAuthDetails)
    const obj = {
      firstname: this.profileForm.value.firstname,
      lastname: this.profileForm.value.lastname,
      mobile: this.profileForm.value.mobile,
      email: this.authDetails.userDetails.email,
      role: this.authDetails.userDetails.role
    }


    this.myProfileService.put(`user/${this.authDetails.userDetails.id}`, obj).subscribe(response => {


      if (response.success === true) {
        this.handleSuccessResponse();
      }
    }, (error => {
      this.showError(error);
    }));
  }

  handleSuccessResponse() {
    const successMessage = 'Profile Details updated successfully';
    this.snackBar.open(successMessage, '', window['snackBarBottom']);
  }

  /* error handler - show error message in the snackbar */
  showError(error: any) {
    this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message :
      window['serverError'], 'okay', window['snackBarBottom']);
  }
}
