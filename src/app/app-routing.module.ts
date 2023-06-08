import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { authRoutes as AUTH_ROUTES } from './auth/auth.routing.module';
import { AuthGuard } from './core/guards/auth.guard';
import { staticPageRoutes as STATIC_PAGE_ROUTES } from './static-pages/static-pages.routing.module';
import { ThankYouComponent } from './static-pages/thank-you/thank-you.component';
import { StaticBlogsComponent } from 'src/app/static-pages/static-blogs/static-blogs.component';
import { CampaignComponent } from './static-pages/campaign/campaign.component';
import { CollageyComponent } from './static-pages/collagey/collagey.component';
import { CollegeyFundComponent } from './static-pages/collegey-fund/collegey-fund.component';
import { MeetTheTeamComponent } from './static-pages/meet-the-team/meet-the-team.component';
import { BoardDirectorsComponent } from './static-pages/board-directors/board-directors.component';
import { BoardAdvisorsComponent } from './static-pages/board-advisors/board-advisors.component';
import { StudentProfileComponent } from './static-pages/student-profile/student-profile.component';
import { InviteComponent } from './components/invite/invite.component';
import { UserSelectionComponent } from './components/user-selection/user-selection.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PartnerWithCollegeyComponent } from './static-pages/partner-with-collegey/partner-with-collegey.component';
import {ProfileComponent } from './university/profile/profile.component';
import {UniversityDashboardComponent } from './university/university-dashboard/university-dashboard.component';
import { SuccessComponent } from './static-pages/success/success.component';
import { CancelComponent } from './static-pages/cancel/cancel.component';
import { RegisterFormComponent } from './shared/components/register-form/register-form.component';
import { CollegyMarketplaceComponent } from './static-pages/collegy-marketplace/collegy-marketplace.component';
import { MarketplaceDetailsComponent } from './static-pages/marketplace-details/marketplace-details.component';
import { CollegeyFellowshipsComponent } from './static-pages/collegey-fellowships/collegey-fellowships.component';
import { FellowshipDetailsComponent } from './static-pages/fellowship-details/fellowship-details.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MyAccountComponent } from './shared/my-account/my-account.component';
import { CertificateComponent } from './certificate/certificate.component';
import { AgreementTermsConditionComponent } from './agreement-terms-condition/agreement-terms-condition.component';
import { MyBadgeComponent } from './shared/my-badge/my-badge.component';

// Load Profile Components
import { ProfileDetailsComponent } from './modules/student-dashboard/profile-details/profile-details.component';
import { NewsResourceComponent } from './news-resource/news-resource.component';
import { LinkedinLoginResponseComponent } from '../app/shared/components/linkedin-login-response/linkedin-login-response.component';
import { MentorPublicProfileComponent } from './modules/mentors/components/mentor-public-profile/mentor-public-profile.component';

// Load Components
import { ForgotPasswordFormComponent } from '../app/shared/components/forgot-password-form/forgot-password-form.component';
import { PublicBlogTagComponent } from 'src/app/public-blog-tag/public-blog-tag.component';
import { SuccessProgramComponent } from './static-pages/success-program/success-program.component';
import { SuccessFreeProjectComponent } from './static-pages/success-free-project/success-free-project.component';
import { SequelEventComponent } from './sequel-event/sequel-event.component';

import { UpcomingComponent } from './upcoming/upcoming.component';
import { PastComponent } from './past/past.component';
import { LoadmoreComponent } from './loadmore/loadmore.component'



