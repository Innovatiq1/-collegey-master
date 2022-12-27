import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CounselorDashboardComponent } from './counselor-dashboard/counselor-dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: CounselorDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CounselorsRoutingModule {
  static components = [CounselorDashboardComponent];
}
