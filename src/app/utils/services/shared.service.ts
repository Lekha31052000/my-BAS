import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/';
import { SessionStorage } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @SessionStorage('lp') public landingPage;
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public dialogRef: any;
  // public landingPage = '/manage-associates/associates';

  constructor() { 
    this.landingPage = this.landingPage ? this.landingPage : '/manage-associates/associates';
  }

  display(value: boolean) {
    this.status.next(value);
  }
}
