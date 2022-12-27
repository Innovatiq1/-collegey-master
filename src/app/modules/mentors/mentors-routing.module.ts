import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentChatComponent } from './components/student-chat/student-chat.component';
import { AdminChatComponent } from './components/admin-chat/admin-chat.component';
import { PerkDetailComponent } from './components/perk-detail/perk-detail.component';
import { CollegeyOpportunitiesComponent } from './components/collegey-opportunities/collegey-opportunities.component';
import { MetorProfileDetailComponent } from './components/metor-profile-detail/metor-profile-detail.component';
import { ProjectComponent } from './components/project/project.component';
import { TabMentorparkComponent } from './components/tab-mentorpark/tab-mentorpark.component';
import { TabMentorOpportunitiesComponent } from './components/tab-mentor-opportunities/tab-mentor-opportunities.component';
import { TabMentorResourcesComponent } from './components/tab-mentor-resources/tab-mentor-resources.component';
import { TabMentorHosteventComponent } from './components/tab-mentor-hostevent/tab-mentor-hostevent.component';

const routes: Routes = [
  {
    path: 'metor-profile-detail',
    component: MetorProfileDetailComponent,
  },
  {
    path: 'perk-detail',
    component: PerkDetailComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {title: 'mentor-profile'},
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'project',
    component: ProjectComponent,
  },
  {
    path: 'student-chat',
    component: StudentChatComponent,
  },
  {
    path: 'admin-chat',
    component: AdminChatComponent,
  },
  {
    path: 'perks',
    component: TabMentorparkComponent,
  },
  {
    path: 'collegey-opportunities',
    component: TabMentorOpportunitiesComponent,
  },
  {
    path: 'mentor-resource',
    component: TabMentorResourcesComponent,
  },
  {
    path: 'mentor-event',
    component: TabMentorHosteventComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorsRoutingModule { }
