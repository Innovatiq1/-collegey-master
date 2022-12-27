import { Routes } from '@angular/router';
import { NewsArticlesComponent } from './news-articles/news-articles.component';

export const staticPageRoutes: Routes = [
  {
    path: 'terms-condition',
    loadChildren: () => import('./terms/terms.module').then(m => m.TermsModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./static-blogs/static-blogs.module').then(m => m.StaticBlogsModule)
  },
  {
    path: 'profile/:slug',
    loadChildren: () => import('./public-profile/public-profile.module').then(m => m.PublicProfileModule)
  },
  {
    path: 'single-program/:id',
    loadChildren: () => import('./big-picture-project/big-picture-project.module').then(m => m.BigPictureProjectModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)
  },
  {
    path: 'news',
    component: NewsArticlesComponent,
    pathMatch: 'full',
  },
];
