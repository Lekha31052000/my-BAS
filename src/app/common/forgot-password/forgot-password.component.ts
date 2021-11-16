import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/utils/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppCommonService } from '../app-common.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { patternValidators } from 'src/app/utils/validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../login/login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public userData = new Login();
  public forgotPasswordForm: FormGroup;
  
  constructor(
    public formBuilder: FormBuilder,
    private appCommonService: AppCommonService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [this.userData.email, [Validators.required, Validators.pattern(patternValidators().emailIdRegExp)]]
    });
   }

  ngOnInit() {
  }

  /**
   * @method - send the user email to which OTP has to be sent
   */
  forgotPasswordSubmit() { 
    const userData = {
      userid: this.forgotPasswordForm.value.email,
      // email: this.forgotPasswordForm.value.email
    }
    this.appCommonService.post('forgotpassword', userData)
      .subscribe(response => {        
        if (response.success === true) {
          this.appCommonService.setData('email', this.forgotPasswordForm.value.email);
          // const successMessage = response.payload.hasOwnProperty('message') ? response.payload.message : 'OTP Sent Successfully';
          this.snackBar.open(`Verification Code has been sent to "${response.payload.email}"`, 'okay', window['snackBarConfig']);
          this.appCommonService.setData('email', response.payload.email);
          this.router.navigate(['/otp']);
        }
      }, (err => {
        this.snackBar.open(err.hasOwnProperty('error') ? err.error.message : window['serverError'], 'okay', window['snackBarConfig']);
      }));
  }

}
