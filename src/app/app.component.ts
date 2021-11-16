import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage } from 'ngx-webstorage';
import { SharedService } from './utils/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  @SessionStorage('auth') public user;
  public loading = true;
  public isConnected = true;

  constructor(
    public router: Router,
    public sharedService: SharedService,
    private changeDetector: ChangeDetectorRef
  ){
    // check whether the user is online or offline
    this.isConnected = navigator.onLine;
    // this.connectionService.monitor().subscribe(isConnected => {
    //   this.isConnected = isConnected;
    //   this.changeDetector.detectChanges();
    // });
  }

  ngOnInit() {
    // redirect to login if the token is not there
    // if (!this.user) {
    //   this.router.navigateByUrl('/login');
    // }
    // show the loader if flag 'loading' is true
    
    this.sharedService.status.subscribe((val: boolean) => {
      this.loading = val;
      this.changeDetector.detectChanges();
    });
  }
}
