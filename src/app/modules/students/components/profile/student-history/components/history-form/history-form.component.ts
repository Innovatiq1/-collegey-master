import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter,
  OnChanges,
  TemplateRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { StudentEducationService } from 'src/app/core/services/student-education.service';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StudentService } from 'src/app/core/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { Countries, State, Cities } from 'src/app/core/models/static-data.model';

export enum QualificationType {
  HIGHT_SCHOOL_GRADUATE = 'high school graduate',
  HIGHT_SCHOOL_STUDENT = 'high school student',
  COLLEGE_STUDENT = 'college student',
  COLLEGE_GRADUATE = 'college graduate',
}
export enum EducationType {
  COLLEGE = 'College',
  SCHOOL = 'School'
}
@Component({
  selector: 'app-history-form',
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() error: any;
  @Input() start_year_error: any;
  @Input() end_year_error: any;
  @Input() board_error: any;
  @Input() scoreType_error: any;
  // @Input() transcript_error: any;
  @Input() score_error: any;
  @Input() subject_error: any;
  @Input() school_error: any;
  @Input() locationCity_error: any;
  @Input() locationState_error: any;
  @Input() locationCountry_error: any;
  @Input() degree_error: any;
  @Input() year_error: any;
  @Input() educationForm: FormGroup;
  @Input() showErrorMessage = false;
  @Output() _emitter: EventEmitter<any> = new EventEmitter<any>();

  //location data
  countries: Countries[] = JSON.parse(
    localStorage.getItem(AppConstants.KEY_COUNTRIES_DATA));
  states: State[];
  cities: Cities[];

  changeCounty: boolean = false;
  citySelected: number;
  stateSelected: number;
  countryId: any[] = [];
  stateId: any[] = [];
  stateNames: any[] = [];
  // country_error: boolean = false;
  // state_error: boolean = false;
  // city_error: boolean = false;

  collegedata = [];
  projectDashboardProjects1: any = [];
  projectDashboardProjects: any = [];
  educationType = AppConstants.EDUCATION_TYPE;
  currentClass = AppConstants.STUDENT_CURRENT_CLASS;
  currentClass2 = AppConstants.STUDENT_CURRENT_CLASS2;
  currentClass3 = AppConstants.STUDENT_CURRENT_CLASS3;
  schoolBoard = AppConstants.STUDENT_SCHOOL_BOARD;
  collegeDegree = AppConstants.COLLEGE_DEGREE;
  studySubjects = AppConstants.STUDENT_FAVORITE_SUBJECTS;
  collegeSubjects = AppConstants.college_FAVORITE_SUBJECTS;
  colSub = AppConstants.new_FAVORITE_SUBJECTS;
  startYear = AppConstants.START_YEAR;
  endYear = AppConstants.END_YEAR;
  scoreType = AppConstants.SCORE_TYPE;
  qualificationTypeSubscription: Subscription;
  qualificationType: string = 'School';
  localGrade = [];
  dropdownSettings = {};
  qualificationstatus = { id: 1, name: 'School' };
  tbdStatusCheck: Boolean = false;

  // transcript: any;
  // transcriptFormData: any;
  // transcriptName: any;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onHideQualificationChangeOption = new EventEmitter();
  @Output() onQualificationChange = new EventEmitter();



  userTypeList = [
    { id: 1, name: 'School', value: 'high school student' },
    { id: 2, name: 'College', value: 'college graduate' },
  ];

  eduType: any;
  formType: any;
  gradeList: any[] = [];

  educationFormArray: FormArray;
  modalRef: BsModalRef;
  AddSubjectForm: FormGroup;

  gradeArray: any[] = [];
  qualification = QualificationType;
  AddIntrestForm: FormGroup;
  constructor(
    private cdr: ChangeDetectorRef,
    private educationService: StudentEducationService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private studentService: StudentService,
    private toastrService: ToastrService,
    private http: HttpClient,
    public commonService: CommonService,
    private staticDataService: StaticDataService,
  ) {
    this.qualificationType = "School";
    this.AddIntrestForm = this.fb.group({
      requestedForName: ['', Validators.required],
    });
    this.AddSubjectForm = this.fb.group({
      requestedForName: ['', Validators.required],
    });

  }

  //Select Country
  onSelectCountry(country) {
    this.changeCounty = true;
    // console.log("Select Country", this.geographyFormGroup
    //   .get('geography')
    //   .get('country').value, country.target.value)
    this.getStateList(country.target.value);
    // this.country_error = false;
  }

  //Select state
  onSelectState(state) {
    this.stateSelected = state.target.value;
    // this.getCityList(state.target.value);
    // this.state_error = false;
  }

  //Get list of states
  getStateList(id) {
    this.staticDataService.getStates(id).subscribe(
      (response) => {
        this.states = response;
        if (this.changeCounty) {
          if (this.states.length > 0) {
            this.stateSelected = this.states[0]?.id;

            this.educationForm.patchValue({
              locationState: this.stateSelected
            })
            // this.state_error = false;
            // this.getCityList(this.states[0]?.id);
            this.cdr.detectChanges();
          } else {
            // this.cities = [];
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

  //Get list of cities
  // getCityList(id) {
  //   this.staticDataService.getCities(id).subscribe(
  //     (response) => {
  //       if (response.length > 0) {
  //         this.cities = response;
  //         // this.city_error = false;
  //         if (this.changeCounty) {
  //           this.citySelected = this.cities[0]?.id;
  //         }
  //       } else {
  //         this.cities = [];
  //         this.citySelected = 11111111111;
  //       }
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       // this.toastrService.error(error.message || 'Oops something went wrong');
  //     }
  //   );
  // }

  onChangeQualification(event) {
    this.qualificationType = event?.target.value;
    if (event?.target.value == "School") {
      this.educationService.getQualificationType("high school student");
    } else if (event?.target.value == "College") {
      this.educationService.getQualificationType("college student");

    }
    this.onQualificationChange.emit(event);
    this.cdr.detectChanges();
    //this.educationForm.reset();
    this.clearForm(this.qualificationType);
  }

  clearForm(type) {
    (<FormArray>this.educationForm.get('grade')).clear();
    (<FormArray>this.educationForm.get('collegegrade')).clear();
    this.educationForm.patchValue({
      degree: null,
      end_year: null,
      field_of_study: null,
      locationCountry: null,
      locationState: null,
      locationCity: null,
      name: null,
      score: null,
      start_year: null,
      scoreType: null,
      year_choosen: null,
      grade_choosen: null,
    })

    this.cdr.detectChanges();
  }
  number1(event) {
    this.error = ''

  }
  startYear1(event) {
    if (event != '') {
      this.start_year_error = ''
    }
  }
  EndYear1(event) {
    if (event != '') {
      this.end_year_error = ''
    }
  }
  board(event) {
    this.board_error = ''
  }
  scoreTypeSelection(event) {
    this.scoreType_error = ''
  }
  // transcriptData(event){
  //   this.transcript_error=''
  // }
  school(event) {
    this.school_error = ''
  }
  locationCity(event) {
    this.locationCity_error = ''
  }
  locationState(event) {
    this.locationState_error = ''
  }
  locationCountry(event) {
    this.locationCountry_error = ''
  }
  degree(event) {
    this.degree_error = ''
  }
  year(event) {
    this.year_error = ''
  }

  addTagFn(name) {
    return { name };
  }

  onRemoveScore(index) {
    this.typeCastToFormArray(this.educationForm.get('score')).removeAt(index);
  }

  collegeFieldStudy(fields) {
    // console.log("Fields",fields,this.educationForm.get('field_of_study'))
  }
  score(event) {
    this.score_error = ''
  }
  onClearStudentGrade() {
    // debugger

    if (this.qualificationType === 'School') {
      this.typeCastToFormArray(
        this.educationForm.get('grade')
      ).controls.forEach((control) => {
        control.get('board')?.setValidators(Validators.required);
        control.get('scoreType')?.setValidators(Validators.required);
        control.get('field_of_study')?.setValidators(Validators.required);
        control.get('start_year')?.setValidators(Validators.required);
        control.get('end_year')?.setValidators(Validators.required);
        control.get('score')?.setValidators(Validators.required);
        // control.get('transcript').setValidators(Validators.required);
        control.get('locationCity')?.setValidators(Validators.required);
        control.get('locationState')?.setValidators(Validators.required);
        control.get('locationCountry')?.setValidators(Validators.required);
        control.get('board').updateValueAndValidity();
        control.get('scoreType').updateValueAndValidity();
        control.get('field_of_study').updateValueAndValidity();
        control.get('start_year').updateValueAndValidity();
        control.get('end_year').updateValueAndValidity();
        control.get('score').updateValueAndValidity();
        // control.get('transcript').updateValueAndValidity();
        control.get('locationCity').updateValueAndValidity();
        control.get('locationState').updateValueAndValidity();
        control.get('locationCountry').updateValueAndValidity();
      });
      this.educationForm.get('grade').markAllAsTouched();
    }

    this.cdr.detectChanges();
  }

  tbdStatus() {
    if (this.tbdStatusCheck) {
      this.tbdStatusCheck = false;
    } else {
      this.tbdStatusCheck = true;
    }
  }

  onClearStudentcollege() {
    // debugger

    if (this.qualificationType === 'School') {
      this.typeCastToFormArray(
        this.educationForm.get('grade')
      ).controls.forEach((control) => {
        control.get('board').setValidators(Validators.required);
        control.get('scoreType').setValidators(Validators.required);
        control.get('field_of_study').setValidators(Validators.required);
        control.get('start_year').setValidators(Validators.required);
        control.get('end_year').setValidators(Validators.required);
        control.get('score').setValidators(Validators.required);
        // control.get('transcript').setValidators(Validators.required);
        control.get('locationCity').setValidators(Validators.required);
        control.get('locationState').setValidators(Validators.required);
        control.get('locationCountry').setValidators(Validators.required);
        control.get('board').updateValueAndValidity();
        control.get('scoreType').updateValueAndValidity();
        control.get('field_of_study').updateValueAndValidity();
        control.get('start_year').updateValueAndValidity();
        control.get('end_year').updateValueAndValidity();
        control.get('score').updateValueAndValidity();
        // control.get('transcript').updateValueAndValidity();
        control.get('locationCity').updateValueAndValidity();
        control.get('locationState').updateValueAndValidity();
        control.get('locationCountry').updateValueAndValidity();
      });
      this.educationForm.get('grade').markAllAsTouched();
    }

    this.cdr.detectChanges();
  }

  // Remove the Select grade level
  board1(event) {
    this.subject_error = ''
  }

  onRemoveStudentGrade(event) {
    const gradeArray = this.educationForm.get('grade').value;
    let findIndex = gradeArray.findIndex(gradeArray => gradeArray.name === parseInt(event.value));
    this.typeCastToFormArray(this.educationForm.get('grade')).removeAt(findIndex);
  }

  onRemoveStudentcollege(event) {
    const gradeArray = this.educationForm.get('collegegrade').value;
    let findIndex = gradeArray.findIndex(gradeArray => gradeArray.name === event.value);
    this.typeCastToFormArray(this.educationForm.get('collegegrade')).removeAt(findIndex);
  }

  onAddStudentGrade(grades) {
    this.educationForm.get('grade_choosen').value.forEach((grade) => {
      if (grade == grades) {
        const index = this.typeCastToFormArray(
          this.educationForm.get('grade')
        ).controls.findIndex((x) => x.value.name === grade);
        if (index < 0) {
          grade = {
            name: parseInt(grade)
          }
          this.typeCastToFormArray(this.educationForm.get('grade')).push(
            this.educationService.addStudentGradeFormGroup(grade)
          );
        }
      }
    });

    if (this.qualificationType === 'School') {
      this.typeCastToFormArray(
        this.educationForm.get('grade')
      ).controls.forEach((control) => {
        control.get('board')?.setValidators(Validators.required);
        control.get('scoreType')?.setValidators(Validators.required);
        control.get('field_of_study')?.setValidators(Validators.required);
        control.get('start_year')?.setValidators(Validators.required);
        control.get('end_year')?.setValidators(Validators.required);
        control.get('score')?.setValidators(Validators.required);
        // control.get('transcript').setValidators(Validators.required);
        control.get('locationCity')?.setValidators(Validators.required);
        control.get('locationState')?.setValidators(Validators.required);
        control.get('locationCountry')?.setValidators(Validators.required);
        control.get('board')?.updateValueAndValidity();
        control.get('scoreType')?.updateValueAndValidity();
        control.get('field_of_study')?.updateValueAndValidity();
        control.get('start_year')?.updateValueAndValidity();
        control.get('end_year')?.updateValueAndValidity();
        control.get('score')?.updateValueAndValidity();
        // control.get('transcript').updateValueAndValidity();
        control.get('locationCity')?.updateValueAndValidity();
        control.get('locationState')?.updateValueAndValidity();
        control.get('locationCountry')?.updateValueAndValidity();
      });
      this.educationForm.get('grade').markAllAsTouched();
    }
    this.cdr.detectChanges();
  }

  studentFileUpload(event, index: any) {
    var file = event.target.files;

    if (file[0].type == 'image/jpeg' || file[0].type == 'image/png' || file[0].type == 'image/jpg') {
      if (event.target.files[0].size / 1024 / 1024 > 10) {
        this.toastrService.error('The file is too large. Allowed maximum size is 10 MB.');
        return;
      }
      this.uploadFileApi(event.target.files[0]).then((data) => {
        this.cdr.detectChanges();
        ((this.educationForm.get('grade') as FormArray).at(index) as FormGroup).get('school_fileName').patchValue(data);
      }).catch((err) => {
        this.toastrService.error('Image upload faild');
      })
    }
    else {
      this.toastrService.error('Allow only .png, .jpeg, .jpg this file');
      return;
    }
  }

  collegeFileUpload(event, index: any) {
    var file = event.target.files;

    if (file[0].type == 'image/jpeg' || file[0].type == 'image/png' || file[0].type == 'image/jpg') {
      if (event.target.files[0].size / 1024 / 1024 > 10) {
        this.toastrService.error('The file is too large. Allowed maximum size is 10 MB.');
        return;
      }
      this.uploadFileApi(event.target.files[0]).then((data) => {
        this.cdr.detectChanges();
        ((this.educationForm.get('collegegrade') as FormArray).at(index) as FormGroup).get('college_fileName').patchValue(data);
      }).catch((err) => {
        this.toastrService.error('Image upload faild');
      })
    }
    else {
      this.toastrService.error('Allow only .png, .jpeg, .jpg this file');
      return;
    }
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

  onAddStudentcollege(grades) {
    // debugger

    this.collegedata.push(grades);

    this.educationForm.get('year_choosen').value.forEach((collegegrade) => {
      const index = this.typeCastToFormArray(
        this.educationForm.get('collegegrade')
      ).controls.findIndex((x) => x.value.name === collegegrade);

      if (index < 0) {
        let yearOfstd;
        if (collegegrade == '1st Year') { yearOfstd = 1; }
        else if (collegegrade == '2nd Year') { yearOfstd = 2; }
        else if (collegegrade == '3rd Year') { yearOfstd = 3; }
        else if (collegegrade == '4th Year') { yearOfstd = 4; }
        else if (collegegrade == '5th Year') { yearOfstd = 5; }

        collegegrade = {
          name: collegegrade,
        },
          collegegrade['stdyear'] = yearOfstd;
        this.typeCastToFormArray(this.educationForm.get('collegegrade')).push(
          this.educationService.addStudentCollegeFormGroup(collegegrade)
        );
      }
    });
    if (this.qualificationType === 'School') {
      this.typeCastToFormArray(
        this.educationForm.get('grade')
      ).controls.forEach((control) => {
        control.get('board').setValidators(Validators.required);
        control.get('scoreType').setValidators(Validators.required);
        control.get('field_of_study').setValidators(Validators.required);
        control.get('start_year').setValidators(Validators.required);
        control.get('end_year').setValidators(Validators.required);
        control.get('score').setValidators(Validators.required);
        // control.get('transcript').setValidators(Validators.required);
        control.get('locationCity').setValidators(Validators.required);
        control.get('locationState').setValidators(Validators.required);
        control.get('locationCountry').setValidators(Validators.required);
        control.get('board').updateValueAndValidity();
        control.get('scoreType').updateValueAndValidity();
        control.get('field_of_study').updateValueAndValidity();
        control.get('start_year').updateValueAndValidity();
        control.get('end_year').updateValueAndValidity();
        control.get('score').updateValueAndValidity();
        // control.get('transcript').updateValueAndValidity();
        control.get('locationCity').updateValueAndValidity();
        control.get('locationState').updateValueAndValidity();
        control.get('locationCountry').updateValueAndValidity();
      });
      this.educationForm.get('grade').markAllAsTouched();
    }
    this.cdr.detectChanges();

  }

  typeCastToFormArray(formGroup: AbstractControl) {
    return formGroup as FormArray;
  }

  onOpenCalendarYear(container) {
    container.yearSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('year');
  }

  ngOnInit(): void {

    this.eduType = localStorage.getItem('eduType');
    this.formType = localStorage.getItem('formType');

    this.studentService.getStudentProfile().subscribe((profileData) => {
      let education = profileData.student_profile.history_updated.education;
      for (let i = 0; i < education.length; i++) {
        this.countryId.push(education[i]?.locationCountry);
        // this.stateId.push(education[i]?.locationState);
        if (education[i].grade_choosen.length > 0) {
          for (let j = 0; j < education[i].grade_choosen.length; j++) {
            if (!this.gradeArray.includes(education[i].grade_choosen[j])) {
              this.gradeArray.push(education[i].grade_choosen[j])
            }
          }
        }
      }

      // for (let index = 0; index < this.countryId.length; index++) {
      //   this.getStateList(this.countryId[index])
      // }

      this.gradeArray.sort(function (a, b) { return a - b; });

      this.currentClass2 = removeFromArray(this.currentClass2, this.gradeArray)

      function removeFromArray(arr, toRemove) {
        return arr.filter(item => toRemove.indexOf(item) === -1)
      }

      // this._emitter.emit("Hello Emitted");
    });
    if (this.educationForm.value.locationCountry) {
      this.getStateList(this.educationForm.value.locationCountry);
    }


    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      limitSelection: 20,
      defaultOpen: true
    };

    this.qualificationTypeSubscription = this.educationService.qualificationType$.subscribe(
      (qualification) => {
        if (
          qualification === QualificationType.HIGHT_SCHOOL_GRADUATE ||
          qualification === QualificationType.HIGHT_SCHOOL_STUDENT
        ) {
          this.qualificationType = 'School';
        } else if (
          qualification === QualificationType.COLLEGE_GRADUATE ||
          qualification === QualificationType.COLLEGE_STUDENT
        ) {
          this.qualificationType = 'College';
        } else {
          this.qualificationType = qualification;
          if (this.educationForm) {
            this.educationForm.patchValue({
              type: this.qualificationType,
            });
          }
          this.onHideQualificationChangeOption.emit(false);

        }

        this.cdr.detectChanges();

      }

    );

    let data1 = {
      subject: 'sssdgggfffgggggggbbbb'
    }
    this.studentService.addListSubject(data1).subscribe((response: any) => {

      this.projectDashboardProjects1 = response.projectDashboardProjects.map((person => person.subject));
    });


  }
  AddSubject() {
    let obj = this.AddSubjectForm.value;
    let data = {
      subject: obj.requestedForName
    }
    // let gradeId = localStorage.getItem('gradeId');
    // let gradeType = localStorage.getItem('gradeType');

    // if (gradeType == 'school') {
    //   this.gradeList = this.educationForm.value.grade;
    // } else {
    //   this.gradeList = this.educationForm.value.collegegrade;
    // }


    // for (let index = 0; index < this.gradeList.length; index++) {
    //   if (this.gradeList[index]._id == gradeId) {        
    //       if (!this.gradeList[index].field_of_study.includes(data.subject)) {
    //         this.gradeList[index].field_of_study.push(obj.requestedForName);
    //       }       
    //   }      
    // }

    // this.saveSubject(obj.requestedForName);


    // this.educationForm = this.educationService.createEducationFormGroup(
    //   this.educationForm.value
    // );



    this.studentService.addSubjectsArea(data).subscribe((response: any) => {
      if (response) {
        this.modalRef.hide();
        let data1 = {
          subject: 'sssdgggfffgggggggbbbb'
        }
        this.studentService.addListSubject(data1).subscribe((response: any) => {
          let subArray = response.projectDashboardProjects.map((person => person.subject));
          this.projectDashboardProjects1 = subArray.reverse();



        });
      }

    });


    this.cdr.detectChanges();
  }

  addIntrest(template: TemplateRef<any>, gradeId) {
    if (gradeId._parent._parent.value.type == 'college student') {
      localStorage.setItem('gradeType', 'college');
    } else if (gradeId._parent._parent.value.type == 'high school student') {
      localStorage.setItem('gradeType', 'school');
    }
    localStorage.setItem('gradeId', gradeId.value._id);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );

  }
  saveSubject(event) {
    this.subject_error = '';
  }
  saveIntrest(event) {
    console.log("hiiiiiiiii");
  }
  AddIntrest() {
    let obj = this.AddIntrestForm.value;
    let data = {
      ininterest: obj.requestedForName
    }
    this.studentService.addIntrestsArea(data).subscribe((response: any) => {

      if (response) {
        this.modalRef.hide();
        this.studentService.addListIntrest(data).subscribe((response: any) => {
          let data = {
            ininterest: 'sssdgggfffgggggggbbbb'
          }
          this.studentService.addListIntrest(data).subscribe((response: any) => {
            // this.projectDashboardProjects=response.projectDashboardProjects.interest;
            this.projectDashboardProjects = response.projectDashboardProjects.map((person => person.interest));
          });
        })
      }
    });
  }
  ngOnChanges() {
    if (this.educationForm) {
      this.educationForm.get('grade').markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    // this.qualificationTypeSubscription.unsubscribe();
  }
  // uploadFileApi(file) {

  //   return new Promise((resolve, reject) => {
  //     let formData = new FormData();
  //     formData.append('files', file);
  //     formData.append('type', 'single');
  //     this.http.post(environment.apiEndpointNew+'public/uploadFile', formData)
  //       .subscribe((res: any) => {

  //         console.log("educationForm===>", this.educationForm)
  //         console.log("upload result ===>", res)
  //         resolve(res.url);
  //       }, (err => {
  //         reject(err);
  //       }))
  //   })
  // }

  // uploadTranscript(event){
  //  { 
  //     this.uploadFileApi(event.target.files[0]).then((data) => {
  //       this.transcript = data;
  //       this.transcriptName = this.transcript.split('/')[5];
  //       this.cdr.detectChanges();
  //     }).catch((err) => {
  //       this.toastrService.error('transcript upload faild');
  //     })
  //   }
  // }




}
