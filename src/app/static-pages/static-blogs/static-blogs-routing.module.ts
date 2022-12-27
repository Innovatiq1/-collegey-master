import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaticBlogsComponent } from './static-blogs.component';
import { ArticleDetailComponent } from 'src/app/modules/resources/articles/article-detail/article-detail.component';

const routes: Routes = [
  {
    path: 'Blogs',
    component: StaticBlogsComponent
  },
  {
    path: ':slug',
    component: ArticleDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticBlogsRoutingModule{
  static components = [
    StaticBlogsComponent
  ]  
}