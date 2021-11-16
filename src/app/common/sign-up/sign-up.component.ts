import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SessionStorage } from 'ngx-webstorage';
import { AppCommonService } from '../app-common.service';
import { Auth, UpdateSession, SignUp } from 'src/app/utils/models/';
import { patternValidators } from 'src/app/utils/validators';
import { ConfirmationComponent } from 'src/app/utils/components/confirmation/confirmation.component';
import { ValidateInputDirective } from 'src/app/utils/directives/validate-input.directive';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../login/login.component.scss'],
  providers: [ ValidateInputDirective ]
})

export class SignUpComponent implements OnInit {
  @SessionStorage('auth') public authToken: Auth = new Auth();
  @SessionStorage('wdw') public tabName: any;
  @SessionStorage('mod') public myModules: any;
  public sessionObj: UpdateSession = new UpdateSession();
  public signUpData = new SignUp();
  public signUpForm: FormGroup;
  public showPassword = false;

  constructor(
    private appCommonService: AppCommonService,
    public formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.signUpForm = this.formBuilder.group({
      firstname: [this.signUpData.firstName, [Validators.required]],
      lastname: [this.signUpData.lastName, [Validators.required]],
      email: [this.signUpData.email, [Validators.required, Validators.pattern(patternValidators().emailIdRegExp)]],
      mobile: [this.signUpData.mobileNumber, [Validators.required]]
    });
  }

  ngOnInit() {
  }

  /* To show or hide the password by changing input type to 'text' to 'password' and vice-versa */
  toggleInputType() {
    this.showPassword = !this.showPassword;
  }

  /**
   * @method - does the service call for user authentication
   */
  onSignUp() {
    this.appCommonService.post('register', this.signUpForm.value).subscribe(response => {
      if (response.success === true) {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
          autoFocus: false,
          disableClose: true,
          panelClass: 'confirm-delete-dialog',
          backdropClass: 'confirm-delete-backdrop',
          data: {
            title: 'Sign Up',
            message: '',
            buttonLableSubmit: 'Okay',
            buttonLableCancel: ''
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.router.navigateByUrl('login');
        });
      }
    }, (err => {
      this.snackBar.open(err.hasOwnProperty('error') ? err.error.message : 'Could not connect to server', 'okay', window['snackBarConfig']);
    }));



  }

}
