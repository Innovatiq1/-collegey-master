import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighschooldashboardComponent } from './highschooldashboard/highschooldashboard.component'
import { HighschoolRoutingModule } from './highschool-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [HighschooldashboardComponent, ProfileComponent],
  imports: [
    CommonModule,
    HighschoolRoutingModule,
    NgbModule,
    CarouselModule
  ]
})
export class HighschoolModule { }
