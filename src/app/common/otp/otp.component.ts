import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppCommonService } from '../app-common.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss', '../login/login.component.scss']
})
export class OtpComponent implements OnInit, AfterViewInit {
  @ViewChild('otp3', { static: false }) private otp3: any;
  public otpForm: FormGroup;
  public userEmail = '';
  private backspaceCounter = 0;

  constructor(
    private appCommonService: AppCommonService,
    public formBuilder: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.otpForm = this.formBuilder.group({
      otp1: ['', [Validators.required]],
      otp2: ['', [Validators.required]],
      otp3: ['', [Validators.required]],
      otp4: ['', [Validators.required]],
      userid: this.appCommonService.getData('userid')
    });
    this.userEmail = this.appCommonService.getData('email');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // to disable the otp fields except the first field
    this.otp3.nativeElement.disabled = true;
    this.otp3.nativeElement.previousSibling.disabled = true;
    this.otp3.nativeElement.nextSibling.disabled = true;
  }

  /**
   * @method - to validate the OTP
   */
  otpSubmit() {
    const otp = {
      otp: (this.otpForm.value.otp1 + this.otpForm.value.otp2 + this.otpForm.value.otp3 + this.otpForm.value.otp4),
      userid: this.appCommonService.getData('email')
    };

    this.appCommonService.post('otp/verify', otp).subscribe(response => {
      if ((response.success === true && response.payload.signature)) {
        this.appCommonService.setData('signature', response.payload.signature);
        this.router.navigateByUrl('/change-password');
      } else {
        // this.resetOtpFields();
        this.snackBar.open('Invalid OTP', 'okay', window['snackBarConfig']);
      }
    }, (err => {
      // this.resetOtpFields();
      this.snackBar.open(err.hasOwnProperty('error') ? err.error.message : window['serverError'], 'okay', window['snackBarConfig']);
    }));
  }

  /**
   * @method - request to resend the OTP
   */
  resendOTP() {
    this.appCommonService.post('forgotpassword', { userid: this.appCommonService.getData('email') }).subscribe(response => {
      if (response.success === true) {
        this.snackBar.open('Verification Code has been sent to "' + this.appCommonService.getData('email') + '"', 'okay', window['snackBarConfig']);
        this.resetOtpFields();
      }
    }, (err => {
      this.snackBar.open(err.hasOwnProperty('error') ? err.error.message : window['serverError'], 'okay', window['snackBarConfig']);
    }));
  }

  /**
 * @method - to reset the otp fields
 */
  resetOtpFields() {
    this.otpForm.patchValue({
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
    });
  }

  // To handle the focusing on input
  @HostListener('document:keyup', ['$event'])
  handleInputFocus(event: any) {
    // keycodes
    // BACKSPACE - 8, LEFT ARROWS - 37
    // ZERO - 48, 96, NINE - 57, 105, RIGHT ARROW -39, TAB - 9
    this.backspaceCounter = event.keyCode === 8 ? ++this.backspaceCounter : 0;
    if ((event.keyCode === 8 && this.backspaceCounter === 2) || event.keyCode === 37) {
      const previousElement = event.srcElement.previousElementSibling;
      // check if previousElement exists
      if (previousElement !== null) {
        previousElement.focus();
        if (event.keyCode === 8 && this.backspaceCounter === 2) {
          this.backspaceCounter = 1;
          previousElement.value = '';
          event.srcElement.disabled = true;
        } else {
          this.backspaceCounter = 0;
        }
      }
    } else if ((event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey && event.target.value !== '') ||
      (event.keyCode >= 96 && event.keyCode <= 105 && !event.metaKey) || event.keyCode === 39) {
      // get the sibling element
      const nextElement = event.srcElement.nextElementSibling;
      if (nextElement !== null) {
        nextElement.disabled = false;
        nextElement.focus();
      }
    }
  }

  // To allow only required keys
  @HostListener('document:keydown', ['$event'])
  allowOnlyNumers(event: any) {
    // keycode
    // ZERO - 48, 96, NINE - 57, 105, DELETE - 46, 110, BACKSPACE - 8, TAB - 9, LEFT ARROWS - 37, RIGHT ARROW -39
    if (!((event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey) ||
      (event.keyCode >= 96 && event.keyCode <= 105 && !event.metaKey) ||
      event.keyCode === 37 && event.keyCode === 39 ||
      event.keyCode === 8 || (event.keyCode === 9 && event.value === '') || event.keyCode === 46 || event.keyCode === 110)) {
      return false;
    }
  }

}
