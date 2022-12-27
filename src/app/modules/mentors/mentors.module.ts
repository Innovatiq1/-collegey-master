import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MentorsRoutingModule } from './mentors-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { MentorsProfileComponent } from './components/profile/mentors-profile/mentors-profile.component';
import { OfficeHoursComponent } from './components/profile/office-hours/office-hours.component';
import { StudentsProjectComponent } from './components/profile/students-project/students-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentChatComponent } from './components/student-chat/student-chat.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { AdminChatComponent } from './components/admin-chat/admin-chat.component';
import { CollegeyOpportunitiesComponent } from './components/collegey-opportunities/collegey-opportunities.component';
import { MetorProfileDetailComponent } from './components/metor-profile-detail/metor-profile-detail.component';
import { ProjectComponent } from './components/project/project.component';
//import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// load libary
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from "@ng-select/ng-select";
import { TagInputModule } from 'ngx-chips';
import { MentorGlobaldashboardComponent } from './components/mentor-globaldashboard/mentor-globaldashboard.component';
import { TabMentorparkComponent } from './components/tab-mentorpark/tab-mentorpark.component';
import { TabMentorOpportunitiesComponent } from './components/tab-mentor-opportunities/tab-mentor-opportunities.component';
import { TabMentorResourcesComponent } from './components/tab-mentor-resources/tab-mentor-resources.component';
import { TabMentorHosteventComponent } from './components/tab-mentor-hostevent/tab-mentor-hostevent.component';
import { MentorPublicProfileComponent } from './components/mentor-public-profile/mentor-public-profile.component';
import { StudentDashboardModule } from '../student-dashboard/student-dashboard.module';
// import { MentorProfileidComponent } from './components/profile/mentor-profileid/mentor-profileid.component';

@NgModule({
  declarations: [ProfileComponent,MentorsProfileComponent, OfficeHoursComponent, StudentsProjectComponent,DashboardComponent, StudentChatComponent, DashboardHeaderComponent, AdminChatComponent, CollegeyOpportunitiesComponent, MetorProfileDetailComponent,ProjectComponent, MentorGlobaldashboardComponent, TabMentorparkComponent, TabMentorOpportunitiesComponent, TabMentorResourcesComponent, TabMentorHosteventComponent, MentorPublicProfileComponent],
  imports: [
    CommonModule,
    MentorsRoutingModule,
    NgbModule,
   // CKEditorModule,
    FormsModule,ReactiveFormsModule,SharedModule,
    NgxDropzoneModule,
    NgMultiSelectDropDownModule,
    NgSelectModule,
    TagInputModule,
    StudentDashboardModule
  ]
})
export class MentorsModule { }
