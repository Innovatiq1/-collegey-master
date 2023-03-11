import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// Services
import { MentorService } from 'src/app/core/services/mentor.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';

// Load City, State and Country
import { Countries, State, Cities } from 'src/app/core/models/static-data.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-metor-profile-detail',
  templateUrl: './metor-profile-detail.component.html',
  styleUrls: ['./metor-profile-detail.component.css']
})
export class MetorProfileDetailComponent implements OnInit {
  profileText:string = "Beginner";
  sections : any[] = [{name:"profile",isOpen:false},{name:"officeHours",isOpen:false},{name:"projects",isOpen:false}]
  
  // Profile and office hours completed
  profilefirstStepCompleted: boolean = false;
  profilesecondStepCompleted: boolean = false;
  MentorProfileInfo:any;
  MentorOfficeInfo:any;
  MentorOfficeTimezone:any;
  public getVideoIntro:any;

  //location
  countries: Countries[] = JSON.parse(localStorage.getItem(AppConstants.KEY_COUNTRIES_DATA));
  states: State[];
  cities: Cities[];
  mentorCity: any;
  mentorState: any;
  mentorCountry: any;

  //Projects
  allProjects: any;
  mentorProjects: any;
  projectStartDate: any;
  projectLastJoinDate: any;
  constructor(
    private mentorService: MentorService,
    private cdr: ChangeDetectorRef,
    private staticDataService: StaticDataService,
    private mentorDashboardService: MentorDashboardService,
  ) { }

  ngOnInit(): void {
    this.getDashboardDetail();
    this.mentorService.getMentorProfile().subscribe((profile) => {
      // this.commonService.getUserDetails().subscribe((user)=>{
        // this.mentorProfileData = profile;
        this.profilefirstStepCompleted  = profile?.mentor_profile?.profile?.is_completed;
        this.profilesecondStepCompleted = profile?.mentor_profile?.officeTimezone?.is_completed;
        this.cdr.detectChanges();
        if (Object.keys(profile).length > 1) {
          // this.progressBarValue = profile.mentor_profile_completion.profile_percentage;
          this.profileText = profile.mentor_profile_completion.profile_text;
          // this.setProfileStepsStatus(profile.mentor_profile_completion.profile_status);
          // this.calculateProfileProgress(profile.mentor_profile_completion.profile_text);
        }
        else {
          this.sections[0].isOpen = true;
        }
      // })
    });

    this.fetchProfiledata();
  }

  fetchProfiledata()
  {
    this.mentorService.getMentorProfile().subscribe((profile) => {
      this.MentorProfileInfo = profile.mentor_profile.profile;
      this.MentorOfficeInfo = profile.mentor_profile.officeHours;
      this.MentorOfficeTimezone = profile.mentor_profile.officeTimezone.timezoneName;

      this.getVideoIntro     = this.MentorProfileInfo?.videoIntroduction;

      this.getCountryList();
      const countryId = this.MentorProfileInfo?.country;
      const stateId   = this.MentorProfileInfo?.state;

      if (stateId) {
        this.getCityList(stateId);
      }
      if (countryId) {
          this.getStateList(countryId);
      }
    });
  }

  //get city name by code
  getCityList(id) {
    this.staticDataService.getCities(id).subscribe(
      (response) => {
        this.cities = response;

        this.cities.forEach(city => {
          if(city.id == this.MentorProfileInfo?.city) {
            this.mentorCity = city.name;
          }
        })
      }
    );
  }

  // get state name by code
  getStateList(id) {
    this.staticDataService.getStates(id).subscribe(
      (response) => {
        this.states = response;
        this.states.forEach(state => {
          if(state.id == this.MentorProfileInfo?.state) {
            this.mentorState = state.name;
          }
        })
      }
    );
  }

  // get country name by code
  getCountryList() {
    this.staticDataService.getCountries().subscribe(
      (response) => {
        this.countries = response;
        this.countries.forEach(country => {
          if(country.id == this.MentorProfileInfo?.country) {
            this.mentorCountry = country.name;
          }
        })
      }
    );
  }

  getDashboardDetail() {
    this.mentorDashboardService.getDashboardDetail().subscribe((res) => {

      this.allProjects = res;
      this.mentorProjects = this.allProjects.projectByMentor;
      this.cdr.detectChanges();
    });
  }


}
