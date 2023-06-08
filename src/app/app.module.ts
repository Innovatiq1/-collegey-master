import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileSaverModule } from 'ngx-filesaver';
import { CookieService } from 'ngx-cookie-service';
import { NgxStripeModule } from 'ngx-stripe';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { ToastrModule } from 'ngx-toastr';
import { DEFAULT_CONFIG } from 'src/configs/default';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThankYouComponent } from './static-pages/thank-you/thank-you.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { Angulartics2Module } from 'angulartics2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InviteComponent } from './components/invite/invite.component';
import { UserSelectionComponent } from './components/user-selection/user-selection.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CollageyComponent } from './static-pages/collagey/collagey.component';
import { MeetTheTeamComponent } from './static-pages/meet-the-team/meet-the-team.component';
import { BoardDirectorsComponent } from './static-pages/board-directors/board-directors.component';
import { BoardAdvisorsComponent } from './static-pages/board-advisors/board-advisors.component';
import {ProfileComponent } from './university/profile/profile.component'
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha'; 
import { CampaignComponent } from './static-pages/campaign/campaign.component';
import { CollegeyFundComponent } from './static-pages/collegey-fund/collegey-fund.component';
import { PartnerWithCollegeyComponent } from './static-pages/partner-with-collegey/partner-with-collegey.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SwiperModule } from "swiper/angular";
import {UniversityDashboardComponent } from './university/university-dashboard/university-dashboard.component';
import { UniversityComponent } from './student-dashboard/components/university/university.component';
import { CollegyMarketplaceComponent } from './static-pages/collegy-marketplace/collegy-marketplace.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
  // import { ShareButtonsPopupModule } from 'ngx-sharebuttons/popup';

// load libary
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TagInputModule } from 'ngx-chips';
import { CertificateComponent } from './certificate/certificate.component';
import { AgreementTermsConditionComponent } from './agreement-terms-condition/agreement-terms-condition.component';
import { NewsResourceComponent } from './news-resource/news-resource.component';

// UTILS
import { environment } from 'src/environments/environment';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import {NgxImageCompressService} from 'ngx-image-compress';
import { PublicBlogTagComponent } from './public-blog-tag/public-blog-tag.component';
import { SequelEventComponent } from './sequel-event/sequel-event.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { PastComponent } from './past/past.component';
import { CardsComponent } from './cards/cards.component';
import { LoadmoreComponent } from './loadmore/loadmore.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(DEFAULT_CONFIG.keys.GOOGLE_APP_ID)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(DEFAULT_CONFIG.keys.FACEBOOK_APP_ID)
  }
]);
 
export function provideConfig() { 
  return config;
}


@NgModule({
 declarations: [AppComponent,PartnerWithCollegeyComponent,ThankYouComponent, InviteComponent, UserSelectionComponent, UserProfileComponent,CollageyComponent,MeetTheTeamComponent, CampaignComponent,ProfileComponent,UniversityDashboardComponent, UniversityComponent, CollegyMarketplaceComponent, ResetPasswordComponent, CertificateComponent, AgreementTermsConditionComponent,CollegeyFundComponent,BoardAdvisorsComponent,BoardDirectorsComponent,NewsResourceComponent, PublicBlogTagComponent, SequelEventComponent, UpcomingComponent, PastComponent, CardsComponent, LoadmoreComponent],
 imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    SocialLoginModule,
    FileSaverModule,
    NgxSpinnerModule,
    CarouselModule,
    TabsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressAnimation: 'increasing',
    }),
    Angulartics2Module.forRoot(),
    BrowserAnimationsModule,
    SharedModule,
    NgbModule,
    NgxCaptchaModule,
    NgMultiSelectDropDownModule ,
    PaginationModule,SwiperModule,NgMultiSelectDropDownModule.forRoot(),
    NgxDropzoneModule,
    NgxPaginationModule,
    TagInputModule,
    NgxStripeModule.forRoot(environment.stripePublickKey),
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule,
    // ShareButtonsPopupModule,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
    NgxImageCompressService,
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
