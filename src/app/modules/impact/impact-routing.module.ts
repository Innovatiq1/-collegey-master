import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImpactProfileComponent } from './impact-profile/impact-profile.component';
import { IpDashboardComponent } from './ip-dashboard/ip-dashboard.component';

const routes: Routes = [
  {
    path: 'ip-profile',
    component: ImpactProfileComponent,
  },
  {
    path: 'dashboard',
    component: IpDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImpactroutingModule { }
