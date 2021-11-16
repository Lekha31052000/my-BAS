import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssociateLayoutComponent, ManageAssociatesComponent, PrepareAssociatesComponent } from './';
import { CanDeactivateGuard } from 'src/app/utils/guards/can-deactivate.guard';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';
import { RedFlagHistoryComponent } from "./red-flag-history/red-flag-history.component";


const routes: Routes = [
  {
    path: '',
    component: AssociateLayoutComponent,
    children: [
      { path: '', redirectTo: 'associates', pathMatch: 'full' },
      {
        path: 'associates',
        component: ManageAssociatesComponent,
        canActivate: [AuthGuard],
        data: { module_name: 'associates', resource_name: 'associates' }
      },
      { path: 'associates/update/:asscId',
      component: PrepareAssociatesComponent,
      canDeactivate: [CanDeactivateGuard],
      canActivate: [AuthGuard],
      data: { module_name: 'associates', resource_name: 'associates' }
    },
    {
      path: "red-flag",
      component: RedFlagHistoryComponent,
      canActivate: [AuthGuard],
      canDeactivate: [CanDeactivateGuard],
      data: { module_name: "associates", resource_name: "associates" },
    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssociatesRoutingModule { }
