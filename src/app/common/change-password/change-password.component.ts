import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ChangePassword } from 'src/app/utils/models/common.model';
import { AppCommonService } from '../app-common.service';
import { patternValidators } from 'src/app/utils/validators';
import { ConfirmationComponent } from 'src/app/utils/components/confirmation/confirmation.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss', '../login/login.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public state$: Observable<object>;
  public changePasswordData = new ChangePassword();
  public changePasswordForm: FormGroup;
  public showNewPassword = false;
  public showConfirmPassword = false;

  constructor(
    public formBuilder: FormBuilder,
    private appCommonService: AppCommonService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.changePasswordForm = this.formBuilder.group({
      signature: [this.appCommonService.getData('signature')],
      password: [this.changePasswordData.password,
      [Validators.required, Validators.pattern(patternValidators().passwordRegExp)]],
      confirmPassword: [this.changePasswordData.confirmPassword,
      [Validators.required, Validators.pattern(patternValidators().passwordRegExp)]]
    }, {
        validator: this.matchPassword('password', 'confirmPassword')
      });
  }

  ngOnInit() {
  }

  /**
   * @method - to match the passwords
   * @param password - actual field
   * @param confirmPassword - field to be matched with actual field
   */
  matchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[password];
      const matchingControl = formGroup.controls[confirmPassword];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== '' && matchingControl.value !== '' && control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  /**
   * @method - does the service call to change the password
   */
  changePasswordSubmit() {
    this.changePasswordData = new ChangePassword(this.changePasswordForm.value);
    delete this.changePasswordData.confirmPassword;

    this.appCommonService.post('resetpassword', this.changePasswordData).subscribe(response => {
      if (response.success === true) {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
          autoFocus: false,
          disableClose: true,
          panelClass: 'confirm-delete-dialog',
          backdropClass: 'confirm-delete-backdrop',
          data: {
            title: 'Change Password',
            message: 'Your Password has been updated. Please login to continue',
            buttonLableSubmit: 'Okay'
          }
        });

        dialogRef.afterClosed().subscribe((status: Boolean) => {
          if (status) {
            this.router.navigate(['./login']);
          }
        });
      }
    }, (err => {
      let errorMessage = window['serverError'];
      // List of errors are recived as array, so combine them to show a single message;
      if (err && err.hasOwnProperty('error') && err.error.hasOwnProperty('errors')) {
        errorMessage = err.error.errors.length > 0 ? '' : 'Error while password reset, please try with different password';
        errorMessage = err.error.errors.join(' ');
      }
      this.snackBar.open(errorMessage, 'okay', window['snackBarConfig']);
    }));
  }

  /**
   * @method - to change the input type from 'text' to 'password' and vice-versa
   * @param status - to identify the input field
   */
  toggleInputType(status: string) {
    switch (status) {
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

}
