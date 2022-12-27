import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl, RequiredValidator } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentProfileStatus } from 'src/app/core/enums/student-profile-status.enum';
import { Router, ActivatedRoute } from '@angular/router';

import { Geography, MentorsOfficeHours, MentorsProfile } from 'src/app/core/models/student-profile.model';
import { MentorService } from 'src/app/core/services/mentor.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { Utils } from 'src/app/shared/Utils';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/core/services/common.service';
import { environment, timezone } from 'src/environments/environment';

@Component({
  selector: 'app-office-hours',
  templateUrl: './office-hours.component.html',
  styleUrls: ['./office-hours.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeHoursComponent implements OnInit {

  @Input() mentorProfileData;
  @Input() section;
  @Output() onSubmitOfficeForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();
  officeFormSubscription: Subscription;

  // Office Step Formgroup
  sundayHours: any;
  mondayHours: any;
  tuesdayHours: any;
  wednesdayHours: any;
  thursdayHours: any;
  fridayHours: any;
  saturdayHours: any;
  selectedTimeZone: any;
  timeZoneList: any;
  officeFormGroup: FormGroup;
  submittedProfile: boolean = false;
  msg_success: boolean = false;
  msg_danger: boolean = false;
  userid: any;
  MentorProfileInfo: any;
  officeWorkDay: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  MentorOfficeTimeZone: any;
  mondayClosed: Boolean = false;
  tuesdayClosed: Boolean = false;
  wednesdayClosed: Boolean = false;
  thursdayClosed: Boolean = false;
  fridayClosed: Boolean = false;
  saturdayClosed: Boolean = false;
  sundayClosed: Boolean = false;
  options = ['option1', 'option2', 'option3'];
  searchedOptions = [];
  dropdownSettingsProjectSdg = {};
  sdg_selection: any = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private staticDataService: StaticDataService,
    private mentorService: MentorService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private commonService: CommonService
  ) {
    this.timeZoneList = timezone;
    this.fetchProfiledata();
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user._id;
    this.officeFormGroup = this.formBuilder.group({
      officeHours: this.formBuilder.array([]),
      timezone: ['', Validators.required],
    });
    this.sundayHours = 'Sunday';
    this.mondayHours = 'Monday';
    this.tuesdayHours = 'Tuesday';
    this.wednesdayHours = 'Wednesday';
    this.thursdayHours = 'Thursday';
    this.fridayHours = 'Friday';
    this.saturdayHours = 'Saturday';
  }

  ngOnInit(): void {

  }

  get officeHours(): FormArray {
    return this.officeFormGroup.get("officeHours") as FormArray
  }
  
  // onSeachDropdownValue($event) {
  //   const value = $event.target.value;
  //   searchedOptions = options.filter(option => option.includes(value));
  // }

  onSelectDropdownValue(option) {
    // Do something with selected value
  }

  public hasErrorEvent = (controlName: string, errorName: string) => {
    return this.officeFormGroup.controls[controlName].hasError(errorName);
  };

  createReminder() {
    this.officeFormGroup.patchValue({
      timezone: this.MentorOfficeTimeZone
    });
    for (let i = 0; i < this.officeWorkDay.length; i++) {
      let daysAdd = this.officeWorkDay[i];
      this.addOfficeHours(daysAdd);
    }
  }

  newOfficeHours(): FormGroup {
    return this.formBuilder.group({
      days: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      closed: ['', Validators.required],
    })
  }

  addOfficeHours(dayget: any) {
    let officeArray = this.formBuilder.group({
      days: [dayget, Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      closed: [false, Validators.required],
    })
    this.officeHours.push(officeArray);
  }

  editReminder() {
    this.officeFormGroup.patchValue({
      timezone: this.MentorOfficeTimeZone
    });
    for (let i = 0; i < this.officeWorkDay.length; i++) {
      let officeArray = this.formBuilder.group({
        days: [this.MentorProfileInfo[i]?.days, Validators.required],
        start_time: [this.MentorProfileInfo[i]?.start_time, Validators.required],
        end_time: [this.MentorProfileInfo[i]?.end_time, Validators.required],
        closed: [this.MentorProfileInfo[i]?.closed == 'false' ? false : true, Validators.required],
      })
      // this.officeHours?.controls[i]?.setValue(officeArray)
      // this.cdr.detectChanges();

      this.officeHours.push(officeArray);     
      while (this.officeHours.length > 7) {
        this.officeHours.removeAt(0)
      } 
    }

    if (this.MentorProfileInfo[0]?.closed == 'true') {
      this.mondayClosed = true;
      this.officeHours?.controls[0]?.get('start_time').clearValidators();      
      this.officeHours?.controls[0]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[0]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[0]?.get('end_time').updateValueAndValidity();
    } else {
      this.mondayClosed = false;
    }
    if (this.MentorProfileInfo[1]?.closed == 'true') {
      this.tuesdayClosed = true;
      this.officeHours?.controls[1]?.get('start_time').clearValidators();      
      this.officeHours?.controls[1]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[1]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[1]?.get('end_time').updateValueAndValidity();
    }else {
      this.tuesdayClosed = false;
    }
    if (this.MentorProfileInfo[2]?.closed == 'true') {
      this.wednesdayClosed = true;
      this.officeHours?.controls[2]?.get('start_time').clearValidators();      
      this.officeHours?.controls[2]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[2]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[2]?.get('end_time').updateValueAndValidity();
    }else {
      this.wednesdayClosed = false;
    }
    if (this.MentorProfileInfo[3]?.closed == 'true') {
      this.thursdayClosed = true;
      this.officeHours?.controls[3]?.get('start_time').clearValidators();      
      this.officeHours?.controls[3]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[3]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[3]?.get('end_time').updateValueAndValidity();
    }else {
      this.thursdayClosed = false;
    }
    if (this.MentorProfileInfo[4]?.closed == 'true') {
      this.fridayClosed = true;
      this.officeHours?.controls[4]?.get('start_time').clearValidators();      
      this.officeHours?.controls[4]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[4]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[4]?.get('end_time').updateValueAndValidity();
    }else {
      this.fridayClosed = false;
    }
    if (this.MentorProfileInfo[5]?.closed == 'true') {
      this.saturdayClosed = true;
      this.officeHours?.controls[5]?.get('start_time').clearValidators();      
      this.officeHours?.controls[5]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[5]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[5]?.get('end_time').updateValueAndValidity();
    }else {
      this.saturdayClosed = false;
    }
    if (this.MentorProfileInfo[6]?.closed == 'true') {
      this.sundayClosed = true;
      this.officeHours?.controls[6]?.get('start_time').clearValidators();      
      this.officeHours?.controls[6]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[6]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[6]?.get('end_time').updateValueAndValidity();
    }else{
      this.sundayClosed = false;
    }
    this.cdr.detectChanges();

  }

  closedStatusMonday() {
    if (this.mondayClosed) {
      this.mondayClosed = false; 
      this.officeHours?.controls[0]?.get('start_time').setValidators(Validators.required);      
      this.officeHours?.controls[0]?.get('end_time').setValidators(Validators.required);  
      this.officeHours?.controls[0]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[0]?.get('end_time').updateValueAndValidity();
    } else {
      this.mondayClosed = true;
      this.officeHours?.controls[0]?.get('start_time').clearValidators();      
      this.officeHours?.controls[0]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[0]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[0]?.get('end_time').updateValueAndValidity(); 

      // this.officeHours.at(0).patchValue({
      //   start_time: '00:00',
      //   end_time: '00:00',
      // });
    }
  }
  closedStatusTuesday() {
    if (this.tuesdayClosed) {
      this.tuesdayClosed = false;
      this.officeHours?.controls[1]?.get('start_time').setValidators(Validators.required);      
      this.officeHours?.controls[1]?.get('end_time').setValidators(Validators.required);
      this.officeHours?.controls[1]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[1]?.get('end_time').updateValueAndValidity();  
    } else {
      this.tuesdayClosed = true;
      this.officeHours?.controls[1]?.get('start_time').clearValidators();      
      this.officeHours?.controls[1]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[1]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[1]?.get('end_time').updateValueAndValidity(); 
      // this.officeHours.at(1).patchValue({
      //   start_time: '00:00',
      //   end_time: '00:00',
      // });
    }
  }
  closedStatusWednesday() {
    if (this.wednesdayClosed) {
      this.wednesdayClosed = false;
      this.officeHours?.controls[2]?.get('start_time').setValidators(Validators.required);      
      this.officeHours?.controls[2]?.get('end_time').setValidators(Validators.required);  
      this.officeHours?.controls[2]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[2]?.get('end_time').updateValueAndValidity();
    } else {
      this.wednesdayClosed = true;
      this.officeHours?.controls[2]?.get('start_time').clearValidators();      
      this.officeHours?.controls[2]?.get('end_time').clearValidators(); 
      this.officeHours?.controls[2]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[2]?.get('end_time').updateValueAndValidity(); 
      // this.officeHours.at(2).patchValue({
      //   start_time: '00:00',
      //   end_time: '00:00',
      // });
    }
  }
  closedStatusThursday() {
    if (this.thursdayClosed) {
      this.thursdayClosed = false;
      this.officeHours?.controls[3]?.get('start_time').setValidators(Validators.required);      
      this.officeHours?.controls[3]?.get('end_time').setValidators(Validators.required); 
      this.officeHours?.controls[3]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[3]?.get('end_time').updateValueAndValidity(); 
    } else {
      this.thursdayClosed = true;
      this.officeHours?.controls[3]?.get('start_time').clearValidators();      
      this.officeHours?.controls[3]?.get('end_time').clearValidators();
      this.officeHours?.controls[3]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[3]?.get('end_time').updateValueAndValidity();  
      // this.officeHours.at(3).patchValue({
      //   start_time: '00:00',
      //   end_time: '00:00',
      // });
    }
  }
  closedStatusFriday() {
    if (this.fridayClosed) {
      this.fridayClosed = false;
      this.officeHours?.controls[4]?.get('start_time').setValidators(Validators.required);      
      this.officeHours?.controls[4]?.get('end_time').setValidators(Validators.required); 
      this.officeHours?.controls[4]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[4]?.get('end_time').updateValueAndValidity(); 
    } else {
      this.fridayClosed = true;
      this.officeHours?.controls[4]?.get('start_time').clearValidators();      
      this.officeHours?.controls[4]?.get('end_time').clearValidators();
      this.officeHours?.controls[4]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[4]?.get('end_time').updateValueAndValidity();  
      // this.officeHours.at(4).patchValue({
      //   start_time: '00:00',
      //   end_time: '00:00',
      // });
    }
  }
  closedStatusSaturday() {
    if (this.saturdayClosed) {
      this.saturdayClosed = false;
      this.officeHours?.controls[5]?.get('start_time').setValidators(Validators.required);      
      this.officeHours?.controls[5]?.get('end_time').setValidators(Validators.required); 
      this.officeHours?.controls[5]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[5]?.get('end_time').updateValueAndValidity(); 
    } else {
      this.saturdayClosed = true;
      this.officeHours?.controls[5]?.get('start_time').clearValidators();      
      this.officeHours?.controls[5]?.get('end_time').clearValidators();  
      this.officeHours?.controls[5]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[5]?.get('end_time').updateValueAndValidity();
      // this.officeHours.at(5).patchValue({
      //   start_time: '00:00',
      //   end_time: '00:00',
      // });
    }
  }
  closedStatusSunday() {
    if (this.sundayClosed) {
      this.sundayClosed = false; 
      this.officeHours?.controls[6]?.get('start_time').setValidators(Validators.required);      
      this.officeHours?.controls[6]?.get('end_time').setValidators(Validators.required);  
      this.officeHours?.controls[6]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[6]?.get('end_time').updateValueAndValidity();
    } else {
      this.sundayClosed = true;
      this.officeHours?.controls[6]?.get('start_time').clearValidators();      
      this.officeHours?.controls[6]?.get('end_time').clearValidators();  
      this.officeHours?.controls[6]?.get('start_time').updateValueAndValidity();
      this.officeHours?.controls[6]?.get('end_time').updateValueAndValidity();
      // this.officeHours.at(6).patchValue({
      //   start_time: '00:00',
      //   end_time: '00:00',
      // });
    }
  }


  fetchProfiledata() {
    this.mentorService.getMentorProfile().subscribe((profile) => {
      this.MentorProfileInfo = profile.mentor_profile.officeHours;
      this.MentorOfficeTimeZone = profile.mentor_profile.officeTimezone?.timezoneName;
      this.cdr.detectChanges();
      if (this.MentorProfileInfo.length <= 0) {
        this.createReminder();
      }
      else {
        this.editReminder();
      }
    });
  }

  onSubmitForm(exit) {
    this.submittedProfile = true;
    let obj = this.officeFormGroup.value;
    obj['user'] = this.userid;
        
    if (this.officeFormGroup.invalid || this.officeFormGroup.get('timezone').value == '') {
      return;
    }
    this.mentorService.updateMentorProfileStep02(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        //this.officeFormGroup.reset();
        this.submittedProfile = false;
        this.fetchProfiledata();
        if (exit == true) {
          this.commonService.subscribProfileForm.next('project-step');
        }
        window.scroll(0, 500);
      },
      (err) => {
        this.toastrService.error('office hour not update');
        this.submittedProfile = false;
      },
    );
  }

  onFormBack() {
    const formData = this.officeFormGroup.getRawValue();
    this.onBackForm.emit(formData);
    // window.location.reload();    
  }
}
