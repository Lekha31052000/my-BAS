import { Component, OnInit } from '@angular/core';
import { onMainContentChange } from '../../utils/animations/animations';
import { AppCommonService } from '../app-common.service';
import { SessionStorage } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [onMainContentChange]
})
export class LayoutComponent implements OnInit {
  @SessionStorage('auth') public authToken;
  public onSideNavChange: boolean;

  constructor(
    private appCommonService: AppCommonService,
    private router: Router) {
    this.appCommonService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });
  }

  ngOnInit() {
    if(this.authToken && !this.authToken.token){
      this.router.navigate(['']);
    }
  }

}
