import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileStatus } from 'src/app/core/models/student-dashboard.model';
import { StudentProfile } from 'src/app/core/models/student-profile.model';
import { User } from 'src/app/core/models/user.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  studentProfileData: StudentProfile;
  onBoardingSteps: ProfileStatus;
  progressBarValue = 25;
  isLoading: boolean;
  isSticky: boolean;
  boxScroll: string;

  onConfigChanged: Subscription;
  profileCompletedSubscription: Subscription;
  document: any;

  user: User = JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA)).user;
  constructor() { }

  ngOnInit(): void {
  }

}
