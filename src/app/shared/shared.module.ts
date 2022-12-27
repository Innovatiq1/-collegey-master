import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxStripeModule } from 'ngx-stripe';

import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoaderComponent } from './components/loader/loader.component';

import { NguCarouselModule } from '@ngu/carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgSelectModule } from '@ng-select/ng-select';

import { RegisterFormComponent } from './components/register-form/register-form.component';

import { NgxCaptchaModule } from 'ngx-captcha';

// Bootstrap Shared Modules
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';



import { InputValidationComponent } from './components/input-validation/input-validation.component';
import { SocialLoginComponent } from './components/social-login/social-login.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { AvatarUploadComponent } from './components/avatar-upload/avatar-upload.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ScrollToInvalidField } from './directives/scroll-to-invalid-field.directive';
import { AnimateOnScrollDirective } from './directives/animate-on-scroll.directive';
import { LayoutModule } from './components/layout/layout.module';
import { CommonArticlesComponent } from '../modules/resources/common/common-articles/common-articles.component';
import { BlogBannerComponent } from '../static-pages/static-blogs/components/blog-banner/blog-banner.component';
import { MentionModule } from 'angular-mentions';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyBadgeComponent } from './my-badge/my-badge.component';

// UTILS
import { environment } from 'src/environments/environment';
import { LinkedinLoginResponseComponent } from './components/linkedin-login-response/linkedin-login-response.component';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';


const COMPONENTS = [
  RegisterFormComponent,
  LoginFormComponent,
  ResetPasswordFormComponent,
  ForgotPasswordFormComponent,
  AuthDialogComponent,
  LoaderComponent,
  InputValidationComponent,
  ProgressBarComponent,
  SocialLoginComponent,
  DocumentUploadComponent,
  AvatarUploadComponent,
  PageNotFoundComponent,
  CommonArticlesComponent,
  BlogBannerComponent,
];

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  FormsModule,
  RouterModule,
  NgSelectModule,
  NguCarouselModule,
  CarouselModule,
  NgxSpinnerModule,
  LayoutModule,
  MentionModule,
  NgxCaptchaModule,
];

const DIRECTIVES = [
  ScrollToInvalidField,
  AnimateOnScrollDirective
];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES, MyAccountComponent, MyBadgeComponent, LinkedinLoginResponseComponent],
  imports: [
    ...MODULES,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxStripeModule.forRoot(environment.stripePublickKey),
    ShareButtonsModule,
    ShareIconsModule,
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    BsDatepickerModule,
    BsDropdownModule,
    ProgressbarModule,
    AccordionModule,
    CollapseModule,
    TabsModule,
    ModalModule,
    TooltipModule,
    AlertModule,
    DatePipe,

  ],
  providers: [DatePipe, BsModalRef],
})
export class SharedModule {}
