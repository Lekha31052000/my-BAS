import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from 'src/app/utils/guards/can-deactivate.guard';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';
import { SeparationComponent } from './separation/separation.component';
import { OnBoardingComponent } from './onboarding/onboarding.component';
import { SeparateComponent } from './separationn/separate.component';



const routes: Routes = [
  {
    path: '',
    component: SeparationComponent,
    children: [
      { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
      {
        path: 'onboarding',
        component: OnBoardingComponent,
        
      },
      
    {
      path: "separate",
      component:SeparateComponent,
      
    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrisRoutingModule { }
