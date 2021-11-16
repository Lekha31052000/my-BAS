import { Injectable } from '@angular/core';
import { HttpService, ErrorService, SharedService } from 'src/app/utils/services';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public resumePage = {
    approvals: {
      pageNumber: 0,
      searchText: '',
      pageSize: 50
    }
  };
  private subject = new Subject<any>();

  constructor(
    private httpService: HttpService,
    private errService: ErrorService,
    private sharedService: SharedService,
  ) { }

  /**
   * @method - to get the data
   * @param url - api name
   * @param data - login credentials
   */
  get(url: any, isFM200Service?: boolean, isSdk?: boolean): Observable<any> {
    return this.httpService.get(url, isFM200Service, isSdk).pipe(
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
   * @param url
   * @param data
   */
  put(url: any, data: any): Observable<any> {
    this.sharedService.display(true);
    return this.httpService.put(url, data).pipe(
      map((res: Response) => {
        return (res.hasOwnProperty('body') ? res.body : res)
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
    this.sharedService.display(true);
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
    this.sharedService.display(true);
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

  downloadDataCSV(url, data){
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
