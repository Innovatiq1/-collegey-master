import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, Inject, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Subscription, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { MentorsProfile } from 'src/app/core/models/student-profile.model';
import { MentorService } from 'src/app/core/services/mentor.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment, timezone } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// Load City, State and Country
import { Countries, State, Cities } from 'src/app/core/models/static-data.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-mentors-profile',
  templateUrl: './mentors-profile.component.html',
  styleUrls: ['./mentors-profile.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentorsProfileComponent implements OnInit {
  @Input() mentorProfileData;
  @Input() section;
  @Output() onSubmitProfileForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();
  profileFormSubscription: Subscription;

  modalRef: BsModalRef;

  // Profile Step Formgroup

  profileFormGroup: FormGroup;
  submittedProfile: boolean = false;
  msg_success: boolean = false;
  msg_danger: boolean = false;
  userid: any;
  mentorVideointro: any;
  MentorProfileInfo: any;
  public getVideoIntro: any;
  timeZoneList: any;
  mentorExperience: any = [];

  showotherIndustry: boolean = false;
  showotherExpertise: boolean = false;
  showotherInterest: boolean = false;

  isChecked: boolean = false;

  wordCount: any;
  words: any;

  //show word limit
  showWordLimitError: Boolean = false;
  showWordLimitAdviceError: Boolean = false;

  // Country Object 
  countries: Countries[] = JSON.parse(localStorage.getItem(AppConstants.KEY_COUNTRIES_DATA));
  states: State[];
  cities: Cities[];
  selectedCity: any;
  profileFavBooksArray: any = [];

  interestArray: any[] = [];
  canHelpArray: any[] = [];
  dropdownSettingsInterest = {};
  dropdownSettingsCanHelp = {};
  selectedTimeZone: any; 
  showClgLoader: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: any,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private staticDataService: StaticDataService,
    private mentorService: MentorService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private http: HttpClient,
    private commonService: CommonService,
    public sanitizer: DomSanitizer,
    private modalService: BsModalService,
  ) {
    this.timeZoneList = timezone;
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user._id;
    this.fetchProfiledata();
    this.profileFormGroup = this.formBuilder.group({
      fullLegalName: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      country: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      state: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      city: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      timezone: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      professionalTitle: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      website: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      experience: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      lastEducationalInstitutionAttended: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      lastCollegeDegree: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      industry: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      other_industry: [''],
      expertise: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      other_expertise: [''],
      interest: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      other_interest: [''],
      can_help: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      favBooks: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      linkedIn: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      aboutYou: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      adviceToYoungPeople: [''],
      shouldAgree: [null, [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    });
    for (let i = 1; i <= 100; i++) {
      this.mentorExperience.push(i);
    }

    this.interestArray = [
      "Technology",
      "Entrepreneurship",
      "Social Innovation & Social Entrepreneurship",
      "Arts & Humanities",
      "Design",
      "Creative Arts",
      "Environment",
      "Social Impact",
      "Communication & Marketing",
      "Sports",
      "Mental Models",
      "Public Policy",
      "Design Thinking",
      "AI",
      "AR & VR",
      "Civic Engagement",
      "Interfaith",
      "Empathy & Compassion",
      "Intercultural Communication",
      "Research",
      "Education",
      "Public Diplomacy",
      "Wellbeing & Mindfulness",
      "Other",
    ];

    this.canHelpArray = [
      "Project Management",
      "Job Shadowing",
      "Making a career change",
      "Resume/CV critique",
      "Making Professional Introductions",
    ];

    this.dropdownSettingsInterest = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      limitSelection: 5
    };

    this.dropdownSettingsCanHelp = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      limitSelection: 5
    };
  }


  eventCheck(event) {
    if (event.target.checked) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  ngOnInit(): void {
  }

  wordCounter(event) {
    if (event.keyCode != 32) {
      this.wordCount = event.target.value ? event.target.value.split(/\s+/) : 0;
      this.words = this.wordCount ? this.wordCount.length : 0;
    }
    if (this.words > 100) {
      this.showWordLimitError = true;
    } else {
      this.showWordLimitError = false;
    }
  }
  wordCounterAdvice(event) {
    if (event.keyCode != 32) {
      this.wordCount = event.target.value ? event.target.value.split(/\s+/) : 0;
      this.words = this.wordCount ? this.wordCount.length : 0;
    }
    if (this.words > 50) {
      this.showWordLimitAdviceError = true;
    } else {
      this.showWordLimitAdviceError = false;
    }
  }
  wordCounts(text, limit) {
    this.wordCount = text ? text.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
    if (this.words > limit) {
      return true;
    } else {
      return false;
    }
  }




  public hasError = (controlName: string, errorName: string) => {
    return this.profileFormGroup.controls[controlName].hasError(errorName);
  };


  onChangeSomeTypes(event: any) {
    if (event.target.value == 'other_industry') {
      this.showotherIndustry = true;
    }
    else {
      this.showotherIndustry = false;
    }
    if (event.target.value == 'other_expertise') {
      this.showotherExpertise = true;
    }
    else {
      this.showotherExpertise = false;
    }
    if (event.target.value == 'other_interest') {
      this.showotherInterest = true;
    }
    else {
      this.showotherInterest = false;
    }
  }

  onSelectCountry(country) {
    this.getStateList(country.target.value);
    this.profileFormGroup.patchValue({
      state: '',
      city: '',
    });
  }



  getStateList(id) {
    this.staticDataService.getStates(id).subscribe(
      (response) => {
        this.states = response;
        this.profileFormGroup.get('state').enable();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastrService.error(error.message || 'Oops something went wrong');
      }
    );
  }

  onSelectCity(city) {
    this.selectedCity = city.target.value;
  }

  getCityList(id) {
    this.staticDataService.getCities(id).subscribe(
      (response) => {
        this.cities = response;
        this.profileFormGroup.get('city').enable();
        this.cities.forEach(city => {
          if (city.id == this.profileFormGroup.get('city').value) {
            this.selectedCity = city.name;
            this.cdr.detectChanges();
          }
        })
      },
      (error) => {
        this.toastrService.error(error.message || 'Oops something went wrong');
      }
    );
  }

  onSelectState(state) {
    this.getCityList(state.target.value);
  }

  removeVideoConformation(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  removeVideo() {
    this.getVideoIntro = '';
    this.modalRef.hide();
  }

  fetchProfiledata() {
    this.mentorService.getMentorProfile().subscribe((profile) => {
      this.MentorProfileInfo = profile.mentor_profile?.profile;
      this.getVideoIntro = this.MentorProfileInfo?.videoIntroduction;

      const countryId = this.MentorProfileInfo?.country;
      const stateId = this.MentorProfileInfo?.state;

      if (stateId) {
        this.getCityList(stateId);
      }
      if (countryId) {
        this.getStateList(countryId);
      } else {
        this.profileFormGroup.get('state').disable();
        this.profileFormGroup.get('city').disable();
      }
      if (this.MentorProfileInfo?.expertise == 'other_expertise') { this.showotherExpertise = true; }
      if (this.MentorProfileInfo?.industry == 'other_industry') { this.showotherIndustry = true; }
      if (this.MentorProfileInfo?.interest == 'other_interest') { this.showotherInterest = true; }
      if (this.MentorProfileInfo?.shouldAgree == true) { this.isChecked = true; }

      this.profileFormGroup.patchValue({
        fullLegalName: this.MentorProfileInfo?.fullLegalName,
        
        country: this.MentorProfileInfo?.country,
        state: this.MentorProfileInfo?.state,
        city: this.MentorProfileInfo?.city,
        timezone: this.MentorProfileInfo?.timezone,
        professionalTitle: this.MentorProfileInfo?.professionalTitle,
        website: this.MentorProfileInfo?.website,
        experience: this.MentorProfileInfo?.experience,
        lastEducationalInstitutionAttended: this.MentorProfileInfo?.lastEducationalInstitutionAttended,
        lastCollegeDegree: this.MentorProfileInfo?.lastCollegeDegree,

        industry: this.MentorProfileInfo?.industry,
        other_industry: this.MentorProfileInfo?.other_industry,

        expertise: this.MentorProfileInfo?.expertise,
        other_expertise: this.MentorProfileInfo?.other_expertise,

        interest: this.MentorProfileInfo?.interest,
        other_interest: this.MentorProfileInfo?.other_interest,

        can_help: this.MentorProfileInfo?.can_help,
        favBooks: this.MentorProfileInfo?.favBooks,
        linkedIn: this.MentorProfileInfo?.linkedIn,
        aboutYou: this.MentorProfileInfo?.aboutYou,
        adviceToYoungPeople: this.MentorProfileInfo?.adviceToYoungPeople,
        shouldAgree: this.MentorProfileInfo?.shouldAgree,
      });

      setTimeout(() => {
        this.profileFormGroup.patchValue({
          state: this.MentorProfileInfo?.state,
          city: this.MentorProfileInfo?.city,
        });
      }, 1500);

    });
  }

  onSubmitForm(exit) {
    this.submittedProfile = true;
    this.profileFavBooksArray = [];
    let obj = this.profileFormGroup.value;
    obj['user'] = this.userid;
    obj['mentorVideointro'] = this.mentorVideointro;

    for (let i = 0; i < obj.favBooks.length; i++) {
      if (obj.favBooks[i].value) {
        this.profileFavBooksArray.push(obj.favBooks[i].value);
      }
      else {
        this.profileFavBooksArray.push(obj.favBooks[i]);
      }
    }

    const aboutYouCount = this.wordCounts(this.profileFormGroup.value.aboutYou, 100)
    const adviceToYoungPeopleCount = this.wordCounts(this.profileFormGroup.value.adviceToYoungPeople, 50)

    if (this.profileFormGroup.invalid || !this.profileFormGroup.get('shouldAgree').value || aboutYouCount || adviceToYoungPeopleCount) {
      return;
    }
    obj['favBooks'] = this.profileFavBooksArray;

    this.mentorService.updateMentorProfileStep01(obj).subscribe(
      (response) => {
        this.updateProfile();
        this.toastrService.success(response.message);
        this.profileFormGroup.reset();
        this.submittedProfile = false;
        this.fetchProfiledata();
        if (exit == true) {
          this.commonService.subscribProfileForm.next('office-step');
        }
        window.scroll(0, 500);
      },
      (err) => {
        this.toastrService.error('profile not update');
        this.submittedProfile = false;
      },
    );
    
  }

  updateProfile(){    
    this.mentorService.onProfileUpdate();    
  }

  uploadFileApi(file) {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      formData.append('files', file);
      this.http.post(environment.apiEndpointNew + 'public/uploadFile', formData)
        .subscribe((res: any) => {
          resolve(res.url);
        }, (err => {
          reject(err);
        }))
    })
  }

  uploadRecordVideo(event) {
    this.showClgLoader = true;
    if (event.target.files[0].size / 1024 / 1024 > 50) {
      this.toastrService.error('The file is too large. Allowed maximum size is 50 MB.');
      return;
    }
    if (event.target.files[0].type != 'video/mp4') {
      this.toastrService.error('Allowed only Mp4 & Allowed maximum size is 50 MB');
      return;
    }
    this.uploadFileApi(event.target.files[0]).then((data) => {
      this.showClgLoader = false;
      this.mentorVideointro = data;
      this.getVideoIntro = '';
      this.cdr.detectChanges();
      this.getVideoIntro = data;
      this.cdr.detectChanges();
    }).catch((err) => {
      this.toastrService.error('Video upload faild');
    })
  }

}
