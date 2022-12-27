import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumniDashboardComponent } from './alumni-dashboard/alumni-dashboard.component';
import { AlumniroutingModule } from './alumni-routing.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [AlumniDashboardComponent, ProfileComponent],
  imports: [
    CommonModule,
    AlumniroutingModule,
    NgbModule,
    FormsModule,ReactiveFormsModule,SharedModule
  ]
})
export class AlumniModule { }
