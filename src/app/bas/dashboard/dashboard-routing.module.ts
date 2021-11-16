import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';


const routes: Routes = [
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    data: { module_name: 'dashboard', resource_name: 'approvals' }
  },
  {
    path: 'approvals',
    component: ApprovalsComponent,
    canActivate: [AuthGuard],
    data: { module_name: 'dashboard', resource_name: 'approvals' }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
