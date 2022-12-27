import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStripeModule } from 'ngx-stripe';

import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsComponent } from './components/projects/projects.component';
//import { ProgramsComponent } from './components/programs/programs.component';
import { CollegeyFeedComponent } from './components/collegey-feed/collegey-feed.component';
import { GroupsComponent } from './components/groups/groups.component';
import { AcademyComponent } from './components/academy/academy.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { QaformsComponent } from './components/qaforms/qaforms.component';
import { EventsComponent } from './components/events/events.component';
import { MentorComponent } from './components/mentor/mentor.component';
import { UniversityComponent } from './components/university/university.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewAnnoucementComponent } from './view-annoucement/view-annoucement.component';
import { DashHeaderComponent } from './components/dash-header/dash-header.component';
import { MentionModule } from 'angular-mentions';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SearchPipe } from 'src/app/core/pipes/search.pipe';
import { GroupsFeedComponent } from './components/collegey-feed/groups-feed/groups-feed.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MentorChatComponent } from './mentor-chat/mentor-chat.component';
import { PaymentDialogComponent } from '../student-dashboard/components/payment-dialog/payment-dialog.component';
import { MentorProfileidComponent } from '../mentors/components/profile/mentor-profileid/mentor-profileid.component';

// UTILS
import { environment } from 'src/environments/environment';

// Load Extra Library
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from "@ng-select/ng-select";
import { TagInputModule } from 'ngx-chips';
import { GlobalProfileUploadComponent } from './components/global-profile-upload/global-profile-upload.component';
import { NewsresourceComponent } from '../student-dashboard/components/newsresource/newsresource.component';

import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TagBlogComponent } from './components/blogs/tag-blog/tag-blog.component';
 
// Libraries include
import {NgxPaginationModule} from 'ngx-pagination';
import { PaginationComponent } from '../../pagination/pagination.component';
import { ProgramsComponent } from './components/programs/programs.component';

@NgModule({
  declarations: [SearchPipe,MentorProfileidComponent,PaginationComponent,DashboardComponent,GroupsFeedComponent, ProjectsComponent,MentorComponent, CollegeyFeedComponent, GroupsComponent, AcademyComponent,BlogsComponent, QaformsComponent, EventsComponent,UniversityComponent, ViewAnnoucementComponent, DashHeaderComponent, ProfileDetailsComponent, MentorChatComponent,PaymentDialogComponent, GlobalProfileUploadComponent, NewsresourceComponent, TagBlogComponent, ProgramsComponent],
  imports: [
    CommonModule,
    StudentDashboardRoutingModule,
    CarouselModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    PaginationModule,
    FormsModule,
    MentionModule,
    NgxDropzoneModule,
    TagInputModule,
    NgxPaginationModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    NgxStripeModule.forRoot(environment.stripePublickKey)
  ],
  exports:[
    DashHeaderComponent,
    PaginationComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class StudentDashboardModule { }
