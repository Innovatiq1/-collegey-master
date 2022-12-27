import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityDashboardComponent } from './university-dashboard/university-dashboard.component';
import { ImpactProfileComponent } from './impact-profile/impact-profile.component';



@NgModule({
  declarations: [UniversityDashboardComponent, ImpactProfileComponent],
  imports: [
    CommonModule
  ]
})
export class UniversityModule { }
