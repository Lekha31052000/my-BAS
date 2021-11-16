import { Component, OnInit } from '@angular/core';
import { SessionStorage } from 'ngx-webstorage';
import { User } from 'src/app/utils/models';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent implements OnInit {
  @SessionStorage('mod') public userModules: any;
  @SessionStorage('auth') public auth: any;
  public selectedTabLabel = 'Change Password';
  public user = new User();
  public sideMenu = [
    { label: 'Personal Information',  routerLink: '/profile/my-profile', icon: 'person'},
    { label: 'Change Password',  routerLink: '/profile/my-profile/change-password', icon: 'password'}
  ];

  constructor() {
    if(this.auth && this.auth.userDetails){
      this.user = new User(this.auth.userDetails);
    }
  }

  ngOnInit() {
  }

}
