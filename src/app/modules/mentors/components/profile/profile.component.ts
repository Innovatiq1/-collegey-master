import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudentProfileStatusText } from 'src/app/core/enums/student-profile-status-text.enum';
import { MentorProfileStatus, ProfileStatus } from 'src/app/core/models/student-dashboard.model';
import { MentorProfile, StudentProfile } from 'src/app/core/models/student-profile.model';
import { User } from 'src/app/core/models/user.model';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { MentorService } from 'src/app/core/services/mentor.service';
import { StudentService } from 'src/app/core/services/student.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { Utils } from 'src/app/shared/Utils';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA)).user;
  onBoardingSteps: MentorProfileStatus;
  mentorProfileData: MentorProfile;
  Profile = false;
  officeStepAction = false;

  sections: any[] = [{ name: "profile", isOpen: false }, { name: "officeHours", isOpen: false }, { name: "projects", isOpen: false }]
  progressBarValue = 0;
  profileText: string = "Beginner";
  isLoading: boolean;
  isSticky: boolean;
  boxScroll: string;

  onConfigChanged: Subscription;
  profileCompletedSubscription: Subscription;
  document: any;
  isProfileCompletedModalShown = false;
  @ViewChild('profileCompletedModal', { static: false })
  profileCompletedModal: ModalDirective;
  currentSection: any = { name: "profile", isOpen: false };
  stepClassActive: any = 'profile-step';

  // Profile and office hours completed
  profilefirstStepCompleted: boolean = false;
  profilesecondStepCompleted: boolean = false;

  constructor(
    private mentorService: MentorService,
    private toastrService: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public configService: ConfigService,
    private el: ElementRef,
    private commonService: CommonService
  ) {

    this.commonService.subscribProfileForm.subscribe((response) => {
      if (response == 'office-step') {
        this.profilefirstStepCompleted = true;
        this.setProfileFormState('officeHours');
        this.stepClassActive = 'office-step';        
      }
      else if (response == 'project-step') {
        this.profilesecondStepCompleted = true;
        this.stepClassActive = 'project-step';
        this.setProfileFormState('projects');        
      }
    });

  }

  ngOnInit() {
    // get student profile data and store data in observable
    this.configService.updateConfig({
      headerClass: 'transparent-header',
      blueLogo: false
    });

    this.mentorService.getMentorProfile().subscribe((profile) => {
      // this.commonService.getUserDetails().subscribe((user)=>{
      this.mentorProfileData = profile;
      this.profilefirstStepCompleted = profile?.mentor_profile?.profile?.is_completed;
      this.profilesecondStepCompleted = profile?.mentor_profile?.officeTimezone?.is_completed;
      if (this.profilefirstStepCompleted && (!this.profilesecondStepCompleted || this.profilesecondStepCompleted)) {
        this.stepClassActive = 'office-step';
      }
      this.cdr.detectChanges();

      if (Object.keys(profile).length > 1) {
        this.progressBarValue = profile.mentor_profile_completion.profile_percentage;
        this.profileText = profile.mentor_profile_completion.profile_text;
        this.setProfileStepsStatus(profile.mentor_profile_completion.profile_status);
        this.calculateProfileProgress(profile.mentor_profile_completion.profile_text);
      }
      else {
        this.sections[0].isOpen = true;
      }
      // })
    });
    var redirection_check = localStorage.getItem("redirectProject");
    if (redirection_check == 'yes') {
      this.sections[1].isOpen = false;
      this.sections[2].isOpen = true;

      this.officeStepAction = false;
      this.stepClassActive = 'project-step';
      this.setProfileFormState('projects');
      localStorage.removeItem('redirectProject');
    }
    else {
      this.profile();
    }
  }
  
  profile()  {
    this.Profile = true;
    this.officeStepAction = true;
    this.stepClassActive = "profile-step";
  }

  submitMentorProfile(profileData, sectionReference = null) {
    console.log("On Submit", profileData, sectionReference)
    let formData: any = {};
    formData.mentor_profile = Object.assign({}, profileData);
    formData = Utils.removeNullFields(formData);

    this.mentorService.saveMentorProfile(formData).subscribe(
      (profile) => {
        if (profile) {
          this.mentorProfileData = profile;
          this.setProfileStepsStatus(profile.mentor_profile_completion.profile_status);
          this.calculateProfileProgress(
            profile.mentor_profile_completion.profile_text
          );
          this.toastrService.success('Profile Updated');
          // this.cdr.detectChanges();
          this.navigatingToDashboard(); // in case of user click save and exit button
          this.openNextAccordionOnSubmit(sectionReference);
          // this.scrollToElement();
          
        }
        window.scroll(0, 500);
      },
      (error) => {
        this.toastrService.error(
          error.message || 'Unable to proceed. Please try after some time'
        );
      }
    );
  }

  onBack(profileData, sectionReference = null) {
    for (let i in this.sections) {
      this.sections[i].isOpen = false;
    }

    if (sectionReference) {
      for (let i in this.sections) {
        // console.log("Checking",this.sections[i].name,sectionReference)
        if (this.sections[i].name === sectionReference && parseInt(i) !== 0) {
          this.sections[parseInt(i) - 1].isOpen = true;
          this.currentSection = this.sections[parseInt(i) - 1];
          this.stepClassActive = this.currentSection.name + '-step';
          break;
        }
      }
    } else {
      // this.checkIsProfileCompleted(sectionReference);
    }
    window.scroll(0, 500);
    // console.log("Current Section",this.currentSection)
  }

  openNextAccordionOnSubmit(sectionReference) {
    // console.log("Open Next",sectionReference);
    for (let i in this.sections) {
      this.sections[i].isOpen = false;
    }
    if (sectionReference) {
      for (let i in this.sections) {
        // console.log("Checking",this.sections[i].name,sectionReference)
        if (this.sections[i].name === sectionReference) {
          this.sections[parseInt(i) + 1].isOpen = true;
          this.currentSection = this.sections[parseInt(i) + 1];
          break;
        }
      }
    } else {
      // this.checkIsProfileCompleted(sectionReference);
    }
  }

  checkIsProfileCompleted(accordionReference) {
    let isProfileCompleted = false;
    this.profileCompletedSubscription = this.mentorService.isProfileCompleted$.subscribe(
      (response) => {
        if (response) {
          isProfileCompleted = response?.mentor_profile_completion.profile_completed;
          this.cdr.detectChanges();
        }
      }
    );

    // trigger profile completed modal after submit personal detail step
    // accordionReference = null in case of personal detail
    if (isProfileCompleted && !accordionReference) {
      this.isProfileCompletedModalShown = true;
    } else {
      this.isProfileCompletedModalShown = false;
      this.router.navigateByUrl('mentors/dashboard');
    }
  }

  navigatingToDashboard() {
    this.profileCompletedSubscription = this.mentorService.wishToExit$.subscribe((exit) => {
      if (exit) {
        this.router.navigateByUrl('mentors/dashboard');
      }
    });
  }

  /**
   * Scroll to next openAccordion
   */
  scrollToElement() {
    const currentAccordion = this.el.nativeElement.querySelector('.panel-open');

    if (currentAccordion) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: currentAccordion.getBoundingClientRect().top + window.scrollY + 75,
      });
    }
  }

  setProfileStepsStatus(steps: MentorProfileStatus) {
    // console.log(steps);
    this.onBoardingSteps = steps;
    if (Object.keys(steps).length > 0) {
      let keys = Object.keys(steps);
      // console.log("Keys",keys)
      for (let j in this.sections) {
        this.sections[j].isOpen = !steps[this.sections[j].name];
        // console.log("Run",this.sections[j],!steps[this.sections[j].name]);
        if (!steps[this.sections[j].name]) {
          this.currentSection = this.sections[j]
          break;
        }
      }
    }
    // console.log("My Sections",this.sections)
  }

  calculateProfileProgress(statusText) {
    this.progressBarValue = 25;
    if (statusText === StudentProfileStatusText.Beginner) {
      this.progressBarValue = this.progressBarValue * 1;
    } else if (statusText === StudentProfileStatusText.Intermediate) {
      this.progressBarValue = this.progressBarValue * 2;
    } else if (statusText === StudentProfileStatusText.Advanced) {
      this.progressBarValue = this.progressBarValue * 3;
    } else if (statusText === StudentProfileStatusText.Expert) {
      this.progressBarValue = this.progressBarValue * 4;
    }
  }

  hideModal(): void {
    this.profileCompletedModal.hide();
  }

  onHidden(): void {
    this.isProfileCompletedModalShown = false;
  }

  ngOnDestroy(): void {
    this.configService.setDefaultConfigs();
    this.profileCompletedSubscription?.unsubscribe();
  }

  setProfileFormState(sectionName) {
    var redirection_check = localStorage.getItem("redirectProject");
    if(sectionName == 'projects')
    {
      if(redirection_check != 'yes' && (this.profilefirstStepCompleted != true || this.profilesecondStepCompleted != true))
      {
        this.toastrService.error('please complete the below steps');
        return;
      }
    }
    for (let i in this.sections) {
      if (this.sections[i].name === sectionName) {
        this.sections[i].isOpen = true;
        this.currentSection = this.sections[i];
        if (this.sections[i].name == 'officeHours') {
          this.stepClassActive = 'office-step';
          this.officeStepAction = true;
        }
        else if (this.sections[i].name == 'projects') {
          this.stepClassActive = 'project-step';
        }
      }
      else {
        this.sections[i].isOpen = false;
      }
    }
  }

}
