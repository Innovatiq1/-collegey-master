import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';

const routes: Routes = [
  {
    path: 'profile',
    component: StudentProfileComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  ,
  {
    path: 'profile-details',
    component: ProfileDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {
  static components = [StudentProfileComponent];
}
