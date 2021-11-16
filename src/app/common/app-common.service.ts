import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError, Subject, Observable } from 'rxjs';
import { HttpService, SharedService, ErrorService } from '../utils/services';
import { GetterSetterMembers } from '../utils/models/common.model';

@Injectable({
  providedIn: 'root'
})
export class AppCommonService {
  public sideNavState$: Subject<boolean> = new Subject();
  private sideNavMsg$ = new Subject<any>();
  private getterSetterMember = new GetterSetterMembers();
  private routingData = [
    { order: 1, module_name: 'Dashboard', routerLink: '/dashboard', menuIcon: 'dashboard', identifier: 'dashboard' },
    { order: 2, module_name: 'User Management', routerLink: '/manage-users', menuIcon: 'user', identifier: 'manage-users' },
    { order: 3, module_name: 'Associates', routerLink: '/manage-associates', menuIcon: 'associate', identifier: 'manage-associates' },
    { order: 4, module_name: 'Vendors', routerLink: '/manage-vendors', menuIcon: 'vendor', identifier: 'manage-vendors' },
    { order: 5, module_name: 'HRIS', routerLink: '/manage-hris', menuIcon: 'hris', identifier: 'manage-hris' },
    // { order: 6, module_name: 'Reports', routerLink: '/reports', menuIcon: 'associate', identifier: 'reports' },
    // { order: 7, moduleName: 'Manage Notifications', routerLink: '/manage-notifications', identifier: 'manage-notifications' },
    // { order: 8, module_name: 'Settings', routerLink: '/settings', menuIcon: 'settings', identifier: 'settings' }
  ];

  constructor(
    private errorService: ErrorService,
    private httpService: HttpService,
    private sharedService: SharedService
  ) { }

  setSideNav(message: any) {
    this.sideNavMsg$.next({ text: message });
  }

  clearMessages() {
    this.sideNavMsg$.next();
  }

  getSideNav(): Observable<any> {
    return this.sideNavMsg$.asObservable();
  }

  /* set the 'value' to the 'category' being passed */
  setData(category: string, value: string) {
    this.getterSetterMember[category] = value;
  }

  /* get the value of the 'category' being passed */
  getData(category: string, ): string {
    return this.getterSetterMember[category];
  }

  /* get all the routing/module details */
  getRoutingData() {
    return this.routingData;
  }

  /**
   * @method - to get the data
   * @param url - api name
   */
  get(url: any): Observable<any> {
    return this.httpService.get(url)
      .pipe(
        map((res: Response) => {
          return (res.hasOwnProperty('body') ? res.body : res);
        }),
        catchError(error => {
          return throwError(error.hasOwnProperty('error') ? error.error : error);
        })
      );
  }

  /**
   * @method - to send the data
   * @param url - api name
   * @param data - login credentials
   * @param showLoader - flag to set the loader
   */
  post(url: any, data: any): Observable<any> {
    return this.httpService.post(url, data)
      .pipe(
        map((res: Response) => {
          return (res.hasOwnProperty('body') ? res.body : res);
        }),
        catchError(error => {
          return throwError(error.hasOwnProperty('error') ? error.error : error);
        })
      );
  }

  /**
   * @method - to update the data
   * @param url - api name
   * @param data - data to be updated
   */
  put(url: any, data: any): Observable<any> {
    return this.httpService.put(url, data)
      .pipe(
        map((res: Response) => {
          return (res.hasOwnProperty('body') ? res.body : res);
        }),
        catchError(error => {
          return throwError(error.hasOwnProperty('error') ? error.error : error);
        })
      );
  }

  /**
   * @method - handle the error response
   * @param error - handle error obtained through api response
   */
  errorHandler(error: any) {
    throwError(this.errorService.handleError(error));
  }
}
