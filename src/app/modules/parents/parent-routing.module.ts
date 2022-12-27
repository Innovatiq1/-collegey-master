import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParentDashboardComponent } from './parent-dashboard/parent-dashboard.component'
import { ParentsProfileComponent} from './parents-profile/parents-profile.component'
const routes: Routes = [
 
  {
    path: 'dashboard',
    component: ParentDashboardComponent,
  },
  {
    path: 'profile',
    component: ParentsProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }
