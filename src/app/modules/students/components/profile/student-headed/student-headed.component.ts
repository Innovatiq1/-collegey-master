import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,AbstractControl} from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { Countries } from 'src/app/core/models/static-data.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { map } from 'rxjs/operators';
import {
  Headed,
  ExpectedYearToStart,
  WishToStudy,
  TestInfo,
  InstituteArray
} from 'src/app/core/models/student-profile.model';
import { CalendarCellViewModel } from 'ngx-bootstrap/datepicker/models';
import { Utils } from 'src/app/shared/Utils';
import { StudentProfileStatus } from 'src/app/core/enums/student-profile-status.enum';
import { StudentService } from 'src/app/core/services/student.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-headed',
  templateUrl: './student-headed.component.html',
  styleUrls: ['./student-headed.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentHeadedComponent implements OnInit, OnDestroy {
  studentHeadedForm: FormGroup;
  studentHeadedFormSubscription: Subscription;
  // studentstatus = [];
  studentstatus:any = [];
  testStatus: any;
 
  @Input() studentProfileData;
  @Input() section;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSubmitHeadedForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();

  countries: Countries[] = JSON.parse(localStorage.getItem('countries_data'));
  studentTests = AppConstants.STUDENT_TESTS;
  studentSubjects = AppConstants.STUDENT_SUBJECT;
  testInfoArray: FormArray;
  institutesFormArray: FormArray;
  instituteArray: any[] = [];
  wishToStudyArray: FormArray;
  degree = AppConstants.COLLEGE_DEGREE;
  takenTests = AppConstants.TAKEN_TESTS;
  yearValidations:any
  degreeType:any
  degreeValidations:any
  countryValidations:any
  testValidations:any
  instituteValidations:any
  
  countryName=[];
  selectedItems = [];
  dropdownSettings:{};
  constructor(
    private fb: FormBuilder,
    private staticDataService: StaticDataService,
    private cdr: ChangeDetectorRef,
    private studentService: StudentService,
    private datePipe:DatePipe,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.countries.map(country =>{
     this.countryName.push({item_id:country.id,item_text:country.name})
   })
    
   this.dropdownSettings = {
     singleSelection: false,
     idField: 'item_id',
     textField: 'item_text',
     selectAllText: 'Select All',
     unSelectAllText: 'UnSelect All',
     itemsShowLimit: 4,
     allowSearchFilter: true,
     limitSelection: 4,
   };
   
   this.studentHeadedFormSubscription = this.initStudentHeadedForm().subscribe(
     (form) => {  
       this.studentHeadedForm = form;
       let countryData = []
       this.studentHeadedForm.value.headed.preferred_countries.forEach(country=>{
        
        this.countries.forEach((count)=>{
          if(count.id == country){
            countryData.push({item_id:count.id,item_text:count.name}) 
          }
        })
      })
      
      // this.studentHeadedForm.value.headed.preferred_countries = countryData
      this.studentHeadedForm.controls['headed'].patchValue({
        preferred_countries : countryData
      })
      // console.log("Student headed form",this.studentHeadedForm,countryData)
       this.testInfoArray = Utils.typeCastToFormArray(
         this.studentHeadedForm,
         StudentProfileStatus.HEADED,
         'test_info'
       );
       this.institutesFormArray = Utils.typeCastToFormArray(
         this.studentHeadedForm,
         StudentProfileStatus.HEADED,
         'institutes_Wishlist'
       );
       this.wishToStudyArray = Utils.typeCastToFormArray(
         this.studentHeadedForm,
         StudentProfileStatus.HEADED,
         'wish_to_study'
       );
       this.cdr.detectChanges();
     }
   );
 }
 onChange(event){
   this.yearValidations=''
 }
 saveFunction(event){
   this.degreeValidations=''
 }
 testStatusChange(event){
    // console.log("event===>", event); 
 }
  initStudentHeadedForm() {
    let studentJsonData: Observable<FormGroup>;
    if (this.studentProfileData.student_profile.headed && Object.keys(this.studentProfileData).length > 0) {
      studentJsonData = of(this.studentProfileData);
    } else {
      studentJsonData = this.staticDataService.getStudentOnBoardingForm();
    }
    return studentJsonData.pipe(
      map((apiResponse: any) =>
        this.fb.group({
          headed: this.createHeadedForm(apiResponse.student_profile.headed),
        })
      )
    );
  }


  onOpenCalendarYear(container) {
    container.yearSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('year');
  }

  // create student headed step form group
  createHeadedForm(headed: Headed): FormGroup {
    this.selectedItems = headed.preferred_countries;
    return this.fb.group({    
      expected_year_to_start: this.createYearToStartFormGroup(
        headed.expected_year_to_start 
      ), 
      wish_to_study: this.createWishToStudyFormArray(headed.wish_to_study),
      preferred_countries: [headed.preferred_countries],
      test_info: this.createTestInfoArray(headed.test_info),
      institutes_Wishlist: this.createInstituteArray(headed.institutes_Wishlist),
      is_completed: false,
    });
    
  }

  createTestInfoArray(testInfo: TestInfo[]): FormArray {
    return this.fb.array(
      testInfo.length > 0
        ? testInfo.map((test) => this.addStudentTest(test))
        : [this.addStudentTest()]
    );
  }

  createInstituteArray(institute: InstituteArray[]): FormArray {
    return this.fb.array(
      institute?.length > 0
        ? institute.map((institute) => this.addInstitute(institute))
        : [this.addInstitute()]
    );
  }

  // it will return test info form group
  addStudentTest(testInfo?): FormGroup {
    return this.fb.group({
      test_name: [testInfo ? testInfo.test_name : null],
      test_status: [testInfo ? testInfo.test_status : null],
      current_score: [testInfo ? testInfo.current_score : null],
      test_date: [testInfo ? moment(testInfo.test_date).format('YYYY-MM-DD') : null], 
      duration: [testInfo ? moment(testInfo.duration).format('YYYY-MM-DD') : null], 
    });
  }

  addInstitute(institute?): FormGroup {
    return this.fb.group({
      institute_name: [institute ? institute.institute_name : null],
    });
  }

  onstatus(value,index){
    let status = this.studentstatus[index] =value.value.test_status;
    this.studentstatus.push(status);
  }
  
  onRemoveWebsite(index) {
      this.testInfoArray.removeAt(index);
  }

  onAddInstitute() { 
    this.institutesFormArray.push(this.addInstitute());
  }
  onRemoveInstitute(index) {
      this.institutesFormArray.removeAt(index);
  }

  // form group to form array
  onAddStudentTests() { 
    this.testInfoArray.push(this.addStudentTest());
  }

  onRemoveStudentTests(index) {
    this.testInfoArray.removeAt(index);
  }

  onRemoveWishTOStudy(index) {
    this.wishToStudyArray.removeAt(index);
  }


  onAddWishToStudy() {
    this.wishToStudyArray.push(this.addWishToStudy());
  }


  addWishToStudy(study = null): FormGroup {
    return this.fb.group({
      grade: [study ? study.grade : null],
      subjects: [study ? study.subjects : null],
      majors: [study ? study.majors : null],
    });
  }

  // create createWishToStudyFormArray
  createWishToStudyFormArray(study: WishToStudy[]): FormArray {
    return this.fb.array(
      study.length > 0
        ? study.map((test) => this.addWishToStudy(test))
        : [this.addWishToStudy()]
    );
  }

  // create year to start form group
  createYearToStartFormGroup(expectedYear: ExpectedYearToStart): FormGroup {
    return this.fb.group({
      duration: [expectedYear ? (expectedYear.duration ? this.datePipe.transform(new Date(expectedYear.duration), 'yyyy-MM-dd') : null) : null],
      grade: [expectedYear ? expectedYear.grade : null],
      year: [expectedYear ? parseInt(expectedYear.year) : null],
      other_degree: [expectedYear ? expectedYear.other_degree: null],
      preferred_countries: [expectedYear ? expectedYear.preferred_countries: null],
    });
  }
  changeCountry(event){
    this.countryValidations =''
  }

  onSubmitForm(exit) {
    // submit form
    // in case of save and exit button click
    this.studentService.redirectToDashboard(exit);
    const formData = this.studentHeadedForm.getRawValue();
   
    
      // let flag = true;
      // let Validation = formData.headed.test_info.filter(r => r.test_name === '');
      // console.log("==========",Validation)
      
  
    // console.log("======",formData)
    // console.log("formData.headed.expected_year_to_start.year",formData.headed.expected_year_to_start.year);
    if(!formData.headed.expected_year_to_start.grade){
      this.degreeValidations='Degree Type is required'
        return;
      }else if(!formData.headed.expected_year_to_start.year)
    {
      this.yearValidations='Expected Year is required'
      return;
    }else if(!formData.headed.preferred_countries[0])
    {
      this.countryValidations='Country is required'
      return;
    }else if(!formData.headed.test_info)
    {
      this.testValidations='Test Info is required'
      return;
    }
    // else if(formData.headed.preferred_countries[0].item_text ){
    //   this.countryValidations=''
    //   return;
      
    // }

    this.studentService.saveFutureEducation(formData.headed).subscribe(
      (response) => {
        //this.toastrService.success('Details added successfully');
      },
      // (error) => {
      //   this.toastrService.error(error.message || 'Oops something went wrong');
      // }
    );
    //console.log("hiiiiiii",formData.headed.test_info);
    formData.headed.preferred_countries = formData.headed.preferred_countries.map(country=>{
      let cust_countryObj = {"item_id":country.item_id,"item_text":country.item_text};
      return cust_countryObj;
    })

    if (formData.headed.expected_year_to_start.year) {
      formData.headed.expected_year_to_start.year = new Date(
        formData.headed.expected_year_to_start.year
      ).getFullYear();
    }
    formData.headed.test_info.forEach((test) => {
      if (test.test_date) {
        test.test_date = Utils.transformNumericDate(test.test_date);
      }
    });
    
    formData.headed.redirectAction = exit;
    // console.log("formData==>", formData);
    this.onSubmitHeadedForm.emit(formData);
  }

  onFormBack(){
    const formData = this.studentHeadedForm.getRawValue();
    this.onBackForm.emit(formData);
  }
  
  addingPreferredCountries(coutries) {
    // console.log("Preferred countries",coutries,this.studentHeadedForm)
  }

  ngOnDestroy(): void {
    this.studentHeadedFormSubscription.unsubscribe();
  }
}
