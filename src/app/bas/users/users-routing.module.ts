import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersLayoutComponent, ManageUsersComponent, ManageRolesComponent, PrepareRolesComponent, PrepareUsersComponent } from './';
import { CanDeactivateGuard } from 'src/app/utils/guards/can-deactivate.guard';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: UsersLayoutComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        component: ManageUsersComponent,
        // canActivate: [AuthGuard],
        // data: { module_name: 'user management', resource_name: 'users' }
      },
      {
        path: 'users/create-user',
        component: PrepareUsersComponent,
        canActivate: [AuthGuard],
        data: { module_name: 'user management', resource_name: 'users' }
      },
      {
        path: 'users/update-user/:userId',
        component: PrepareUsersComponent,
        canDeactivate: [CanDeactivateGuard],
        canActivate: [AuthGuard],
        data: { module_name: 'user management', resource_name: 'users' }
      },
      {
        path: 'roles',
        component: ManageRolesComponent,
        canActivate: [AuthGuard],
        data: { module_name: 'user management', resource_name: 'roles' }
      },
      {
        path: 'roles/create-role',
        component: PrepareRolesComponent,
        canActivate: [AuthGuard],
        data: { module_name: 'user management', resource_name: 'roles' }
      },
      {
        path: 'roles/update-role/:roleId',
        component: PrepareRolesComponent,
        canActivate: [AuthGuard],
        data: { module_name: 'user management', resource_name: 'roles' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
