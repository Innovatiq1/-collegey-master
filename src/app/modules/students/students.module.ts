import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStripeModule } from 'ngx-stripe';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { MentionModule } from 'angular-mentions'; 
import { PaginationModule } from 'ngx-bootstrap/pagination';  
// UTILS
import { environment } from 'src/environments/environment';
// Load Extra Library
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TagInputModule } from 'ngx-chips';  

import { StudentsRoutingModule } from './students-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StudentGeographyComponent } from './components/profile/student-geography/student-geography.component';
import { StudentInterestsComponent } from './components/profile/student-interests/student-interests.component';
import { StudentPersonalDetailsComponent } from './components/profile/student-personal-details/student-personal-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentKnowYouBetterComponent } from './components/profile/student-know-you-better/student-know-you-better.component';
import { StudentHeadedComponent } from './components/profile/student-headed/student-headed.component';
import { StudentPreferencesComponent } from './components/profile/student-preferences/student-preferences.component';
import { StudentProjectsComponent } from './components/profile/student-projects/student-projects.component';

import { AddProjectComponent } from './components/profile/student-projects/components/add-project/add-project.component';
import { AboutWorkComponent } from './components/profile/student-projects/components/about-work/about-work.component';
// tslint:disable-next-line:max-line-length
import { AddWritingSampleComponent } from './components/profile/student-projects/components/add-writing-sample/add-writing-sample.component';
import { AddAwardsComponent } from './components/profile/student-projects/components/add-awards/add-awards.component';
import { StudentHistoryComponent } from './components/profile/student-history/student-history.component';
import { HistoryViewComponent } from './components/profile/student-history/components/history-view/history-view.component';
import { AddHistoryComponent } from './components/profile/student-history/components/add-history/add-history.component';
import { HistoryFormComponent } from './components/profile/student-history/components/history-form/history-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from "@ng-select/ng-select";
import { GlobalStudentProfileUploadComponent } from './components/global-student-profile-upload/global-student-profile-upload.component';


@NgModule({
  declarations: [
    StudentsRoutingModule.components,
    StudentGeographyComponent,
    StudentInterestsComponent,
    StudentPersonalDetailsComponent,
    DashboardComponent,
    StudentKnowYouBetterComponent,
    StudentHeadedComponent,
    StudentPreferencesComponent,
    StudentProjectsComponent,
    GlobalStudentProfileUploadComponent,
    AddProjectComponent,
    AboutWorkComponent,
    AddWritingSampleComponent,
    AddAwardsComponent,
    StudentHistoryComponent,
    HistoryViewComponent,
    AddHistoryComponent,
    HistoryFormComponent,
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CarouselModule,
    NgbModule,
    MentionModule,
    PaginationModule,
    NgxDropzoneModule,
    TagInputModule,

    NgxStripeModule.forRoot(environment.stripePublickKey),
    NgMultiSelectDropDownModule.forRoot(),NgSelectModule],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class StudentsModule {}
