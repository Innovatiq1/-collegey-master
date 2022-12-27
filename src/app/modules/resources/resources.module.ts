import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourcesRoutingModule } from './resources-routing.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonWebinarComponent } from './common/common-webinar/common-webinar.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CommonConferencesComponent } from './common/common-conferences/common-conferences.component';
import { CommonProgrammesComponent } from './common/common-programmes/common-programmes.component';
import { BrowserModule } from '@angular/platform-browser';
import { ActivecoursesComponent } from './activecourses/activecourses.component';
import { CommonCourseComponent } from './common/common-course/common-course.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GlobalStudentProfileUploadComponent } from './global-student-profile-upload/global-student-profile-upload.component';

// Load Library
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  declarations: [
    CommonProgrammesComponent,
    ResourcesRoutingModule.Components,
    CommonWebinarComponent,
    NavBarComponent,
    CommonConferencesComponent,
    ActivecoursesComponent,
    CommonCourseComponent,
    DashboardComponent,
    GlobalStudentProfileUploadComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ResourcesRoutingModule,
    PaginationModule.forRoot(),
    SharedModule,
    NgbModule,
    NgxDropzoneModule,
    TagInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ResourcesModule { }
