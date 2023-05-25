import { Component, OnInit, ChangeDetectionStrategy, EventEmitter,
  Input, Output, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { Education, History } from 'src/app/core/models/student-profile.model';
import { Observable, of, Subscription } from 'rxjs';
import { FormGroup, FormArray, FormBuilder, AbstractControl, Validators, FormControl } from '@angular/forms';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { map } from 'rxjs/operators';
import { StudentService } from 'src/app/core/services/student.service';
import { StudentEducationService } from 'src/app/core/services/student-education.service';
import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { CommonService } from 'src/app/core/services/common.service';
import { QualificationType } from './components/history-form/history-form.component';
import { AddHistoryComponent } from './components/add-history/add-history.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

const DEFAULT_DURATION = 300;

@Component({
 selector: 'app-student-history',
 templateUrl: './student-history.component.html',
 styleUrls: ['./student-history.component.css'],
 changeDetection: ChangeDetectionStrategy.OnPush,
 animations: [
   trigger('collapse', [
     state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
     state('true', style({ height: '0', visibility: 'hidden' })),
     transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
     transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
   ])
 ]
})
export class StudentHistoryComponent implements OnInit, OnChanges, OnDestroy {
 studentHistoryForm: FormGroup;
 @Input() studentProfileData;
 @Input() section;
 // tslint:disable-next-line:no-output-on-prefix
 @Output() onSubmitHistoryForm = new EventEmitter();
 @Output() onUpdateEducationStatus = new EventEmitter();
 @Output() onBackForm = new EventEmitter();

 removeIndex: any[] = [];
 removeEdu: Boolean = false;
 historyFormSubscription: Subscription;
 educationFormArray: FormArray;
 collapsed = true;
 userInfo: User = new User();
 qualification:  string;
 hideQualificationChangeOption = false;

 modalRef: BsModalRef;
 // qualificationType: string;

 userTypeList = [
   { id: 1, name: 'high school student',  value: 'School Student'},
   { id: 2, name: 'high school graduate', value: 'Class 12th Graduate'},
   { id: 3, name: 'college student' ,  value: 'College Student'},
   { id: 4, name: 'college graduate', value: 'College Graduate' },
 ];
 qualificationTypeSubscription: Subscription;
 qualificationType = QualificationType;
 showErrorMessage: boolean;

 constructor(
   private fb: FormBuilder,
   private staticDataService: StaticDataService,
   private studentService: StudentService,
   private studentEducationService: StudentEducationService,
   private cdr: ChangeDetectorRef,
   private authService: AuthService,
   private commonService: CommonService,
   private modalService: BsModalService,

 ) {}
 
 initHistoryForm() {
   let studentJsonData: Observable<FormGroup>;
   if (this.studentProfileData.student_profile?.history_updated && Object.keys(this.studentProfileData).length > 0) {
     studentJsonData = of(this.studentProfileData);
   } else {
     studentJsonData = this.staticDataService.getStudentOnBoardingForm();
   }
   return studentJsonData.pipe(
     map((apiResponse: any) =>
       this.fb.group({
         history_updated: this.generateHistoryForm(
             apiResponse.student_profile?.history_updated
           ),
       })
     )
   );
 }

 Custinitialize(data) {
   // console.log("custIntttii",data);
 }

 generateHistoryForm(history_updated: History) {
   return this.fb.group({
     education: this.fb.array(history_updated.education.length > 0 ?
       history_updated.education.map(item => this.studentEducationService.createEducationFormGroup(item)) :
     [this.studentEducationService.createEducationFormGroup()]),
     curious_about: [history_updated ? history_updated.curious_about : null],
     is_completed: [false]
   });
 }

 typeCastToFormArray(formGroup: AbstractControl) {
   return formGroup as FormArray;
 }

 getUserInfo() {
   const loggedInInfo = this.authService.getUserInfo();
   this.userInfo = loggedInInfo ? loggedInInfo.user : null;
   this.qualification = this.userInfo.qualification;
 }

 collapse() {
   this.collapsed = true;
   this.commonService.uploadProfile({qualification: this.qualification}).subscribe(response => {
       const loggedInInfo = this.authService.getUserInfo();
       this.userInfo.qualification = response.qualification;
       loggedInInfo.user = this.userInfo;
       localStorage.setItem(
         AppConstants.KEY_USER_DATA,
         JSON.stringify(loggedInInfo)
       );
   });

   this.studentEducationService.getQualificationType(this.qualification);
 }

 // add tags in dropdown
 addTagFn(name) {
   return { name};
 }

 markFormGroupTouched = (formGroup) => {
   (Object as any).values(formGroup.controls).forEach(control => {
     control.markAsTouched();
     control.updateValueAndValidity();
     if (control.controls) {
       this.markFormGroupTouched(control);
     }
   });
 }

 onChangeQualification(event) {
   this.qualification = event?.name;
 } 

 onSubmitForm(exit, historyForm?: FormGroup) {
   
   //  alert("dasdas");
   // this.typeCastToFormArray(historyForm.get('history_updated').get('education')).controls.forEach(control => {
   //   if(this.qualification !== QualificationType.HIGHT_SCHOOL_GRADUATE && 
   //     this.qualification !== QualificationType.HIGHT_SCHOOL_STUDENT ) {
   //     control.get('grade_choosen').clearValidators();
   //     control.get('grade_choosen').updateValueAndValidity();
   //   }
   // });
   this.markFormGroupTouched(historyForm);
   if(historyForm.invalid) {
     this.showErrorMessage = true;
     return;
   }
   // this.qualificationTypeSubscription = this.studentEducationService.qualificationType$.subscribe(
   //   (qualification) => {
   //     this.educationFormArray.controls[0].patchValue({
   //       type : qualification
   //     });
   //     this.cdr.detectChanges();
   //   });
   
   this.studentService.redirectToDashboard(exit);  // in case of save and exit button click
   const formData = historyForm.getRawValue();
   let education  = formData.history_updated.education;
   if(exit){
    if (this.removeEdu) {
    this.removeIndex.sort(function(a,b){ return a - b; });
    education = removeFromArray(education, this.removeIndex)          
    }
 
    function removeFromArray(arr, toRemove){
      return arr.filter(item => toRemove.indexOf(arr.indexOf(item)) === -1)
    }
 
    // for(let i = 0; i< education.length; i++) {
    //   for(let j = 0; j< education[i].grade.length; j++ ) {
    //     education[i].grade[j].start_year = new Date(education[i].grade[j].start_year).getFullYear();
    //     education[i].grade[j].end_year = new Date(education[i].grade[j].end_year).getFullYear();
    //   }
    //   education[i].start_year = new Date(education[i].start_year).getFullYear();
    //   education[i].end_year = new Date(education[i].end_year).getFullYear();
    // }
  }else{formData.history_updated.education = education;
   this.hideQualificationChangeOption = true;
    formData.history_updated.redirectAction = exit;
    this.onSubmitHistoryForm.emit(formData) }
 
    formData.history_updated.education = education;
    this.hideQualificationChangeOption = true;
    formData.history_updated.redirectAction = exit;
    this.onSubmitHistoryForm.emit(formData);}
  
  
 onFormBack(){
   const formData = this.studentHistoryForm.getRawValue();
   this.onBackForm.emit(formData);
 }

 showEducationForm(response) {  // show education form after delete education from history view component
   const history = response.student_profile.history_updated;
   if(history.education && history.education.length < 1 ) {
       this.hideQualificationChangeOption = false;

       this.staticDataService.getStudentOnBoardingForm().pipe(
         map((apiResponse: any) =>
           this.fb.group({    // initiate empty history form after perform delete operation
               history_updated: this.generateHistoryForm(
                 apiResponse.student_profile.history_updated
               ),
           })
         )
       ).subscribe((form) => {
         this.studentHistoryForm = form;
         this.educationFormArray = this.typeCastToFormArray(this.studentHistoryForm.get('history_updated').get('education'));
         this.onUpdateEducationStatus.emit(response.profile_completion.profile_status);
         this.cdr.detectChanges();
       });
   }
 }

 toggle() {
   this.collapsed = !this.collapsed;
 }

 expand() {
   this.collapsed = false;
 }

 ngOnChanges(): void {
   this.ngOnInit();
 }

 ngOnInit() {
   localStorage.setItem('step', '');
   this.historyFormSubscription = this.initHistoryForm().subscribe((form) => {
     this.studentHistoryForm = form;
     this.educationFormArray = this.typeCastToFormArray(this.studentHistoryForm.get('history_updated').get('education'));
     this.getUserInfo();
     if(this.qualification!= QualificationType.HIGHT_SCHOOL_STUDENT &&
       this.qualification != QualificationType.HIGHT_SCHOOL_GRADUATE && 
       this.qualification != QualificationType.COLLEGE_GRADUATE && 
       this.qualification != QualificationType.COLLEGE_STUDENT) {
         // this.studentHistoryForm.get('history_updated').get('curious_about').setValidators(Validators.required);
         this.studentEducationService.getQualificationType(this.qualification);
     } else {
       this.studentHistoryForm.get('history_updated').get('curious_about').clearValidators();
     }
     this.cdr.detectChanges();
   });
 }

 
 onOpenAddHistoryModal(education: FormGroup, type?) {
   localStorage.setItem('eduType', type)
   this.studentEducationService.getQualificationType(type);
   const initialState = {
     addedEducation: education ? education.getRawValue() : null,
   };
   if (initialState.addedEducation != null) {
     localStorage.setItem('formType', 'edit')
   } else {
     localStorage.setItem('formType', 'new')
   }

   this.modalRef = this.modalService.show(AddHistoryComponent, {initialState});
   this.modalRef.setClass('modal-width');
   this.modalRef.content.onSubmitEducation.subscribe(response => {
     if(initialState.addedEducation) {
       this.replaceEducation(response);
     } else {
       this.onAddEducation(response);
     }
     this.cdr.detectChanges();
   });
 }
 
 onAddEducation(education) {
   this.educationFormArray.push(this.studentEducationService.createEducationFormGroup(education));
}

 replaceEducation(education) {
   const index = this.educationFormArray.controls.findIndex(
     (x) => x.value._id === education._id
   );
   this.educationFormArray.at(index).patchValue(
     this.studentEducationService.createEducationFormGroup(education).value
   );
   const grades = this.studentEducationService.createEducationFormGroup(education).value.grade;
   this.typeCastToFormArray(this.educationFormArray.at(index).get('grade')).clear();
   grades.forEach(grade => {
     this.typeCastToFormArray(this.educationFormArray.at(index).get('grade')).push(new FormControl(grade));
   });
 }

 ngOnDestroy(): void {
   this.historyFormSubscription.unsubscribe();
   // this.qualificationTypeSubscription.unsubscribe();
 }
 getIndex(event)
 {
   this.removeIndex.push(event.removeIndex);
   this.removeEdu =  true;
 }
}
