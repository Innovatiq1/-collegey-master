import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogsComponent } from './components/blogs/blogs.component';
import { CollegeyFeedComponent } from './components/collegey-feed/collegey-feed.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GroupsComponent } from './components/groups/groups.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { QaformsComponent } from './components/qaforms/qaforms.component';
import { EventsComponent } from './components/events/events.component';
import { MentorComponent } from './components/mentor/mentor.component';
import { UniversityComponent } from './components/university/university.component';
import { ViewAnnoucementComponent } from './view-annoucement/view-annoucement.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { MentorChatComponent } from './mentor-chat/mentor-chat.component';

import { ConferencesComponent } from '../resources/conferences/conferences.component';
import { NewsresourceComponent } from '../student-dashboard/components/newsresource/newsresource.component';
import { MentorProfileidComponent } from '.././mentors/components/profile/mentor-profileid/mentor-profileid.component';
import { TagBlogComponent } from './components/blogs/tag-blog/tag-blog.component';

// Navigation use component
import { AcademyComponent } from './components/academy/academy.component';
import { ArticlesComponent } from '../resources/articles/articles.component';
import { WebinarsComponent } from '../resources/webinars/webinars.component';
import { ActivecoursesComponent } from '../resources/activecourses/activecourses.component';
import { ProgrammesComponent } from '../resources/programmes/programmes.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'viewannouncement',
    component: ViewAnnoucementComponent,
  }, 
  {
    path: 'profile',
    component: ProfileDetailsComponent,
  },
  {
    path: 'project',
    component: ProjectsComponent,
  },
  {
    path: 'feed',
    component: CollegeyFeedComponent,
  },
  {
    path: 'qaforms',
    component: QaformsComponent,
  },
  {
    path: 'events',
    component: EventsComponent,
  },
  {
    path:'mentorid',
    component: MentorProfileidComponent,
  },
  {
    path: 'mentor',
    component: MentorComponent,
  },
  {
    path: 'university',
    component: UniversityComponent,
  },
  {
    path: 'groups',
    component: GroupsComponent,
  },
  {
    path: 'blog',
    component: BlogsComponent,
  },
  {
    path: 'blog/tag/:tag',
    component: TagBlogComponent,
  },
  {
    path: 'academy',
    component: AcademyComponent,
  },
  {
    path: 'academy/blogs',
    component: ArticlesComponent,
  },
  {
    path: 'academy/vlog',
    component: WebinarsComponent,
  },
  {
    path: 'academy/Programs',
    component: ProgrammesComponent
  },
  {
    path: 'academy/course',
    component: ActivecoursesComponent
  },
  {
    path: 'academy/conferences',
    component: ConferencesComponent
  },
  {
    path: 'mentor-chat',
    component: MentorChatComponent
  },
  {
    path: 'news-resource',
    component: NewsresourceComponent,
  },
  {
    path: 'program',
    component: ProgramsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDashboardRoutingModule { }
