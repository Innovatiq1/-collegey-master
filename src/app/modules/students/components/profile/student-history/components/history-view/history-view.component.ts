import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, OnChanges, OnDestroy,TemplateRef } from '@angular/core';
import { Education } from 'src/app/core/models/student-profile.model';
import { FormGroup, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddHistoryComponent } from '../add-history/add-history.component';
import { StudentEducationService } from 'src/app/core/services/student-education.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { QualificationType } from '../history-form/history-form.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { Countries, State, Cities } from 'src/app/core/models/static-data.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';

export enum EducationType {
  COLLEGE = 'College',
  SCHOOL = 'School'
}

@Component({
  selector: 'app-history-view',
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() historyForm: FormGroup;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onHideQualificationChangeOption = new EventEmitter();
  @Output() _emitter: EventEmitter<any> = new EventEmitter<any>();
  // educationForm: FormGroup;
  educationType = EducationType;
  educationFormArray: FormArray;

  //location data
  countries: Countries[] = JSON.parse(localStorage.getItem(AppConstants.KEY_COUNTRIES_DATA));
  states: State[];
  cities: Cities[];
  collegeYearArray: any[] = [];
  schoolYearArray: any[] = [];
  sortedEducationSchoolFormArray: any = [];
  sortedEducationCollegyFormArray: any = [];
  allStates: any[] = []

  sortedSchoolCountryName: any = [];
  sortedCollegeCountryName: any = [];
  sortedSchoolStateName: any = [];
  sortedCollegeStateName: any = [];

  educationSchoolFormArray: any = [];
  educationCollegyFormArray: any = [];
  userid: any;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onDeleteEducation = new EventEmitter();

  modalRef: BsModalRef;
  modalDelete: BsModalRef;

  qualificationTypeSubscription: Subscription;
  qualificationType: string;
  qualification = QualificationType;

  // Education Remove Action
  deleteEducationIndex:any;
  deleteEducationValue:any;
  deleteEducationType:any;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private studentEducationService: StudentEducationService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private staticDataService: StaticDataService,
  )
  { 
    const loggedInInfo = this.authService.getUserInfo();
    this.userid        = loggedInInfo?.user._id;
    this.getStateList();
  }

  typeCastToFormArray(formGroup: AbstractControl) {
    return formGroup as FormArray;
  }

    //Get list of states
    getStateList() {
      this.staticDataService.getAllStates().subscribe(
        (response) => {
          this.allStates = response;         
          this.cdr.detectChanges();
        },
        (error) => {
          // this.toastrService.error(error.message || 'Oops something went wrong');
        }
      );
    }
    getStateName(id)
    {
      var result = this.allStates?.filter(item =>item.id==id)
      return result[0]?.name ? result[0].name: '';
    }
    getCountryName(id)
    {
      var result = this.countries?.filter(item =>item.id==id)
      return result[0]?.name ? result[0].name: '';
    }

  onAddEducation(education) {
    this.sortedEducationSchoolFormArray  = [];
    this.sortedEducationCollegyFormArray = [];

    this.educationFormArray.push(this.studentEducationService.createEducationFormGroup(education));
  }

  removeEducationConfirmation(template: TemplateRef<any>,educationIndex,educationValue,removeType) {
    this.modalDelete = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.deleteEducationIndex = educationIndex;
    this.deleteEducationValue = educationValue;
    this.deleteEducationType  = removeType;
  }

  onRemoveEducation(index,id,typedelete) {
    const educationArrayIndex = this.educationFormArray?.value;
    let findIndex = educationArrayIndex.findIndex(educationArrayIndex => educationArrayIndex?._id === id);
    let emitObj = {
      removeIndex: findIndex,
      removeEdu: true
    };   
    
    let obj = {
        index: findIndex,
        id:id,
        userId:this.userid, 
      }
      this.studentEducationService.deleteEducation(obj).subscribe(
        (response) => {
          this.toastrService.success('Education Details removed');
          this._emitter.emit(emitObj);
          if(typedelete == 'schoolremove')
          {
            this.sortedEducationSchoolFormArray.splice(index, 1);
          }
          else
          {
            this.sortedEducationCollegyFormArray.splice(index, 1);
          }
          this.cdr.detectChanges();
          this.modalDelete.hide();
          localStorage.setItem('step', 'education');
          window.location.reload();
        },
        (err) => {
          this.toastrService.error('Education not deleted');
        },
    );
    
  }

  onRemoveGrade(index, educationIndex,educationId, grade){
    const formData: any = {};
    formData.education_id = educationId;
    formData.name = grade.name;

    this.studentEducationService.deleteGrade(grade._id,formData ).subscribe((response: any) => {
      if(response) {
        this.toastrService.success('Education Details removed');
        this.typeCastToFormArray(this.educationFormArray.controls[educationIndex].get('grade')).removeAt(index);
        this.educationFormArray.controls[educationIndex].get('grade_choosen').value.splice(index,1);
        this.onDeleteEducation.emit(response);
        this.cdr.detectChanges();
      }
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
        this.reCallEducationData();
      }
      this.cdr.detectChanges();
    });
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

  ngOnChanges(): void {
    //this.ngOnInit();
  }

  reCallEducationData()
  {
    
    this.educationSchoolFormArray = [];
    this.educationCollegyFormArray = [];
    this.collegeYearArray = [];
    this.sortedEducationCollegyFormArray = [];
    this.schoolYearArray = [];
    this.sortedEducationSchoolFormArray = [];
    
    for(let i = 0; i < this.educationFormArray?.controls.length; i++) {
      let typeEducaion = this.educationFormArray?.controls[i]?.value?.type;
      if(typeEducaion == 'School' || typeEducaion == 'high school student')
      {
        this.educationSchoolFormArray.push(this.educationFormArray?.controls[i]); 
      }  
      else
      {
        this.educationCollegyFormArray.push(this.educationFormArray?.controls[i]);
      }

    }

    //SORT COLLEGE BY YEAR

    for (let index = 0; index < this.educationCollegyFormArray.length; index++) {
      let end_year = this.educationCollegyFormArray[index].value.end_year;
      if (!this.collegeYearArray.includes(end_year)) {
        this.collegeYearArray.push(end_year);
      }
      
    }

    this.collegeYearArray.sort(function(a, b) {
      return b - a;
    });

    for (let index = 0; index < this.collegeYearArray.length; index++) {
      for (let j = 0; j < this.educationCollegyFormArray.length; j++) {
        if (parseInt(this.collegeYearArray[index]) == parseInt(this.educationCollegyFormArray[j].value.end_year)) {
          this.sortedEducationCollegyFormArray.push(this.educationCollegyFormArray[j])
        }            
      }          
    }

        //SORT SCHOOL BY YEAR

        for (let index = 0; index < this.educationSchoolFormArray.length; index++) {
          let end_year = this.educationSchoolFormArray[index].value.grade[0].end_year;
          if (!this.schoolYearArray.includes(end_year)) {
            this.schoolYearArray.push(end_year);
          }
        }
    
        this.schoolYearArray.sort(function(a, b) {
          return b - a;
        });
    
        for (let index = 0; index < this.schoolYearArray.length; index++) {
          for (let j = 0; j < this.educationSchoolFormArray.length; j++) {
            if (parseInt(this.schoolYearArray[index]) == parseInt(this.educationSchoolFormArray[j].value.grade[0].end_year)) {
              this.sortedEducationSchoolFormArray.push(this.educationSchoolFormArray[j])
            }            
          }          
        }
    
    this.qualificationTypeSubscription = this.studentEducationService.qualificationType$.subscribe(qualificationType =>{
      if(qualificationType === QualificationType.COLLEGE_GRADUATE || qualificationType === QualificationType.COLLEGE_STUDENT) {
        this.qualificationType = EducationType.COLLEGE;
      } else if(qualificationType === QualificationType.HIGHT_SCHOOL_GRADUATE || QualificationType.HIGHT_SCHOOL_STUDENT) {
        this.qualificationType = EducationType.SCHOOL;
      }
    });
    this.onHideQualificationChangeOption.emit(true);
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getStateList();
    this.educationFormArray = this.typeCastToFormArray(this.historyForm.get('history_updated').get('education'));
    for(let i = 0; i < this.educationFormArray?.controls.length; i++) {
      let typeEducaion = this.educationFormArray?.controls[i]?.value?.type;
      if(typeEducaion == 'School' || typeEducaion == 'high school student')
      {
        this.educationSchoolFormArray.push(this.educationFormArray?.controls[i]); 
      }  
      else
      {
        this.educationCollegyFormArray.push(this.educationFormArray?.controls[i]);
      }

    }

    //SORT COLLEGE BY YEAR

    for (let index = 0; index < this.educationCollegyFormArray.length; index++) {
      let end_year = this.educationCollegyFormArray[index].value.end_year;
      if (!this.collegeYearArray.includes(end_year)) {
        this.collegeYearArray.push(end_year);
      }
      
    }

    this.collegeYearArray.sort(function(a, b) {
      return b - a;
    });

    for (let index = 0; index < this.collegeYearArray.length; index++) {
      for (let j = 0; j < this.educationCollegyFormArray.length; j++) {
        if (parseInt(this.collegeYearArray[index]) == parseInt(this.educationCollegyFormArray[j].value.end_year)) {
          this.sortedEducationCollegyFormArray.push(this.educationCollegyFormArray[j])
        }            
      }          
    }

    // for (let index = 0; index < this.sortedEducationCollegyFormArray.length; index++) {
    //   for (let j = 0; j < this.countries.length; j++) {      
    //     if (this.sortedEducationCollegyFormArray[index].value.locationCountry == this.countries[j].id) {
    //       this.getStateList1(this.countries[j].id, this.sortedEducationCollegyFormArray[index].value.locationState, 'college')
    //       this.sortedCollegeCountryName.push(this.countries[j].name);
    //     }
    //   }
    // }



        //SORT SCHOOL BY YEAR

        for (let index = 0; index < this.educationSchoolFormArray.length; index++) {
          let end_year = this.educationSchoolFormArray[index]?.value?.grade[0]?.end_year;
          if (!this.schoolYearArray.includes(end_year)) {
            this.schoolYearArray.push(end_year);
          }
        }
    
        this.schoolYearArray.sort(function(a, b) {
          return b - a;
        });
    
        for (let index = 0; index < this.schoolYearArray.length; index++) {
          for (let j = 0; j < this.educationSchoolFormArray.length; j++) {
            if (parseInt(this.schoolYearArray[index]) == parseInt(this.educationSchoolFormArray[j]?.value?.grade[0]?.end_year)) {
              this.sortedEducationSchoolFormArray.push(this.educationSchoolFormArray[j])
            }            
          }          
        }

        
    // for (let index = 0; index < this.sortedEducationSchoolFormArray.length; index++) {
    //   for (let j = 0; j < this.countries.length; j++) {      
    //     if (this.sortedEducationSchoolFormArray[index].value.locationCountry == this.countries[j].id) {
    //       this.sortedSchoolCountryName.push(this.countries[j].name);

    //     }
    //   }
    // }
    
    this.qualificationTypeSubscription = this.studentEducationService.qualificationType$.subscribe(qualificationType =>{
      if(qualificationType === QualificationType.COLLEGE_GRADUATE || qualificationType === QualificationType.COLLEGE_STUDENT) {
        this.qualificationType = EducationType.COLLEGE;
      } else if(qualificationType === QualificationType.HIGHT_SCHOOL_GRADUATE || QualificationType.HIGHT_SCHOOL_STUDENT) {
        this.qualificationType = EducationType.SCHOOL;
      }
    });
    this.onHideQualificationChangeOption.emit(true);
    this.cdr.detectChanges();
  }

    //Get list of states
    getStateList1(id, stateId, eduType) {
      this.staticDataService.getStates(id).subscribe(
        (response) => {
          // this.states = response;
          for (let index = 0; index < response.length; index++) {
            if (response[index].id == stateId) {
              if (eduType == 'college') {
                this.sortedCollegeStateName.push(response[index].name)
              } else {
                this.sortedSchoolStateName.push(response[index].name)
              }
              
            }
          }
          this.cdr.detectChanges();
        },
        (error) => {
          // this.toastrService.error(error.message || 'Oops something went wrong');
        }
      );
    }

  ngOnDestroy(): void {
    if(this.modalRef) {
      this.modalRef.hide();
    }
    this.qualificationTypeSubscription?.unsubscribe();
  }

}
