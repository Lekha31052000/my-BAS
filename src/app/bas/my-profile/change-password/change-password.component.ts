import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MyProfileService } from '../my-profile.service';
import { patternValidators } from 'src/app/utils/validators';
import { ConfirmationComponent } from 'src/app/utils/components/confirmation/confirmation.component';
import { SessionStorage } from 'ngx-webstorage';
import { RoleAuth } from 'src/app/utils/models';
import { SharedService } from 'src/app/utils/services';

@Component({
  selector: 'bas-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @SessionStorage('auth') private authToken;
  @SessionStorage('uId') private viewableUser: any;
  @SessionStorage('pStatus') public isResetPassword: any;
  @SessionStorage('mod') public modules: any;
  public changePasswordForm: FormGroup;
  public permissions = new RoleAuth([]);
  public isInitialReset = false;
  public showOldPassword = false;
  public showNewPassword = false;
  public showConfirmPassword = false;
  public canNavigate = true;

  constructor(
    public formBuilder: FormBuilder,
    private myProfileService: MyProfileService,
    public sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // initialize the form
    this.changePasswordForm = this.formBuilder.group({
      email: [((this.authToken && this.authToken.userDetails && this.authToken.userDetails.email) ? this.authToken.userDetails.email : '')],
      oldpassword: ['',
        [Validators.required]],
      newpassword: ['',
        [Validators.required, Validators.pattern(patternValidators().passwordRegExp)]],
      confirmPassword: ['',
        [Validators.required, Validators.pattern(patternValidators().passwordRegExp)]]
    }, {
        validator: this.validatePassword('oldpassword', 'newpassword', 'confirmPassword')
      }
    );

    if (this.authToken && this.authToken.userDetails && this.authToken.userDetails.hasOwnProperty('passwordreset')) {
      this.isInitialReset = this.authToken.userDetails.passwordreset;
    }
  }

  /* ask for confirmation before navigating with unsaved data */
  canDeactivate() {
    return this.changePasswordForm.dirty && this.canNavigate;
  }

  /**
   * @param unMatchCtrl - actual field
   * @param actualCtrl - actual field
   * @param matchCtrl - field to be matched with actual field
   */
  validatePassword(unMatchCtrl: string, actualCtrl: string, matchCtrl: string) {
    return (formGroup: FormGroup) => {

      const control = formGroup.controls[actualCtrl];
      const unMatchControl = formGroup.controls[unMatchCtrl];
      const matchControl = formGroup.controls[matchCtrl];

      if (matchControl.errors && !matchControl.errors.mustMatch && control.errors && !control.errors.mustNotMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on unMatchControl if validation fails
      if (control.value !== '' && unMatchControl.value !== '' && control.value === unMatchControl.value) {
        control.setErrors({ mustNotMatch: true });
      } else {
        control.setErrors(null);
        // control.setErrors({ mustNotMatch: false });
      }
      if (control.value !== '' && matchControl.value !== '' && control.value !== matchControl.value) {
        matchControl.setErrors({ mustMatch: true });
      } else {
        matchControl.setErrors(null);
      }
    }
  }

  /* toggle the input type from 'text' ro 'password' and vice-versa */
  toggleInputType(status: string) {
    switch (status) {
      case 'old':
        this.showOldPassword = !this.showOldPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  /* service call for password update */
  upadatePassword() {
    // let changePasswordData = this.changePasswordForm.value;
    // delete changePasswordData.confirmPassword;
    let changePasswordData = {
      old_password: this.changePasswordForm.value.oldpassword,
      email: this.changePasswordForm.value.email,
      password: this.changePasswordForm.value.newpassword
    };

    this.myProfileService.post('changepassword', changePasswordData).subscribe(response => {
      if (response.success === true) {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
          autoFocus: false,
          disableClose: true,
          panelClass: 'confirm-delete-dialog',
          backdropClass: 'confirm-delete-backdrop',
          data: {
            title: 'Change Password',
            message: `Password has been changed successfully.`,
            buttonLableSubmit: 'Okay',
            buttonLableCancel: ''
          }
        });

        dialogRef.afterClosed().subscribe((status: Boolean) => {
          if (status) {
            this.canNavigate = false;
            if (this.authToken && this.authToken.userDetails && this.authToken.userDetails.hasOwnProperty('passwordreset') && this.authToken.userDetails.passwordreset === true) {
              this.router.navigate([this.sharedService.landingPage]);
              if (this.sharedService.dialogRef) {
                this.sharedService.dialogRef.close();
              }
            } else {
              this.router.navigate(['./login']);
              // window.location.reload();
              // this.changePasswordForm.reset();
            }
          }
        });
      } else {
        this.snackBar.open('Error while updating password.', 'okay', window['snackBarBottom'])
      }
    }, (error => {
      this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message :
        window['serverError'], '', window['snackBarBottom']);
    }));
  }

  /* confirm reset action */
  confirmReset() {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title: 'Reset Password',
        message: `Are you sure to reset ${this.viewableUser.user.name.toUpperCase()}'s  password?`,
        buttonLableSubmit: 'Reset'
      }
    });

    dialogRef.afterClosed().subscribe((status: Boolean) => {
      if (status) {
        this.resetPassword();
      }
    });
  }

  cancelPassword() {
    this.router.navigateByUrl(this.sharedService.landingPage);
  }

  /* api request to reset password */
  resetPassword() {
    let resetData = {
      userid: this.viewableUser.user.userid,
      password: 'Amazon$2019'
    };
    this.myProfileService.put('user', resetData).subscribe(response => {
      if (response.success === true) {
        this.snackBar.open(`${this.viewableUser.user.userid}'s password has been reset successfully.`, 'okay', window['snackBarBottom']);
      }
    }, (error => {
      this.showError(error);
    }));
  }

  /* error handler - shows error message on snackbar */
  showError(error: any) {
    this.snackBar.open(error.error.hasOwnProperty('message') ? error.error.message : window['serverError'], 'okay',
      window['snackBarBottom']);
  }

}
