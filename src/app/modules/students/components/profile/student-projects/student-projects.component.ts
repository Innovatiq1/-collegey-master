import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  FormArray,
  FormControl,
} from '@angular/forms';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { Observable, of, Subscription } from 'rxjs';
import {
  Projects,
  BigPictureProject,
  DescribeProject,
  WritingSample,
  Recommendation,
  Award,
} from 'src/app/core/models/student-profile.model';
import { map } from 'rxjs/operators';
import { StudentService } from 'src/app/core/services/student.service';
import { CommonService } from 'src/app/core/services/common.service';

import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/shared/Utils';
import { StudentProfileStatus } from 'src/app/core/enums/student-profile-status.enum';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { AboutWorkComponent } from './components/about-work/about-work.component';
import { AddWritingSampleComponent } from './components/add-writing-sample/add-writing-sample.component';
import { AddAwardsComponent } from './components/add-awards/add-awards.component';
import { Duration } from 'ngx-bootstrap/chronos/duration/constructor';

enum ProjectQuestions {
  DESCRIBE_PROJECT,
  WRITING_SAMPLE,
  RECOMMENDATION,
  AWARDS
}
@Component({
  selector: 'app-student-projects',
  templateUrl: './student-projects.component.html',
  styleUrls: ['./student-projects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProjectsComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;

  studentSchoolBoards = AppConstants.STUDENT_SCHOOL_BOARD;
  studentClassOptions = AppConstants.STUDENT_CLASS_OPTIONS;
  studentFavoriteSubjects = AppConstants.STUDENT_FAVORITE_SUBJECTS;

  describeProjectFormArray: FormArray;
  recommendationFormArray: FormArray;
  writingSampleFormArray: FormArray;
  awardsFormArray: FormArray;

  studentProjectForm: FormGroup;
  studiedFormSubscription: Subscription;
  @Input() studentProfileData;
  @Input() section;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSubmitProjectForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();

  projectFormAbstractControl: AbstractControl;

  doneBigProject = AppConstants.BIG_PICTURE_PROJECT;
  wishToShare = AppConstants.BIG_PICTURE_PROJECT;
  projectQuestion = ProjectQuestions;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private staticDataService: StaticDataService,
    private cdr: ChangeDetectorRef,
    private studentService: StudentService,
    private toastrService: ToastrService,
    public commonService: CommonService,
  ) { }

  initStudiedForm() {
    let studentJsonData: Observable<FormGroup>;
    if (this.studentProfileData.student_profile.projects && Object.keys(this.studentProfileData).length > 0) {
      studentJsonData = of(this.studentProfileData);
    } else {
      studentJsonData = this.staticDataService.getStudentOnBoardingForm();
    }
    return studentJsonData.pipe(
      map((apiResponse: any) =>
        this.fb.group({
          projects: this.generateProjectForm(
            apiResponse.student_profile.projects
          ),
        })
      )
    );
  }

  generateProjectForm(project: Projects): FormGroup {
    return this.fb.group({
      any_bpp: this.createBPPGroup(project.any_bpp),
      describe_any_project: this.createDescribeAnyProjectGroup(
        project.describe_any_project
      ),
      writing_sample: this.createWritingSampleGroup(project.writing_sample),
      someone_said_something_or_recommendation: this.createRecommendationGroup(
        project.someone_said_something_or_recommendation
      ),
      award: this.createAwardGroup(project.award),
      is_completed: [false],
    });
  }

  createAwardGroup(award): FormArray {
    return award ? this.fb.array(
      award.map((item) => this.addAwardGroup(item))
    ) : null;
  }

  addAwardGroup(award?: Award): FormGroup {
    
    return this.fb.group({
      title: [award ? award.title : null],
      description: [award ? award.description : null],
      file: [award ? award.file : null],
      duration: award ? this.createDurationFormControl(award) : null,
      role: [award ? award.role : null],
      issuing_organisation: [award ? award.issuing_organisation : null],
      _id: [award ? award._id : null],
      type: [award ? award.type : null]
    });
  }

  createDurationFormControl(award: Award): FormControl {
    return new FormControl(award.duration ? award.duration.map(duration => Utils.transformNumericDate(new Date(duration))) : null);
  }

  createWritingSampleGroup(writingSample) {
    return writingSample ? this.fb.array(writingSample.map((item) => this.addWritingSampleGroup(item))) : null;
  }

  createRecommendationGroup(recommendation): FormArray {
    return recommendation ? this.fb.array(recommendation.map((item) => this.addRecommendationGroup(item))) : null;
  }

  addRecommendationGroup(recommendation?: Recommendation): FormGroup {
    return this.fb.group({
      title: [recommendation ? recommendation.title : null],
      description: [recommendation ? recommendation.description : null],
      file: [recommendation ? recommendation.file : null],
      _id: [recommendation ? recommendation._id : null],
    });
  }

  _getImageName(file) {
    return Utils.getDocumentName(file);
  }

  sliceImageName(file) {
    return file.slice(27);
  }

  addWritingSampleGroup(writingSample?: WritingSample): FormGroup {
    return this.fb.group({
      title: [writingSample ? writingSample.title : null],
      description: [writingSample ? writingSample.description : null],
      answer: [writingSample ? writingSample.answer : null],
      file: [writingSample ? writingSample.file : null],
      _id: [writingSample ? writingSample._id : null]
    });
  }

  createBPPGroup(bpp: BigPictureProject): FormGroup {
    return this.fb.group({
      answer: [bpp ? bpp.answer : null],
      title: [bpp ? bpp.title : null],
      description: [bpp ? bpp.description : null],
    });
  }

  createDescribeAnyProjectGroup(project): FormArray {
    return project ? this.fb.array(project.map((item) => this.addDescribeProjectGroup(item))) : null;
  }

  onRemoveQuestion(id, questionsFormArray: FormArray, questionType, index) {
    if (ProjectQuestions.DESCRIBE_PROJECT === questionType) { // delete described project Question
      this.studentService.deleteDescribedProject(id).subscribe((response: any) => {
        if (response.message) {
          this.toastrService.success(response.message);
        }
      });
    } else if (ProjectQuestions.WRITING_SAMPLE === questionType) {   // delete writing sample Question
      this.studentService.deleteWritingSample(id).subscribe((response: any) => {
        if (response.message) {
          this.toastrService.success(response.message);
        }
      });
    }

    else if (ProjectQuestions.RECOMMENDATION === questionType) {   // delete writing sample Question
      this.studentService.deleteStudentWork(id).subscribe((response: any) => {
        if (response.message) {
          this.toastrService.success(response.message);
        }
      });
    }

    else if (ProjectQuestions.AWARDS === questionType) {   // delete awards Question
      this.studentService.deleteAwards(id).subscribe((response: any) => {
        if (response.message) {
          this.toastrService.success(response.message);
        }
      });
    }

    questionsFormArray.removeAt(index);
  }

  addDescribeProjectGroup(project?: DescribeProject): FormGroup {
    return this.fb.group({
      title: [project ? project.title : null],
      description: [project ? project.description : null],
      project_url: [project ? project.project_url : null],
      _id: [project ? project._id : null],
    });
  }

  openAddProjectsModal(project: FormGroup) {
    const initialState = {
      addedProjectData: project ? project.getRawValue() : null,
    };
    this.modalRef = this.modalService.show(AddProjectComponent, {
      initialState, ignoreBackdropClick: true
    });
    this.modalRef.setClass('modal-width');
    this.modalRef.content.onSubmitProjectEvent.subscribe((response) => {
      if (initialState.addedProjectData) {
        this.replaceProject(response);
      } else {
        this.describeProjectFormArray.push(
          this.addDescribeProjectGroup(response)
        );
      }
      this.cdr.detectChanges();
    });
  }

  replaceProject(data) {
    const index = this.describeProjectFormArray.controls.findIndex(
      (x) => x.value._id === data._id
    );
    this.describeProjectFormArray.at(index).patchValue(
      this.addDescribeProjectGroup(data).value
    );
  }

  openAboutYourWorkModal(recommendation) {
    const initialState = {
      addedRecommendData: recommendation ? recommendation.getRawValue() : null,
    };
    this.modalRef = this.modalService.show(AboutWorkComponent, {
      initialState,
    });
    this.modalRef.setClass('modal-width');
    this.modalRef.content.onSubmitRecommendationEvent.subscribe((response) => {
      if (initialState.addedRecommendData) {
        this.replaceRecommendation(response);
      } else {
        this.recommendationFormArray.push(
          this.addRecommendationGroup(response)
        );
      }
      this.cdr.detectChanges();
    });
  }

  replaceRecommendation(data) {
    const index = this.recommendationFormArray.controls.findIndex(
      (x) => x.value._id === data._id
    );
    this.recommendationFormArray.at(index).patchValue(
      this.addRecommendationGroup(data).value
    );
  }

  closeModal() {
    this.modalRef.hide();
  }

  openAddWritingSampleModal(writingSample) {
    // console.log("")
    const initialState = {
      addedWritingSampleData: writingSample ? writingSample.getRawValue() : null,
    };
    this.modalRef = this.modalService.show(AddWritingSampleComponent, { initialState });
    this.modalRef.setClass('modal-width');
    this.modalRef.content.onSubmitWritingSample.subscribe(response => {
      if (initialState.addedWritingSampleData) {
        this.replaceWritingSample(response);
      } else {
        this.writingSampleFormArray.push(this.addWritingSampleGroup(response));
      }
      this.cdr.detectChanges();
    });
  }

  replaceWritingSample(data) {
    const index = this.writingSampleFormArray.controls.findIndex(
      (x) => x.value._id === data._id
    );
    this.writingSampleFormArray.at(index).patchValue(
      this.addWritingSampleGroup(data).value
    );
  }

  openAddAwardsModal(awards) {
    const initialState = {
      addedAwardsData: awards ? awards.getRawValue() : null,
    };
    this.modalRef = this.modalService.show(AddAwardsComponent, { initialState });
    this.modalRef.setClass('modal-width');
    this.modalRef.content.onSubmitAwards.subscribe(response => {
      if (initialState.addedAwardsData) {
        this.replaceAwards(response);
      } else {
        this.awardsFormArray.push(this.addAwardGroup(response));
      }
      this.cdr.detectChanges();
    });
  }

  replaceAwards(data) {
    const index = this.awardsFormArray.controls.findIndex(
      (x) => x.value._id === data._id
    );
    this.awardsFormArray.at(index).patchValue(
      this.addAwardGroup(data).value
    );
  }

  onSubmitForm(exit) {
    if(exit){
    }
    else{
      this.studentService.redirectToDashboard(exit);  // in case of save and exit button click
    let projectFormData = this.studentProjectForm.getRawValue();
    projectFormData.projects.redirectAction = exit;
    this.onSubmitProjectForm.emit(projectFormData);
  }

    this.studentService.redirectToDashboard(exit);  // in case of save and exit button click
    let projectFormData = this.studentProjectForm.getRawValue();
    projectFormData.projects.redirectAction = exit;
    this.onSubmitProjectForm.emit(projectFormData);
  }

  onFormBack() {
    const formData = this.studentProjectForm.getRawValue();
    this.onBackForm.emit(formData);
  }

  ngOnInit(): void {
    this.studiedFormSubscription = this.initStudiedForm().subscribe((form) => {
      this.studentProjectForm = form;
      this.projectFormAbstractControl = this.studentProjectForm.get('projects');
      this.describeProjectFormArray = Utils.typeCastToFormArray(
        this.studentProjectForm,
        StudentProfileStatus.PROJECTS,
        'describe_any_project'
      );
      this.recommendationFormArray = Utils.typeCastToFormArray(
        this.studentProjectForm,
        StudentProfileStatus.PROJECTS,
        'someone_said_something_or_recommendation'
      );
      this.writingSampleFormArray = Utils.typeCastToFormArray(this.studentProjectForm, StudentProfileStatus.PROJECTS, 'writing_sample');

      this.awardsFormArray = Utils.typeCastToFormArray(this.studentProjectForm,
        StudentProfileStatus.PROJECTS, 'award');

      this.cdr.detectChanges();
      // reset any_bpp fields on value change
      this.projectFormAbstractControl.get('any_bpp').get('answer').valueChanges.subscribe(value => {
        if (value) {
          this.projectFormAbstractControl.patchValue({
            any_bpp: {
              title: null,
              description: null
            }
          });

        }
      })
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.studiedFormSubscription.unsubscribe();
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
