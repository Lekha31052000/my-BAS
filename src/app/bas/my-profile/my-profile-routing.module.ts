import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    children: [
      { path: '', redirectTo: 'my-profile', pathMatch: 'full' },
      { path: 'my-profile', component: ProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProfileRoutingModule { }
