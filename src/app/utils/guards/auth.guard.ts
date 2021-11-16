import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad, Route, UrlSegment,
  ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorage } from 'ngx-webstorage';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  @SessionStorage('auth') public authData: any;
  @SessionStorage('mod') public modulePermissions: any;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar) { }

  canActivate(
    activeRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAllowable(state.url, activeRoute.data);
  }

  /**
   * @method - check whether the user has permissions to access the modules
   * @param url - the activated route
   * @param moduleData - contains module_name and resource_name
   */
  isAllowable(url: string, moduleData?: any): boolean {
    let isAllowed = false;
    if (this.modulePermissions) {
      // filter the module being accessed
      let currentModule = this.modulePermissions.filter(module => module.modulename.toLowerCase() === moduleData.module_name.toLowerCase());
      // check whether the user has access to module's resources
      if (currentModule.length > 0) {
        let currentResource = currentModule[0].resources.filter(resource => resource.resourcename.toLowerCase() === moduleData.resource_name.toLowerCase());
        if (currentResource.length > 0 && (currentResource[0].permissions.filter(permission => permission.toLowerCase() === 'read')).length > 0) {
          isAllowed = true;
        }
      }
    }
    // IF -  if authtoken exists and the user is allowed to access the resources navigate to requested route
    // ELSE - show the warning and stay in the current route itself
    if (this.authData.token && isAllowed) {
      this.router.navigate[url];
      return true;
    } else {
      this.snackBar.open('You do not have permission to access these details...!', '', window['snackBarBottom']);
      // this.router.navigateByUrl('./', {relativeTo: this.activatedRoute});
      return false;
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
