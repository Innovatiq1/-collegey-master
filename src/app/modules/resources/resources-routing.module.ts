import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources.component';
import { ArticleDetailComponent } from './articles/article-detail/article-detail.component';
import { WebinarsComponent } from './webinars/webinars.component';
import { ArticlesComponent } from './articles/articles.component';
import { ConferencesComponent } from './conferences/conferences.component';
import { ProgrammesComponent } from './programmes/programmes.component';
import { ActivecoursesComponent } from './activecourses/activecourses.component';

export enum ResourcesRoutes {
  ALL_RESOURCES = '',
  WEBINAR = 'webinar',
  PROGRAMME = 'programme',
  COURSES = 'course',
  ARTICLE_DETAIL = 'blog/:slug',
  BLOG = 'blog',
  CONFERENCE= 'conference'
}


const routes: Routes = [
  {
    path: ResourcesRoutes.ALL_RESOURCES,
    component: ResourcesComponent,
  },
  {
    path: ResourcesRoutes.WEBINAR,
    component: WebinarsComponent,
  },
  {
    path: ResourcesRoutes.PROGRAMME,
    component: ProgrammesComponent,
  },
  {
    path: ResourcesRoutes.COURSES,
    component: ActivecoursesComponent,
  },
  {
    path: ResourcesRoutes.BLOG,
    component: ArticlesComponent
  },
  {
    path: ResourcesRoutes.CONFERENCE,
    component: ConferencesComponent
  },
  {
    path: ResourcesRoutes.ARTICLE_DETAIL,
    component: ArticleDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule {
  static Components = [
    ResourcesComponent,
    ArticleDetailComponent,
    ArticlesComponent,
    ProgrammesComponent,
    WebinarsComponent,
    ConferencesComponent
  ];
}
