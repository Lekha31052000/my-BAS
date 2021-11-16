import { Injectable } from '@angular/core';
import { HttpService, ErrorService, SharedService } from 'src/app/utils/services';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private btnStatus = new BehaviorSubject<any>({});
  private searchStatus = new BehaviorSubject<any>({});
  public currentSelectedTab = '';
  private subject = new Subject<any>();
  private fileTypes = {
    csv: 'text/csv',
    excel: 'application/vnd.ms-excel'
  };
  public resumePage = {
    user: {
      pageNumber: 0,
      searchText: '',
      pageSize: 50
    },
    role: {
      pageNumber: 0,
      searchText: '',
      pageSize: 50
    }
  };

  // public resumePage = new PreservePageData({pageSize : 100});
  constructor(
    private httpService: HttpService,
    private errService: ErrorService
  ) { }

  getFileType() {
    return this.fileTypes;
  }

  // to fetch the subscription data
  getSubscription(subsName) {
    let subscription: any;
    switch (subsName) {
      case 'btn-status':
        subscription = this.btnStatus.asObservable();
        break;
      case 'search':
        subscription = this.searchStatus.asObservable();
        break;
    }
    return subscription;
  }

  // to set the subscription data
  setSubscription(subsName, data) {
    switch (subsName) {
      case 'btn-status':
        this.btnStatus.next(data);
        break;
      case 'search':
        this.searchStatus.next(data);
        break;
    }
  }

  unsubscribeSubscription(){
    // this.btnStatus.unsubscribe();
    this.searchStatus.unsubscribe();
  }

  /**
 * @method - to get the data
 * @param url - api name
 * @param data - login credentials
 */
  fileDownload(url: any,data:any): Observable<any> {
    return this.httpService.fileDataDownload(url,data).pipe(
      map((res: Response) => {
        return (res.hasOwnProperty('body') ? res.body : res);
      }),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error.hasOwnProperty('error') ? error.error : error);
      })
    );
  }

  /**
   * @method - to get the data
   * @param url - api name
   * @param data - login credentials
   */
  get(url: any): Observable<any> {
    return this.httpService.get(url).pipe(
      map((res: Response) => {
        return (res.hasOwnProperty('body') ? res.body : res);
      }),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error.hasOwnProperty('error') ? error.error : error);
      })
    );
  }

  /**
   * @method - to send the data
   * @param url - api name
   * @param data - login credentials
   */
  post(url: any, data: any): Observable<any> {
    return this.httpService.post(url, data).pipe(
      map((res: Response) => {
        return (res.hasOwnProperty('body') ? res.body : res);
      }),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error.hasOwnProperty('error') ? error.error : error);
      })
    );
  }

  /**
   * @method - to update the data
   * @param url
   * @param data
   */
  put(url: any, data: any): Observable<any> {
    return this.httpService.put(url, data).pipe(
      map((res: Response) => {
        return (res.hasOwnProperty('body') ? res.body : res);
      }),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error.hasOwnProperty('error') ? error.error : error);
      })
    );
  }

  /**
   * @method - to update the data
   * @param url
   * @param data
   */
  delete(url: any): Observable<any> {
    return this.httpService.delete(url).pipe(
      map((res: Response) => {
        return (res.hasOwnProperty('body') ? res.body : res);
      }),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error.hasOwnProperty('error') ? error.error : error);
      })
    );
  }

  upload(url: any, data: any): Observable<any> {
    return this.httpService.postFile(url, data).pipe(
      map((res: Response) => {
        return (res.hasOwnProperty('body') ? res.body : res);
      }),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error.hasOwnProperty('error') ? error.error : error);
      }));
  }

  downloadCSV(url) {
    return this.httpService.fileDownload(url).pipe(map((res: Response) => res),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error.json())
      }));
  }

  downloadDataCSV(url, data) {
    return this.httpService.fileDataDownload(url, data).pipe(map((res: Response) => res),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error)
      }));
  }

  errorHandler(error: any) {
    this.errService.handleError(error);
  }
  sendMessage(data: string) {
    console.log("data",data)
    this.subject.next(data);
}

getMessage(): Observable<any> {
  return this.subject.asObservable();
}
}