const routes: Routes = [
  ...AUTH_ROUTES,
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./modules/landing/landing.module').then(m => m.LandingModule),
  //     pathMatch: 'full'
  // },
  {
    path: 'upcoming',
    component: UpcomingComponent,
  },
  // {
  //   path: 'loadmore',
  //   component: LoadmoreComponent,
  // },
  {
    path: 'past',
    component: PastComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
    pathMatch: 'full',
  },
  {
    path: 'profile/:id/:author',
    component: ProfileDetailsComponent,
    data: {title: 'public_profile'},
  },
  { 
    path: 'mentor-profile/:id/:author',
    component: MentorPublicProfileComponent,
    data: {title: 'public_profile'},
  },
  {
    path: "linkedInLogin", 
    component: LinkedinLoginResponseComponent,
    pathMatch: 'full',
  },
  {
    path: 'agreement-condition',
    component: AgreementTermsConditionComponent,
    pathMatch: 'full',
  },
  {
    path: 'news-resource',
    component: NewsResourceComponent,
    pathMatch: 'full',
  },
  {
    path: 'certificate',
    component: CertificateComponent,
    pathMatch: 'full',
  },
  {
    path: 'invite',
    component: InviteComponent,
    pathMatch: 'full',
  },
  {
    path: 'resetPassword/:id', 
    component: ResetPasswordComponent,
    pathMatch: 'full',
  },
  {
    path: 'success-program',
    component: SuccessProgramComponent,
    pathMatch: 'full',
  },
  {
    path: 'forget-password', 
    component: ForgotPasswordFormComponent,
    pathMatch: 'full',
  },
  {
    path: 'user-selection',
    component: UserSelectionComponent,
    pathMatch: 'full',
  },
  {
    path: 'university-dashboard',
    component: UniversityDashboardComponent,
    pathMatch: 'full',
  },

  {
    path: 'university',
    component: ProfileComponent,
    pathMatch: 'full',
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    pathMatch: 'full',
  },
  {
    path: 'user-profile/:id',
    component: UserProfileComponent,
    pathMatch: 'full',
    data: {title: 'edit'},
  },
  {
    path: 'register-form',
    component: RegisterFormComponent,
    pathMatch: 'full',
  },
  {
    path: 'student-profile',
    component: StudentProfileComponent,
    pathMatch: 'full',
  },
  {
    path: 'blog',
    component: StaticBlogsComponent,
    pathMatch: 'full',
  },
  {
    path: 'blog/tag/:tag',
    component: PublicBlogTagComponent,
    pathMatch: 'full',
  },
  {
    path: 'collegey-career',
    component: ThankYouComponent,
    pathMatch: 'full',
  },
  {
    path: 'invest-in-collegey',
    component: CampaignComponent,
    pathMatch: 'full',
  },
  {
    path: 'fund',
    component: CollegeyFundComponent,
    pathMatch: 'full',
  },
  {
    path: 'meet-our-team',
    component: MeetTheTeamComponent,
    pathMatch: 'full',
  },
  {
    path: 'advisors',
    component: BoardAdvisorsComponent,
    pathMatch: 'full',
  },
  {
    path: 'directors',
    component: BoardDirectorsComponent,
    pathMatch: 'full',
  },
  {
    path: 'collegey-programs',
    component: CollageyComponent,
    pathMatch: 'full',
  },
  {
    path: 'partner-with-collegey',
    component: PartnerWithCollegeyComponent,
    pathMatch: 'full',
  },
  {
    path: 'success/:projectId',
    component: SuccessComponent,
    //pathMatch: 'full',
  },
  {
    path: 'success-free',
    component: SuccessFreeProjectComponent,
    pathMatch: 'full',
  },
  {
    path: 'cancel',
    component: CancelComponent,
    pathMatch: 'full',
  },
  {
    path: 'events',

    loadChildren: () =>

      import('./modules/home/home.module').then((m) => m.HomeModule),

    pathMatch: 'full',

  },  

  {
    path: 'student',
    loadChildren: () =>
      import('./modules/students/students.module').then(
        (m) => m.StudentsModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: 'magazine',
    loadChildren: () =>
      import('./modules/resources/resources.module').then(
        (m) => m.ResourcesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'counselor',
    loadChildren: () =>
      import('./modules/counselors/counselors.module').then(
        (m) => m.CounselorsModule
      ),
  },
  {
    path: 'student-dashboard/:id',
    loadChildren: () =>
      import('./modules/student-dashboard/student-dashboard.module').then(
        (m) => m.StudentDashboardModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: 'mentors',
    loadChildren: () =>
      import('./modules/mentors/mentors.module').then(
        (m) => m.MentorsModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: 'hb',
    loadChildren: () =>
      import('./modules/highschool/highschool.module').then(
        (m) => m.HighschoolModule
      ),
  },
  {
    path: 'impact',
    loadChildren: () =>
      import('./modules/impact/impact.module').then(
        (m) => m.ImpactModule
      ),
  },
  {
    path: 'parents',
    loadChildren: () =>
      import('./modules/parents/parents.module').then(
        (m) => m.ParentsModule
      ),
  },
  {
    path: 'counselling',
    loadChildren: () =>
      import('./modules/counselling/counselling.module').then(
        (m) => m.CounsellingModule
      ),
  },
  {
    path: 'alumni',
    loadChildren: () =>
      import('./modules/alumni/alumni.module').then(
        (m) => m.AlumniModule
      ),
  },
  {
    path: 'marketplace',
    component: CollegyMarketplaceComponent,
    pathMatch: 'full',
  },
  {
    path: 'marketplace/product-title',
    component: MarketplaceDetailsComponent,
    pathMatch: 'full',
  },
  {
    path: 'fellowships',
    component: CollegeyFellowshipsComponent,
    pathMatch: 'full',
  },
  {
    path: 'fellowships/fellowships-title',
    component: FellowshipDetailsComponent,
    pathMatch: 'full',
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
  },
  {
    path: 'my-badge',
    component: MyBadgeComponent,
  }, 
  
  {
    path: 'event',
    component: SequelEventComponent,
  },







  

  ...STATIC_PAGE_ROUTES,
];

@NgModule({
  imports: [ 
    RouterModule.forRoot(routes),
  ], 
  exports: [RouterModule],
})
export class AppRoutingModule {}
