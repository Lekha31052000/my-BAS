import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './common/layout/layout.component';
import { SharedService } from './utils/services';



const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./common/app-common.module').then(m => m.AppCommonModule)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./bas/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'manage-users',
        loadChildren: () => import('./bas/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'manage-associates',
        loadChildren: () => import('./bas/associates/associates.module').then(m => m.AssociatesModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./bas/my-profile/my-profile.module').then(m => m.MyProfileModule)
      },
      {
        path: 'manage-vendors',
        loadChildren: () => import('./bas/vendors/vendors.module').then(m => m.VendorsModule)
      },
      {
        path: 'manage-hris',
        loadChildren: () => import('./bas/hris/hris.module').then(m => m.HrisModule)
      },
      {
        path: '**',
        loadChildren: () => import('./bas/associates/associates.module').then(m => m.AssociatesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
