import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav, MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { AppCommonService } from '../app-common.service';
import { ConfirmationComponent } from 'src/app/utils/components/confirmation/confirmation.component';
import { SessionStorage, SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'ast-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @SessionStorage('auth') public user;
  @SessionStorage('uId') public viewableUser: any;
  @SessionStorage('pStatus') public isResetPassword: any;
  public userName = '';
  public dropDownMenuList = [
    { menu_name: 'My Profile' },
    // { menu_name: 'Change Password' },
    { menu_name: 'Logout' }
  ];

  constructor(
    private router: Router,
    private appCommonService: AppCommonService,
    private sessionStorageService: SessionStorageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userName = (this.user && this.user.userDetails) ? this.user.userDetails.name : '';
  }

  logout(): void {
    this.router.navigate(['']);
  }

  /* Action to be performed on menu items are clicked */
  onMenuClick(menuName: string) {
    switch (menuName) {
      case 'Logout':
        const dialogRef = this.dialog.open(ConfirmationComponent, {
          autoFocus: false,
          disableClose: true,
          panelClass: 'confirm-delete-dialog',
          backdropClass: 'confirm-delete-backdrop',
          data: {
            title: 'Logout',
            message: `Are you sure to Logout ?`,
            buttonLableSubmit: 'Yes',
            buttonLableCancel: 'No'
          }
        });

        dialogRef.afterClosed().subscribe((status: Boolean) => {
          if (status) {
            Promise.all([this.logout()]).then(() => {
              this.router.navigate(['']);
              // this.snackBar.open('Logged out successfully', 'okay', window['snackBarConfig']);
              this.sessionStorageService.clear();
              sessionStorage.clear();
              window.location.reload();
            });
          }
        });
        break;
      case 'My Profile':
        this.viewableUser = { user: {} };
        this.isResetPassword = false;
        // this.router.navigateByUrl('/profile/my-profile');
        this.router.navigateByUrl('/profile/change-password');
        break;
      case 'Change Password':
        this.viewableUser = { user: {} };
        this.isResetPassword = false;
        this.router.navigateByUrl('/profile/change-password');
        break;
    }
  }

}
