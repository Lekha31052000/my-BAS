import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { SessionStorage } from 'ngx-webstorage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  @SessionStorage('auth') public auth: any;
  public baseUrl = environment.baseUrl;
  public FM220Url = environment.fingerprintUrl;
  public sdkUrl = environment.sdkUrl;

  constructor(
    private http: HttpClient
  ) { }

  /* Set the headers for rest api call with content-type : json */
  getRequestHeaders(addToken?: boolean) {
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (this.auth && this.auth.tokenType && this.auth.token && addToken) {
      headers = headers.append('x-access-token', this.auth.tokenType + ' ' + this.auth.token);
    }
    return headers;
  }



  /* Set the headers for rest api call with formdata */
  getFileUploadHeader(): HttpHeaders {
    let fileUploadHeader: HttpHeaders;
    return fileUploadHeader = new HttpHeaders({
      'x-access-token': this.auth.tokenType + ' ' + this.auth.token
    });
  }

  /* To handle the error response */
  handleError(error: any): Observable<any> {
    return throwError(error);
  }

  /* GET api call */
  get(api: any, isFM220Service?: boolean, isSdk?: boolean): Observable<any> {
    return this.http
      .get((isFM220Service ? (isSdk ? this.sdkUrl : this.FM220Url) : this.baseUrl) + api, { headers: this.getRequestHeaders(true), observe: 'response' })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  /* DELETE api call */
  delete(api: any, isFM220Service?: boolean): Observable<any> {
    return this.http
      .delete((isFM220Service ? this.FM220Url : this.baseUrl) + api, { headers: this.getRequestHeaders(true) })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  /* POST api call */
  post(api: any, data: any, isFM220Service?: boolean): Observable<any> {
    return this.http
      .post((isFM220Service ? this.FM220Url : this.baseUrl) + api, JSON.stringify(data), { headers: this.getRequestHeaders(true), observe: 'response' })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  /* PUT api call */
  put(api: any, data: any, isFM220Service?: boolean): Observable<any> {
    return this.http
      .put((isFM220Service ? this.FM220Url : this.baseUrl) + api, JSON.stringify(data), { headers: this.getRequestHeaders(true) })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  /* Post file through formdata  */
  postFile(api: any, data: any, isFM220Service?: boolean): Observable<any> {
    // const formData = new FormData();
    // formData.append('files', data);
    const headers: HttpHeaders = new HttpHeaders();
    if (this.auth) {
      headers.append('x-access-token', this.auth.tokenType + ' ' + this.auth.token);
    }
    return this.http.post((isFM220Service ? this.FM220Url : this.baseUrl) + api, data, { headers: headers }).pipe(
      map(response => response), catchError(this.handleError));
  }

  /* service call for downloading file */
  fileDownload(query: any, isFM220Service?: boolean, isSdk?: boolean) {
    // return this.http.get(this.baseUrl + query, { headers: this.getFileUploadHeader(), responseType: ResponseContentType.Blob })
    return this.http.get((isFM220Service ? this.FM220Url : this.baseUrl) + query, { headers: this.getFileUploadHeader(), responseType: 'blob' })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  /* service call for downloading file */
  filePostDownload(query: any, isFM220Service?: boolean, isSdk?: boolean) {
    // return this.http.get(this.baseUrl + query, { headers: this.getFileUploadHeader(), responseType: ResponseContentType.Blob })
    return this.http.post((isFM220Service ? this.FM220Url : this.baseUrl) + query, { headers: this.getFileUploadHeader(), responseType: 'blob' })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }
  /* downloading file by passing the data */
  fileDataDownload(query: any, data: any) {
    return this.http.post(this.baseUrl + query, data, { headers: this.getFileUploadHeader(), responseType: 'blob' })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }
}
