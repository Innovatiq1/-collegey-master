import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ParentDashboardComponent } from './parent-dashboard/parent-dashboard.component'
import { ParentRoutingModule} from './parent-routing.module'
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ParentsProfileComponent } from './parents-profile/parents-profile.component';

@NgModule({
  declarations: [ParentDashboardComponent, ParentsProfileComponent],
  imports: [
    CommonModule,
    NgbModule,
    ParentRoutingModule,
    CarouselModule
  ]
})
export class ParentsModule { }
