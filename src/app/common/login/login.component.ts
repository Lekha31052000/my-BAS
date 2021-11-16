import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { AppCommonService } from '../app-common.service';
import { Auth, UpdateSession } from 'src/app/utils/models/';
import { patternValidators } from 'src/app/utils/validators';
import { SharedService } from 'src/app/utils/services';
import { ReportingManagerDialogComponent, ConfirmationComponent } from 'src/app/utils/components';
import { DialogComponent } from 'src/app/bas/my-profile/dialog/dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../layout/layout.component.scss']
})
export class LoginComponent implements OnInit {
  @SessionStorage('auth') public authToken: Auth = new Auth();
  @SessionStorage('wdw') public tabName: any;
  @SessionStorage('mod') public myModules: any;
  public sessionObj: UpdateSession = new UpdateSession();
  public loginForm: FormGroup;
  public showPassword = false;
  public siteKey = environment.siteKey;
  constructor(
    private appCommonService: AppCommonService,
    private sharedService: SharedService,
    private sessionStorageService: SessionStorageService,
    public formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(patternValidators().emailIdRegExp)]],
      password: ['', [Validators.required]],
      recaptcha: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // clear all the session storage data
    this.sessionStorageService.clear();
    sessionStorage.clear();
  }

  /* To show or hide the password by changing input type to 'text' to 'password' and vice-versa */
  toggleInputType() {
    this.showPassword = !this.showPassword;
  }

  /* service call for user authentication */
  onLogin() {
    const loginData = this.loginForm.value;
    delete loginData['recaptcha']
    this.sharedService.display(true);
    this.appCommonService.post('login', loginData).subscribe(response => {
      if (response.success === true) {
        this.authToken = new Auth(response.payload);
        // assigning unique id to current browser tab
        this.tabName = window.name = `${this.authToken.token}-${new Date().getTime()}`;
        this.createSession();
      } else {
        this.sharedService.display(false);
      }
    }, (err => {
      this.sharedService.display(false);
      this.snackBar.open(err.hasOwnProperty('error') ? err.error.message : 'Could not connect to server', '', window['snackBarConfig']);
    }));
  }

  /* update session data */
  createSession() {
    this.sessionObj.token = this.authToken.token;
    this.sessionObj.type = this.authToken.tokenType;
    // this.sessionObj.userid = this.authToken.userDetails.userid;
    this.sessionObj.email = this.authToken.userDetails.email;
    this.sessionObj.platform = 'web';
    this.updateSession();
  }

  /* to update session */
  updateSession() {
    this.appCommonService.put('session/log', this.sessionObj).subscribe((response) => {
      if (response.success) {
        this.getModuleRoute();
      }
    }, (err) => {
      this.snackBar.open(err.hasOwnProperty('error') ? err.error.message : window['serverError'], '', window['snackBarConfig']);
    });
  }

  /* get the module details available for the login user and route accordingly */
  getModuleRoute() {
    // to get the routing details
    this.appCommonService.get('users/modules').subscribe((response) => {
      this.sharedService.display(false);
      if (response.success && response.payload.length > 0) {
        this.myModules = response.payload;

        // uncomment this once the apis are available
        // show the reporting manager dialog/prompt if the reporting manager is not updated
        // if (this.authToken && this.authToken.userDetails && 
        //   (this.authToken.userDetails.role !== 'superadmin' && this.authToken.userDetails.role !== 'admin') &&
        //   this.authToken.userDetails.hasOwnProperty('reporting_manager') && !this.authToken.userDetails.reporting_manager) {
        //   this.showManagerPrompt();
        // } else 
        if (this.authToken && this.authToken.userDetails && this.authToken.userDetails.hasOwnProperty('passwordreset') && this.authToken.userDetails.passwordreset === true) {
          // show the password reset page on first login or if the default password is not set
          this.navigatePage(false);
          this.sharedService.dialogRef = this.dialog.open(DialogComponent, {
            autoFocus: false,
            disableClose: true,
            panelClass: 'pwd-reset-dialog',
            backdropClass: 'confirm-delete-backdrop',
          });
        } else {
          this.navigatePage(true);
        }
      } else {
        // when the modules is empty
        this.snackBar.open('You do not have access to any modules.', '', window['snackBarConfig']);
      }
    }, (err) => {
      this.sharedService.display(false);
      this.snackBar.open(err.hasOwnProperty('error') ? err.error.message : window['serverError'], '', window['snackBarConfig']);
    });
  }

  /* Navigate to initial/home page */
  navigatePage(canNavigate?: boolean) {
    const routingList = this.appCommonService.getRoutingData();
    // filter the modules which has some permissions
    let initialModule = this.myModules.filter(module => module.resources.length && (module.resources.filter(rsc => rsc.permissions.length)).length);
    if (initialModule.length) {
      const filteredModule = routingList.filter(routingData => routingData.module_name.toLowerCase() ===
        initialModule[0].modulename.toLowerCase());
      this.sharedService.landingPage = filteredModule[0].routerLink;
      if (canNavigate) {
        this.router.navigate([filteredModule[0].routerLink]);
      }
    }
  }

  /* show the reporting manager dialog/prompt if the reporting manager is not updated */
  showManagerPrompt() {
    this.appCommonService.get('users').subscribe((res) => {
      if (res.success) {
        const dialogRef = this.dialog.open(ReportingManagerDialogComponent, {
          autoFocus: false,
          disableClose: true,
          panelClass: 'confirm-delete-dialog',
          backdropClass: 'confirm-delete-backdrop',
          data: {
            managerList: [
              { name: 'Manager 1' }, { name: 'Manager 2' }, { name: 'Manager 3' }
            ]
          }
        });

        dialogRef.afterClosed().subscribe((status: any) => {
          if (status.hasOwnProperty('selectedManager')) {
            // api call to update user's reporting manager
            this.updateUser(status.selectedManager);
          }
        });
      }
    });

  }

  /* update the reporting manager of the logged in user */
  updateUser(reportingManager) {
    let userData = {
      reporting_manager: reportingManager
    }
    this.appCommonService.put('users/', userData).subscribe((res) => {
      this.navigatePage(true);
    });
  }

}
