import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageVendorsComponent } from './manage-vendors/manage-vendors.component';
import { PrepareVendorsComponent } from './prepare-vendors/prepare-vendors.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';
import { CanDeactivateGuard } from 'src/app/utils/guards/can-deactivate.guard';
import { ManageVendorUsersComponent } from './manage-vendor-users/manage-vendor-users.component';
import { ManageVendorUserAssociatesComponent } from './manage-vendor-user-associates/manage-vendor-user-associates.component';


const routes: Routes = [
  { path: '', redirectTo: 'vendors', pathMatch: 'full' },
  {
    path: 'vendors',
    component: ManageVendorsComponent,
    canActivate: [AuthGuard],
    data: { module_name: 'vendors', resource_name: 'vendors' }
  },

  {
    path: 'vendors/create-vendor',
    component: PrepareVendorsComponent,
    canActivate: [AuthGuard],
    data: { module_name: 'vendors', resource_name: 'vendors' }
  },
  {
    path: 'vendors/update-vendor/:vendorId',
    component: PrepareVendorsComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [AuthGuard],
    data: { module_name: 'vendors', resource_name: 'vendors' }
  },
  {
    path: 'vendors/:vendorId',
    component: ManageVendorUsersComponent,
    canActivate: [AuthGuard],
    data: { module_name: 'vendors', resource_name: 'vendors' }
  },
  {
    path: 'vendors/users/:vendorId',
    component: ManageVendorUserAssociatesComponent,
    canActivate: [AuthGuard],
    data: { module_name: 'vendors', resource_name: 'vendors' }
  }
  // ]
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
