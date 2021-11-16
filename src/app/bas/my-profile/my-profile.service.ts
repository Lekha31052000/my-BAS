import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError, Subject, Observable } from 'rxjs';
import { HttpService, SharedService, ErrorService } from '../../utils/services';

@Injectable({
  providedIn: 'root'
})
export class MyProfileService {

  constructor(
    private errorService: ErrorService,
    private httpService: HttpService
  ) { }

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
