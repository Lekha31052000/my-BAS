import { Injectable, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ConfirmationComponent } from '../components';
import { map } from 'rxjs/operators';
import { SessionStorage } from 'ngx-webstorage';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export abstract class ComponentCanDeactivate {
  abstract canDeactivate(): boolean;

  // show the prompt before reloading the page
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }
}

export abstract class FormCanDeactivate extends ComponentCanDeactivate {
  abstract get form(): NgForm;

  canDeactivate(): boolean {
    return this.form.submitted || !this.form.dirty
  }
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate>  {
  @SessionStorage('auth') public authData: any;
  constructor(private dialog: MatDialog) { }

  /**
   * @method - to show the confirmation prompt before navigating from page if there are unsaved data
   * @param component - the component from which navigation happens
   */
  canDeactivate(component: CanComponentDeactivate) {
    if (
      component.canDeactivate &&
      component.canDeactivate() &&
      this.authData.token
    ) {
     
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        autoFocus: false,
        disableClose: true,
        panelClass: 'confirm-delete-dialog',
        backdropClass: 'confirm-delete-backdrop',
        data: {
          title: 'Confirmation',
          message: 'You have unsaved changes! Are you sure to leave this page ?',
          buttonLableSubmit: 'Yes',
          buttonLableCancel: 'No'
        }
      });
      return dialogRef.afterClosed().pipe(map(status => status));
    }
    return true;
  }
}
