import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { StudentService } from 'src/app/core/services/student.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { map } from 'rxjs/operators';
import { Preferences } from 'src/app/core/models/student-profile.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-preferences',
  templateUrl: './student-preferences.component.html',
  styleUrls: ['./student-preferences.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentPreferencesComponent implements OnInit, OnDestroy {
  payPerYears = AppConstants.PAY_PER_YEAR;
  familyIncomes = AppConstants.FAMILY_INCOME;
 privacy = AppConstants.PRIVACY;
 future_privacy = AppConstants.PRIVACY;
  studentPreferencesForm: FormGroup;
  programe_error:any
  family_income_error :any
  pay_error:any
  scholarshipStatus: boolean = false;

  @Input() studentProfileData;
  @Input() section;
   // tslint:disable-next-line:no-output-on-prefix
   @Output() onSubmitPreferencesForm = new EventEmitter();
   @Output() onBackForm = new EventEmitter();

   preferencesFormSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private staticDataService: StaticDataService,
    private cdr : ChangeDetectorRef,
    private toastrService: ToastrService
  ) {}

  initPreferencesForm() {
    let studentJsonData: Observable<FormGroup>;
    if (this.studentProfileData.student_profile.prefrences && Object.keys(this.studentProfileData).length > 0) {
      studentJsonData = of(this.studentProfileData);
    } else {
      studentJsonData = this.staticDataService.getStudentOnBoardingForm();
    }
    return studentJsonData.pipe(
      map((apiResponse: any) =>
        this.fb.group({
            prefrences: this.generatePreferencesForm(
              apiResponse.student_profile.prefrences
            ),
        })
      )
    );
  }

  generatePreferencesForm(preferences: Preferences) {
    return this.fb.group({
      interested_in_gap: [preferences ? preferences.interested_in_gap : null],
      privacy: [preferences ? preferences.privacy : ''],
      future_privacy: [preferences ? preferences.future_privacy : ''],
      how_would_like_to_pay: [preferences ? preferences.how_would_like_to_pay : null],
      wish_to_apply_for_scholarships: this.generateScholarshipForm(
        preferences ? preferences.wish_to_apply_for_scholarships : null,

      ),
      family_income: [preferences ? preferences.family_income : null],
      is_completed: [false],
    });
  }

  generateScholarshipForm(scholarship): FormGroup {
    return this.fb.group({
      answer: [scholarship ? scholarship.answer : null],
      imoprtance: [scholarship ? scholarship.imoprtance : null],
    });
  }
  saveFunction(event){
    this.programe_error =''

  }
  saveFunction1(event){
    this.pay_error = ''

  }
  saveFunction2(event){
    this.family_income_error =''

  }
  onSubmitForm(exit) {
    let Program =this.studentPreferencesForm.getRawValue().prefrences.interested_in_gap 
    let pay =this.studentPreferencesForm.getRawValue().prefrences.how_would_like_to_pay 
    let inome =this.studentPreferencesForm.getRawValue().prefrences.family_income
    
    if(pay == null || pay == '')
    {
      this.pay_error = "Please select pay per year"
      return;
    }
    else if(inome == null || inome == '')
    {
      this.family_income_error = "Please select family income"
      return;
    }
    
    this.studentService.redirectToDashboard(exit);  // in case of save and exit button click
    let PreferencesFormData = this.studentPreferencesForm.getRawValue();
    PreferencesFormData.prefrences.redirectAction = exit;
    this.onSubmitPreferencesForm.emit(PreferencesFormData);
  }

  onChange(scholarship){
    if (scholarship == "true") {
      this.scholarshipStatus = true;
    } else {
      this.scholarshipStatus = false;
    }
  }

  onFormBack(){
    const formData = this.studentPreferencesForm.getRawValue();
    this.onBackForm.emit(formData);
  }

  ngOnInit(): void {
    this.preferencesFormSubscription = this.initPreferencesForm().subscribe(
      (form) => {
        if (form.get('prefrences').get('wish_to_apply_for_scholarships').get('answer').value == true) {
          this.scholarshipStatus = true;
        } else {
          this.scholarshipStatus = false;
        }
        this.studentPreferencesForm = form;
        this.cdr.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    this.preferencesFormSubscription.unsubscribe();
  }
}
