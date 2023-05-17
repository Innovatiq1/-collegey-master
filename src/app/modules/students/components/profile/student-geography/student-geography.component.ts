import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Countries, State, Cities } from 'src/app/core/models/static-data.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, of, iif } from 'rxjs';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { map } from 'rxjs/operators';
import { Geography } from 'src/app/core/models/student-profile.model';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/core/services/student.service';
import { environment, timezone } from 'src/environments/environment';
import { Utils } from 'src/app/shared/Utils';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-student-geography',
  templateUrl: './student-geography.component.html',
  styleUrls: ['./student-geography.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentGeographyComponent implements OnInit, OnDestroy {
  @Input() studentProfileData;
  @Input() section;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSubmitGeographyForm = new EventEmitter();
  @Output() submitGeographyForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();

  countries: Countries[] = JSON.parse(
    localStorage.getItem(AppConstants.KEY_COUNTRIES_DATA));

  states: State[];
  cities: Cities[];
  isFormCompleted = false;

  citySelected: number;
  stateSelected: number;
  changeCounty: boolean = false;

  citizenship = '';
  timezone1 = '';
  country = '';

  geographyFormGroup: FormGroup;
  geographyFormSubscription: Subscription;
  selectedCity: any;
  timeZoneList: any;

  // Validation Error

  country_error: boolean = false;
  state_error: boolean = false;
  city_error: boolean = false;
  citizenship_error: boolean = false;
  timeZone_error: boolean = false;

  country_errorMsg: any;
  state_errorMsg: any;
  city_errorMsg: any;
  citizenship_errorMsg: any;
  timeZone_errorMsg: any;

  //output data
  outputCity: any;
  outputState: any;
  outputCountry: any;
  selectedTimeZone: any; 
  constructor(
    private staticDataService: StaticDataService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
  ) {
    this.timeZoneList = timezone;
  }

  initGeographyForm() {

    let studentJsonData: Observable<FormGroup>;
    if (this.studentProfileData?.student_profile?.geography && Object.keys(this.studentProfileData).length > 0) {
      studentJsonData = of(this.studentProfileData);
    } else {
      studentJsonData = this.staticDataService.getStudentOnBoardingForm();
    }

    return studentJsonData.pipe(
      map((apiResponse: any) =>
        this.fb.group({
          geography: this.createGeographyForm(
            apiResponse.student_profile?.geography
          ),
        }),
      )
    );
  }

  onSelectTimezone(event) {
    this.timeZone_error = false;
  }

  createGeographyForm(geography: Geography) {
    this.selectedTimeZone = geography.timezone;
    return this.fb.group({
      citizenship: [geography ? geography.citizenship : null],
      timezone: [geography ? geography.timezone : null],
      country: [geography ? geography.country : null],
      city: [geography ? geography.city : null],
      state: [geography ? geography.state : null],
      city_problem: [geography ? geography.city_problem : null],
      city_projects: [geography ? geography.city_projects : null],
      is_completed: [false],
    });
  }

  onSelectCountry(country) {
    this.changeCounty = true;
    // console.log("Select Country", this.geographyFormGroup
    //   .get('geography')
    //   .get('country').value, country.target.value)
    this.getStateList(country.target.value);
    this.country_error = false;
  }
  getStateList(id) {
    this.staticDataService.getStates(id).subscribe(
      (response) => {
        this.states = response;
        if (this.changeCounty) {
          if (this.states.length > 0) {
            this.stateSelected = this.states[0]?.id;
            this.state_error = false;
            this.getCityList(this.states[0]?.id);
            this.cdr.detectChanges();
          } else {
            this.cities = [];
            this.citySelected = 11111111111;
            this.states = [];
            this.stateSelected = 11111111111;
          }
        }
        this.cdr.detectChanges();
      },
      (error) => {
        // this.toastrService.error(error.message || 'Oops something went wrong');
      }
    );
  }


  onSelectCity(city) {
    this.citySelected = city.target.value;
    this.selectedCity = city.target.value;
    this.city_error = false;
  }

  valuechange(event) {
    this.citizenship_error = false;
  }

  getCityList(id) {
    this.staticDataService.getCities(id).subscribe(
      (response) => {
        if (response.length > 0) {
          this.cities = response;
          this.city_error = false;
          if (this.changeCounty) {
            this.citySelected = this.cities[0]?.id;
          }
        } else {
          this.cities = [];
          this.citySelected = 11111111111;
        }
        this.cdr.detectChanges();
      },
      (error) => {
        // this.toastrService.error(error.message || 'Oops something went wrong');
      }
    );
  }

  onSelectState(state) {
    this.stateSelected = state.target.value;
    this.getCityList(state.target.value);
    this.state_error = false;
  }


  ngOnInit(): void {
    // console.log(this.countries)
    this.geographyFormSubscription = this.initGeographyForm().subscribe(
      (form) => {
        this.geographyFormGroup = form;
        this.citySelected = this.geographyFormGroup.get('geography').get('city').value;
        this.stateSelected = this.geographyFormGroup.get('geography').get('state').value;

        // get Country Id for fetch state
        const countryId = this.geographyFormGroup
          .get('geography')
          .get('country').value;

        // get state Id for fetch city

        if (this.stateSelected) {
          this.getCityList(this.stateSelected);
        }

        if (countryId) {
          this.getStateList(countryId);
        } else {
          // disable state and city formControl on initial time
          // this.geographyFormGroup.get('geography').get('state').disable();
          // this.geographyFormGroup.get('geography').get('city').disable();
        }

        this.cdr.detectChanges();
      }
    );

  }

  onSubmitForm(exit) {
    let data = this.geographyFormGroup.getRawValue();

    this.country = data.geography.country
    this.citizenship = data.geography.citizenship;
    this.timezone1 = data.geography.timezone;
    if(exit){
    if (data?.geography?.country == null || data?.geography?.country == '') {
      this.country_error = true;
      this.country_errorMsg = 'Please Select County';
      return;
    }
    // else if (data?.geography?.state == null || data?.geography?.state == '') {
    //   this.state_error = true;
    //   this.state_errorMsg = 'Please Select State';
    //   return;
    // }
    // else if (data?.geography?.city == null || data?.geography?.city == '') {
    //   this.city_error = true;
    //   this.city_errorMsg = 'Please Select City';
    //   return;
    // }
    else if (data?.geography?.citizenship == null || data?.geography?.citizenship == '') {
      this.citizenship_error = true;
      this.citizenship_errorMsg = 'Citizenship is Required';
      return;
    }
    else if (data?.geography?.timezone == null || data?.geography?.timezone == '') {
      this.timeZone_error = true;
      this.timeZone_errorMsg = 'TimeZone is Required';
      return;
    }
    else {
      this.studentService.redirectToDashboard(exit);


      let geographyFormData = this.geographyFormGroup.getRawValue();


      let outputObj = {
        city: data?.geography?.city == 11111111111 ? 0 : data?.geography?.city,
        state: data?.geography?.state,
        country: data?.geography?.country,
      }


      geographyFormData.geography.redirectAction = exit;
      this.onSubmitGeographyForm.emit(geographyFormData);
      this.commonService.sendUpdate(outputObj);
    }
  }else {
      this.studentService.redirectToDashboard(exit);


      let geographyFormData = this.geographyFormGroup.getRawValue();


      let outputObj = {
        city: data?.geography?.city == 11111111111 ? 0 : data?.geography?.city,
        state: data?.geography?.state,
        country: data?.geography?.country,
      }


      geographyFormData.geography.redirectAction = exit;
      this.onSubmitGeographyForm.emit(geographyFormData);
      this.commonService.sendUpdate(outputObj);
    }
  }

  ngOnDestroy(): void {
    this.geographyFormSubscription.unsubscribe();
  }

  validateCitizenship(event) {
    const citiValue = event.target.value;
    let citiLength = citiValue.length;
    if (citiLength > 30) {
      this.citizenship_error = true;
      this.citizenship_errorMsg = "Citizenship should be less than 30 Charcters";
      return;
    } else {
      this.citizenship_error = false;
    }
    var regex = new RegExp("^[0-9a-zA-Z_\. ]+$");
    if (regex.test(citiValue)) {
      this.citizenship_error = false;
      return true;
    } else {
      this.citizenship_error = true;
      this.citizenship_errorMsg = "Citizenship is Required";
      event.preventDefault();
      return false;
    }

  }

}
