import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounselorsRoutingModule } from './counselors-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    CounselorsRoutingModule.components,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    CounselorsRoutingModule, 
    SharedModule
  ]
})
export class CounselorsModule { }
