import { Injectable } from '@angular/core';
import { HttpService, ErrorService, SharedService } from 'src/app/utils/services';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssociatesService {
  private getAssociate = new BehaviorSubject<any>({});
  private searchStatus = new BehaviorSubject<any>({});
  private fileTypes = {
    csv: 'text/csv',
    excel: 'application/vnd.ms-excel'
  };

  public flagFilters = [
    { type: 'all', value: '' },
    { type: 'green', value: 'GREEN' },
    { type: 'orange', value: 'ORANGE' },
    { type: 'red', value: 'RED' }
  ];

  public flagFiltersQueryParams = [
    { type: '' },
    { type: 'GREEN' },
    { type: 'ORANGE' },
    { type: 'RED' }
  ];


  public scanStatus = {
    0: 'Press the Scan Button to Start',
    1: 'Place the Left Index Finger',
    2: 'Place the Right Index Finger',
    3: ''
  }

  public govtProofTypes = [
    { type: 'Aadhar', value: 'AADHAR' },
    { type: 'Voter ID', value: 'VOTER_ID' },
    { type: 'PAN Card', value: 'PANCARD' },
    { type: 'Driving License', value: 'DRIVING_LICENCE' }
  ];

  public jobTypes = [
    { type: 'Associate/DSP/SLSP_DA', value: 'ASSOCIATES/DSP/SLSP_DA' },
    { type: 'Associate/EDSP_DA', value: 'ASSOCIATES/EDSP_DA' },
    { type: 'Associate/AMFLEX_DA', value: 'ASSOCIATES/AMFLEX_DA' },
    { type: 'Associate/Prime_Now', value: 'ASSOCIATES/Prime_Now' },
    { type: 'Associates', value: 'ASSOCIATES' },
    { type: 'Driver', value: 'DRIVER' },
    { type: 'Security', value: 'SECURITY' },
    { type: 'Facility/House Keeping', value: 'FACILITY' },
    { type: 'Delivery Associates', value: 'DELIVERY' }
  ];

  // public resumePage = new PreservePageData({pageSize : 100});
  constructor(
    private httpService: HttpService,
    private errService: ErrorService,
    private sharedService: SharedService
  ) { }

  getSubscription(subsName) {
    let subscription: any;
    switch (subsName) {
      case 'getAssociate':
        subscription = this.getAssociate.asObservable();
        break;
      case 'search':
        subscription = this.searchStatus.asObservable();
        break;
    }
    return subscription;
  }

  setSubscription(subsName, data) {
    switch (subsName) {
      case 'getAssociate':
        this.getAssociate.next(data);
        break;
      case 'search':
        this.searchStatus.next(data);
        break;
    }
  }

  getFileType() {
    return this.fileTypes;
  }

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
   * @method - to get the data
   * @param url - api name
   * @param data - login credentials
   */
  fileDownload(url: any, isFM200Service?: boolean, isSdk?: boolean): Observable<any> {
    return this.httpService.fileDownload(url, isFM200Service, isSdk).pipe(
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
  post(url: any, data: any, isFM200Service?: boolean): Observable<any> {
    return this.httpService.post(url, data, isFM200Service).pipe(
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
  put(url: any, data: any, isFM200Service?: boolean): Observable<any> {
    return this.httpService.put(url, data, isFM200Service).pipe(
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
  delete(url: any, isFM200Service?: boolean): Observable<any> {
    return this.httpService.delete(url, isFM200Service).pipe(
      map((res: Response) => {
        return (res.hasOwnProperty('body') ? res.body : res);
      }),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error)
      })
    );
  }

  upload(url: any, data: any, isFM200Service?: boolean): Observable<any> {
    this.sharedService.display(true);
    return this.httpService.postFile(url, data, isFM200Service).pipe(
      map((res: Response) => {
        return (res.hasOwnProperty('body') ? res.body : res);
      }),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error);
      }));
  }

  downloadCSV(url) {
    return this.httpService.fileDownload(url).pipe(map((res: Response) => res),
      catchError(error => {
        this.errorHandler(error);
        return throwError(error)
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
}
