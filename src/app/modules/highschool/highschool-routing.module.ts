import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HighschooldashboardComponent } from './highschooldashboard/highschooldashboard.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'hbdashboard',
    component: HighschooldashboardComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HighschoolRoutingModule { }
