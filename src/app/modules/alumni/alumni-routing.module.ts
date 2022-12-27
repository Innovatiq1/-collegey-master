import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImpactProfileComponent } from '../impact/impact-profile/impact-profile.component';
import { AlumniDashboardComponent } from './alumni-dashboard/alumni-dashboard.component';

const routes: Routes = [
  {
    path: 'ip-profile',
    component: ImpactProfileComponent,
  },
  {
    path: 'dashboard',
    component: AlumniDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumniroutingModule { }
