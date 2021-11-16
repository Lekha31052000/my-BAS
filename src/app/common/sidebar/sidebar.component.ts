import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { onSideNavChange, animateText } from 'src/app/utils/animations/animations';
import { AppCommonService } from '../app-common.service';
import { Router } from '@angular/router';
import { SessionStorage } from 'ngx-webstorage';
import { SharedService } from 'src/app/utils/services';

@Component({
  selector: 'ast-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @SessionStorage('mod') public myModules: any;
  @SessionStorage('auth') public user: any;
  public sideNavState = false;
  public side = false;
  public linkText = false;
  public imgToggle = false;
  public role;
  public makeToggleActive = false;
  private stateSubscription: Subscription;
  public modules: Array<any> = [];

  constructor(
    private appCommonService: AppCommonService,
    private sharedService: SharedService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.role = this.user.userDetails.role;
    // get module details if user data exists in session storage
    if (this.user && this.user.userDetails) {
      this.getModules();
      this.listenToSidenavStateChange();
    }

    // keep the sidenav opened initially
    // setTimeout(() => {
    //   this.toggleMenu();
    // }, 0 );
  }

  listenToSidenavStateChange() {
    this.stateSubscription = this.appCommonService.getSideNav().subscribe(res => {
      this.sideNavState = res.text;
      setTimeout(() => {
        this.linkText = this.sideNavState;
        if (this.linkText === false) {
          this.imgToggle = false;
          this.makeToggleActive = false;
        } else {
          this.makeToggleActive = false;
          this.imgToggle = true;
        }
      }, 200);
      this.appCommonService.sideNavState$.next(this.sideNavState);
    });
  }

  /**
   * @method - get modules details of logged in user
   */
  getModules() {
    const routingList = this.appCommonService.getRoutingData();
    this.modules = [];
    this.myModules.forEach(module => {
      module.modulename = module.modulename.toLowerCase();
      const filteredModule = routingList.filter(routingData => routingData.module_name.toLowerCase() === module.modulename);
      if (filteredModule.length > 0) {
        let isAllowed = false;
        switch (module.modulename) {
          case 'dashboard':
          case 'user management':
          case 'vendors':
            case 'hris':
          case 'associates':
          case 'flagging':
          case 'reports':
          case 'settings':
            if (module.resources.length > 0) {
              module.resources.forEach(resource => {
                if (resource.permissions.length > 0) {
                  isAllowed = true;
                }
              });
            }
            break;
        }
        // if user has the permission to access the model, then add the module to the list
        if (isAllowed) {
          this.modules.push(filteredModule[0]);
        }
      }
    });
    // sort the sidebar menu to get the fixed order
    this.modules.sort((a, b) => a.order - b.order);
  }

  /* changing the value of sidenav using subject and service to trigger in app-side component */
  toggleMenu() {
    if (this.side === false) {
      this.appCommonService.setSideNav(true);
      this.side = true;
    } else {
      this.appCommonService.setSideNav(false);
      this.side = false;
    }
  }

  /* highlight the sidemenu */
  checkActiveRoute(identifier) {
    if (this.role !== 'superadmin') {
      this.modules = this.modules.filter((ele) => ele.module_name !== 'Vendors')
    }
    const active = this.router.url.indexOf(identifier) === -1 ? false : true;
    return active;
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

}
