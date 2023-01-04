import { DOCUMENT, isPlatformBrowser, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudentProfileStatusText } from 'src/app/core/enums/student-profile-status-text.enum';
import { Question } from 'src/app/core/models/common.model';
import { Dashboard, SignedUpProjects } from 'src/app/core/models/student-dashboard.model';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { StudentService } from 'src/app/core/services/student.service';
import { ProjectService } from '../../../../core/services/project.service';
import { CertificateComponent } from '../../../../certificate/certificate.component';
import { PaymentDialogComponent } from '../../../student-dashboard/components/payment-dialog/payment-dialog.component';

// Load City, State and Country
import { Countries, State, Cities } from 'src/app/core/models/static-data.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';

// Load library for pdf
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { Clipboard } from '@angular/cdk/clipboard';

import * as moment from 'moment';
import * as moment_timezone from 'moment-timezone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef3: BsModalRef;
  modalReviewRef: BsModalRef;
  modalProjectEdit: BsModalRef;
  firstname: any;
  lastname: any;

  createProject:boolean = false;


  isFilterBy: boolean = false;
  promoEnable = false;
  projectData: any
  MentoyByToolTrip: boolean = false;
  isActive: boolean = false;
  show_loader: boolean = false;

  // Country Object 
  countries: Countries[] = JSON.parse(localStorage.getItem(AppConstants.KEY_COUNTRIES_DATA));

  slidesStore = [
    {
      id: 1,
      src: 'http://localhost:4200/assets/images/Collegey_Logo_Blue.svg',
      alt: 'Image_1',
      title: 'Image_1'
    },
    {
      id: 2,
      src: 'http://localhost:4200/assets/images/Collegey_Logo_Blue.svg',
      alt: 'Image_2',
      title: 'Image_3'
    },
    {
      id: 3,
      src: 'http://localhost:4200/assets/images/Collegey_Logo_Blue.svg',
      alt: 'Image_3',
      title: 'Image_3'
    },
    {
      id: 4,
      src: 'http://localhost:4200/assets/images/Collegey_Logo_Blue.svg',
      alt: 'Image_4',
      title: 'Image_4'
    },
    {
      id: 5,
      src: 'http://localhost:4200/assets/images/Collegey_Logo_Blue.svg',
      alt: 'Image_5',
      title: 'Image_5'
    },
    {
      id: 6,
      src: 'http://localhost:4200/assets/images/Collegey_Logo_Blue.svg',
      alt: 'Image_4',
      title: 'Image_4'
    },
    {
      id: 7,
      src: 'http://localhost:4200/assets/images/Collegey_Logo_Blue.svg',
      alt: 'Image_5',
      title: 'Image_5'
    }
  ];

  customOptions: OwlOptions = {
    loop: false,
    dots: false,
    nav: true,
    navSpeed: 700,
    navText: ['<', '>'],
    stagePadding: 100,
    margin: 30,
    items: 4,
    responsive: {
      0: {
        items: 1,
        margin: 20,
      },
      600: {
        items: 2
      },
      992: {
        items: 3
      },
      1100: {
        items: 4
      }
    }
  }

  dashboard: Dashboard = new Dashboard();
  questionList: Question[] = [];

  userInfo: User = new User();

  progressBarValue: number = 25;


  isProfileCompleted = false;
  userSubscription: Subscription;

  testimonialFormGroup: FormGroup;
  projectIdeaForm: FormGroup;
  enrollProjectList: SignedUpProjects[] = [];
  submittedTestimonial: boolean = false;


  showErrorMessage = false;
  isAllQuestionAnswered = false;
  answer: any;
  programesData: any;
  completedProgramesData: any;
  questionnaireForm: FormGroup;
  createformDatas: FormGroup;
  myProjects: any = [];
  collegeyProjects: any = [];
  impactPartnerProjects: any = [];
  mentorsProject: any = [];
  watchlistProjects: any = [];
  completedProjects: any = [];
  projectDialog: any;
  projectRedirect: boolean = false;
  completedProjectsData: any
  impactPartnerProjectsData: any;
  mentorsProjectData: any;
  projectInProgressData: any;
  collegeyProjectData: any;
  pendingProjects: any;
  userid: any;
  ImageUrl: string;
  bannerImage: any;
  multiple1: any = [];
  admincarImg: any;
  showCompleteProfile: boolean = true;
  fetchrefralProjectResponse: any;
  selectedProject: any;

  // Set Last date and start date
  projectStartDate: any;
  projectSetLastDate: any;

  includeInProject: any = [];
  userProjectInclude: any = [];
  includeInProjectMember: boolean = false;
  includeInJoinProject: boolean = false;
  @ViewChild('addDialog') viewAddDialogRef: TemplateRef<any>;

  // Genrate Pdf 
  dafaultGenratepdf: boolean = false;
  dafaultGenratepdf1: boolean = false;
  pdfData: any = {};
  projectFilterFormGroup: FormGroup;
  projectKeywordArray: any = [];
  projectFilterData: any = {
    country: "",
    projectTag: [],
    IndustryOption: "",
    projectTypeArray: "",
  };
  public Productchecks: any = [
    { label: 'Collegey', value: 'collegey' },
    { label: "Mentors", value: 'mentors' },
  ];

  // Project Review
  addReviewForm: FormGroup;
  submitProjectReview: boolean = false;
  projectReviewId: any;
  programReviewId: any;
  includeInReview: any = [];
  includeProjectReview: boolean = false;

  includeInProgramReview: any = [];
  includeProgramReview: boolean = false;


  // Project Edit Data
  editProjectForm: FormGroup;
  submitProjectData: boolean = false;
  editProjectTitle: any;
  editProgramTitle: any;
  mentorList: any;

  totalCreditRewardPoint: any = 0;
  totalDebitRewardPoint: any = 0;
  totalLeftRewardPoint: any = 0;

  resRewardData: any;
  acceptMentorInvitation: boolean = false;
  acceptMentorName: any;

  rewardRedeemedData: any;
  schoolYearArray: any[] = [];
  sortedEducationSchoolFormArray: any = [];

  // Project Certificate Set
  completeProjectCertificate: any;
  completeProgramCertificate:any;

  // Fetch Current User Data
  fetchCurrentUserData:any;

  // Program Status
  programStatus:any;

  constructor(
    private projectService: ProjectService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private studentDashboardService: StudentDashboardService,
    private toastrService: ToastrService,
    public commonService: CommonService,
    private authService: AuthService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: any,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private clipboard: Clipboard,
  ) {
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user._id;
    if (this.router.url.indexOf('/blog') > -1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }

    this.testimonialFormGroup = this.fb.group({
      testimonal: ['', Validators.required],
      name: [''],
      qualification: ['NIL'],
      country: [''],
      url: [''],
    });

    this.projectFilterFormGroup = this.fb.group({
      country: ['', Validators.required],
      projectTypeArray: [''],
      projectTag: [''],
      IndustryOption: [''],
    });

    this.addReviewForm = this.fb.group({
      rating2: ['', Validators.required],
      reviewtext: ['', Validators.required],
    });

    this.editProjectForm = this.fb.group({
      lastDate: ['', Validators.required],
      startDate: ['', Validators.required],
      requestMentor: [''],
    });

    var myDateSet = new Date();
    var newDateSet = this.datePipe.transform(myDateSet, 'yyyy-MM-dd');
    this.projectStartDate = newDateSet;
    this.projectSetLastDate = newDateSet;
    this.fetchCurrentUserData = JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA)); 
  }

  ngOnInit(): void {
    const tokenid = this.route.snapshot.params['id'];
    console.log('-=-===->',tokenid);
    this.navid()
    this.getInviteProjectDetail(tokenid);
    this.getDashboardDetail();
    this.getMentors();
    this.getUserRewardPoints();
    this.getRewardRedeemedSettingData();
    this.getCurrentUserData();
    this.getProgramesData();
    this.getCompletedProgramesData();
    /*  this.getUserInfo();
     this.checkIsProfileCompleted();
     this.initProjectIdeaForm();
     this.cdr.detectChanges();
     this.getProjectedCreatedByMe(this.userInfo._id);
     this.getAllCompletedProjectsData();
     this.getAllImpactPartnersData();
     this.getAllProjectByMentorsData();
     this.getAllProjectInProgressData();
     this.getAllProjectInPending();
     this.getAllProjectByCollegeyData();
     // this.addWatchLits(this.collegeyProjectData._id);
     this.initialFormDataStudent();
     this.getBannerImage(); */
  }

  getCurrentUserData() {
    let educationSchoolFormArray = [];
    let studentDataList = this.fetchCurrentUserData?.user;

    for (let i = 0; i < studentDataList?.student_profile?.history_updated?.education?.length; i++) {
      let typeEducaion = studentDataList?.student_profile?.history_updated?.education[i]?.type;
      if (typeEducaion == 'School' || typeEducaion == 'high school student') {
        educationSchoolFormArray.push(studentDataList?.student_profile?.history_updated?.education[i]);
      }
    }

    //SORT SCHOOL BY YEAR
    for (let index = 0; index < educationSchoolFormArray.length; index++) {
      let end_year = educationSchoolFormArray[index]?.grade[0].end_year;
      if (!this.schoolYearArray.includes(end_year)) {
        this.schoolYearArray.push(end_year);
      }
    }

    this.schoolYearArray.sort(function (a, b) {
      return b - a;
    });

    for (let index = 0; index < this.schoolYearArray.length; index++) {
      for (let j = 0; j < educationSchoolFormArray.length; j++) {
        if (parseInt(this.schoolYearArray[index]) == parseInt(educationSchoolFormArray[j]?.grade[0].end_year)) {
          this.sortedEducationSchoolFormArray.push(educationSchoolFormArray[j])
        }
      }
    }
  }

  onChangeProjectStart(event) {
    var myCurrentDate = new Date(event.target.value);
    myCurrentDate.setDate(myCurrentDate.getDate() + 21);
    var newPlusDate = this.datePipe.transform(myCurrentDate, 'yyyy-MM-dd');
    this.projectSetLastDate = newPlusDate;
    this.editProjectForm.patchValue({
      lastDate: '',
    });
  }

  getMentors() {
    this.studentDashboardService
      .getMentors()
      .subscribe((data) =>
        this.mentorList = data
      );
  }


  onCheckChange(event) {
    const formArray: FormArray = this.projectFilterFormGroup.get('projectTypeArray') as FormArray;
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else {
      // find the unselected element
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  initQuestionnaireForm() {
    this.questionnaireForm = this.fb.group({
      ted_talk: [this.answer ? this.answer.ted_talk : null],
      teaching_skill: [this.answer ? this.answer.teaching_skill : null],
      learning_skill: [this.answer ? this.answer.learning_skill : null],
      impact: [this.answer ? this.answer.impact : null],
      interview_media_house: [this.answer ? this.answer.interview_media_house : null],
      work_title: [this.answer ? this.answer.work_title : null],
      city_country: [this.answer ? this.answer.city_country : null]
    });
  }

  initialFormDataStudent() {
    this.createformDatas = this.fb.group({
      title: [],
      can_be_done: [],
      projectMembers: [],
      sdg: [],
      milestones: [],
      studentOutcome: []
    })
  }

  getFormData() {
    let studentData =
    {
      can_be_done: {
        remotely: this.createformDatas.value.can_be_done,
      },

      projectPrice: {
        amount: this.createformDatas.value.studentOutcome,
      },
      title: this.createformDatas.value.title,
      sdg: [],
      students_count: this.createformDatas.value.projectMembers,
      studentMilestones: []
    }
    return studentData;
  }


  submitStudent() {
    this.studentDashboardService.onCreateStudentForm(this.getFormData()).subscribe(((response: any) => {
      if (response.status = "success") {
        this.modalRef.hide();
      }
    }))
  }
  hideCompleteProfile() {
    this.showCompleteProfile = false;
  }

  checkIsProfileCompleted() {
    this.userSubscription = this.studentService.isProfileCompleted$.subscribe((response) => {
      if (response) {
        this.isProfileCompleted = response?.profile_completion.profile_completed;
      } else {
        this.isProfileCompleted = this.fetchCurrentUserData?.user?.profile_completed;
        // this.commonService.getUserDetails().subscribe((resp) => {
        //   this.isProfileCompleted = resp.profile_completed;
        // });
      }
    });
  }
  getProgramesData(){
   
    let obj = { user_id: this.userid };
    this.projectService.pogramesList(obj).subscribe((response: any) => {
      
      this.programesData = response.program;
      this.cdr.detectChanges();
    });

  }
  getCompletedProgramesData(){
   
    let obj = { user_id: this.userid };
    this.projectService.completedpogramesList(obj).subscribe((response: any) => {
      this.completedProgramesData = response.program;
      this.cdr.detectChanges();
    });

  }



  initProjectIdeaForm() {
    this.projectIdeaForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required]
    });
  }

  getUserInfo() {
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
  }

  onSubmitForm() {
    this.projectIdeaForm.markAllAsTouched();
    if (this.projectIdeaForm.invalid) {
      this.showErrorMessage = true;
      return;
    }
    const formData: any = {};
    formData.payload = this.projectIdeaForm.getRawValue();
    this.studentDashboardService.saveProjectIdea(formData).subscribe(response => {
      if (response) {
        this.toastrService.success(response.message);
        this.modalRef.hide();
        this.projectIdeaForm.reset();
      }
    })
  }

  getProjectAvatarColor(tempArray = []) {
    tempArray.forEach((doc: any, index) => {
      doc.cssIndex = this.getIndex(index);
    });
  }

  onAddOrRemoveWatchlist(type: String, project_id) {
    let data = {
      project_id: project_id,
      user_id: this.userInfo._id
    }
    if (type == 'Add') {
      this.studentDashboardService.onAddWatchlistProject(data).subscribe((res) => {
        this.getDashboardDetail();
        this.cdr.detectChanges();
      })
    }
    else if (type == 'Remove') {
      this.studentDashboardService.onRemoveWatchlistProject(data).subscribe((res) => {
        this.getDashboardDetail();
        this.cdr.detectChanges();
      })
    }
  }


  // addWatchLits(id: string){
  //   this.studentDashboardService.getProjectAddWatchlist(id).subscribe((response:any)=>{
  //  console.log(response,"llll");
  //   })
  // }

  getDashboardDetail() {
    // this.show_loader = true;
    this.studentDashboardService.getDashboardDetailNew().subscribe((res) => {

      if (res.profile.profile_completion) {
        this.calculateProfileProgress(
          res.profile.profile_completion.profile_text
        );
      }
      this.dashboard = res;
      this.firstname = this.dashboard?.profile?.name[0].toUpperCase() + this.dashboard?.profile?.name.substring(1);
      this.lastname = this.dashboard?.profile?.last_name[0].toUpperCase() + this.dashboard?.profile?.last_name.substring(1);

      //this.myProjects = this.dashboard.signedupProjects;
      this.watchlistProjects = this.dashboard.watchlistProjects;
      //this.completedProjects = this.dashboard.completedProjects;
      /*  this.dashboard.projects.docs.forEach((project)=>{
         if(project.projectType == 'collegey'){
          // console.log("project-collegu",project);
           this.collegeyProjects.push(project)
         }
         else if(project.projectType == 'impact-partner'){
           this.impactPartnerProjects.push(project)
         }
         else if(project.projectType == 'mentors'){
           this.mentorsProject.push(project)
         }
       }) */
      // this.answer = res.questionnaire;
      // console.log("Line no 376 :",this.answer);
      // this.getProjectAvatarColor(this.dashboard.projects.docs);   // get dynamic avatar color for project list
      // this.enrollProjectList = res.signedupProjects;
      // this.getProjectAvatarColor(this.enrollProjectList);   // get dynamic avatar color for signUp project list
      this.cdr.detectChanges();
      // this.show_loader = false;
      // this.show_loader = false;
      this.getUserInfo();
      this.checkIsProfileCompleted();
      this.initProjectIdeaForm();
      this.getProjectedCreatedByMe(this.userInfo._id);
      this.getAllCompletedProjectsData();
      this.getAllProjectByMentorsData();
      this.getAllProjectInProgressData();
      this.getAllProjectInPending();
      this.getAllProjectByCollegeyData();
      // this.getAllImpactPartnersData();
      // this.addWatchLits(this.collegeyProjectData._id);
      this.initialFormDataStudent();
      this.getBannerImage();
    });
  }

  onSubmitProjectFilter() {
    this.projectKeywordArray = [];
    let obj = this.projectFilterFormGroup.value;

    for (let i = 0; i < obj.projectTag.length; i++) {
      this.projectKeywordArray.push(obj.projectTag[i].value);
    }

    obj['projectTag'] = this.projectKeywordArray;
    this.projectFilterData = obj;
    if (obj.projectTypeArray != '') {
      if (obj.projectTypeArray == 'collegey') {
        this.getAllProjectByCollegeyData();
        this.mentorsProjectData = [];
      }
      else if (obj.projectTypeArray == 'mentors') {
        this.getAllProjectByMentorsData();
        this.collegeyProjectData = [];
      }
      this.getAllProjectInProgressData();
    }
    else {
      this.getAllProjectByMentorsData();
      this.getAllProjectByCollegeyData();
      this.getAllProjectInProgressData();
    }
  }

  ProjectFilterReset() {
    this.projectKeywordArray = [];
    this.projectFilterData =
    {
      country: "",
      projectTag: [],
      projectTypeArray: "",
      IndustryOption: "",
    };

    this.projectFilterFormGroup.reset();
    this.projectFilterFormGroup.get("country").setValue('');
    this.getAllProjectByMentorsData();
    this.getAllProjectByCollegeyData();
    this.getAllProjectInProgressData();
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

  updateQuestionnaire(slide) {
    if (!slide.answered) {
      this.toastrService.error('Please fill the mandatory field');
      return;
    }
    const object = { [slide.key]: slide.answered };
    this.studentDashboardService.saveDashboardQuestionnaire(object).subscribe((res) => {
      this.answer = res;
      this.checkAllQuestionAnswered(res);
      this.slidesStore = [...this.shuffle(this.slidesStore)];
    });
  }



  checkAllQuestionAnswered(res) {
    let isAnswered = false;
    const answers = Object.values(res);
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === false) {
        isAnswered = false;
        break;
      } else {
        isAnswered = true;
      }
    }
    this.isAllQuestionAnswered = isAnswered;
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  _onSignUpProject(template: TemplateRef<any>, projectId, index) {
    const formData = {
      project_id: projectId
    };
    this.studentDashboardService.onSignUpProject(formData).subscribe(response => {
      if (response) {
        this.dashboard.projects.docs[index].signedup = true;
        this.enrollProjectList.push(response.signedupProject[0]);
        this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
        this.modalRef.setClass('modal-small-width profile-completed');
      }
    });
  }

  openGiveProjectIdeaModal(template: TemplateRef<any>) {
    this.router.navigateByUrl('/student-dashboard/$/project');
    // this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
    // this.modalRef.setClass("modal-width");
  }
  // openGiveProjectIdeaModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
  //   this.modalRef.setClass("modal-width");
  // }

  openEditAnswerModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
    this.modalRef.setClass("modal-width");
    this.initQuestionnaireForm();
  }

  openViewAnswerModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
    this.modalRef.setClass("modal-width modal-answer");
  }

  getIndex(index) {
    let array = [1, 2, 3];
    return array[index % array.length];
  }

  scrollToId(scrollElement: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = this.document.getElementById(scrollElement);
      if (element) {
        const headerOffset = 80;
        const bodyRect = this.document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const scrollPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.userSubscription?.unsubscribe();
    // this.userSubscription.unsubscribe();
  }

  CopyCertificateUrl(certificateUrl: any) {
    this.clipboard.copy(certificateUrl);
    this.toastrService.success('Certificate Url Copied To Clipboard');
  }

  openModalWithClass(template: TemplateRef<any>, project, projectlink: boolean) {
    
    this.includeInProject = [];
    this.userProjectInclude = [];
    this.projectDialog = project;

    const obj = {
      project_id: project?._id,
      userId: this.userInfo?._id,
    };
    this.studentDashboardService.CheckProjectAvilableSloat(obj).subscribe(
      (response) => {
        for (let i = 0; i < response?.result?.length; i++) {
          this.userProjectInclude.push(response?.result[i]?.user_id);
        }

        for (let i = 0; i < response?.projectreview?.length; i++) {
          this.includeInReview.push(response?.projectreview[i]?.reviewBy);
        }

        if (this.includeInReview.length > 0) {
          this.includeProjectReview = this.includeInReview?.includes(this.userInfo?._id);
        }
        else {
          this.includeProjectReview = false;
        }

        if (this.userProjectInclude.length > 0) {
          this.includeInJoinProject = this.userProjectInclude?.includes(this.userInfo?._id);
        }
        else {
          this.includeInJoinProject = false;
        }
        
        /* this.projectDialog.availableSlot = project?.remainingSlot - response?.data;
        
        if(project?.mentor && project?.mentor?._id != project?.projectOwner?._id) {
          this.projectDialog.availableSlot = this.projectDialog.availableSlot + 2;
        }
        else
        {
          if(project?.projectOwner?.type != 'admin')
          {
            this.projectDialog.availableSlot = this.projectDialog.availableSlot + 1;
          }
        } */
        
        this.projectDialog.availableSlot = project?.remainingSlot - project?.projectMembers?.length;
        this.completeProjectCertificate  = response?.certificateData?.certificateUrl;
      },
      (err) => {

      },
    );

    for (let m = 0; m < this.projectDialog?.projectMembers?.length; m++) {
      this.includeInProject.push(this.projectDialog?.projectMembers[m]?._id);
    }

    if (this.includeInProject.length > 0) {
      this.includeInProjectMember = this.includeInProject?.includes(this.userInfo?._id);
      this.pdfData['student_name'] = this.userInfo?.name + ' ' + this.userInfo?.last_name;
      this.pdfData['student_projectname'] = this.projectDialog?.title;
      if (this.projectDialog?.projectPlan?.projectDuration?.includes('month')) {
        this.pdfData['project_week'] = this.projectDialog?.projectPlan?.projectDuration;
      }
      else {
        this.pdfData['project_week'] = this.projectDialog?.projectPlan?.projectDuration + ' week';
      }
      this.pdfData['project_completed_date'] = this.projectDialog?.updatedAt;
      if (this.sortedEducationSchoolFormArray?.length > 0) {
        this.pdfData['student_school_name'] = this.sortedEducationSchoolFormArray[0]?.name + ', ' + this.sortedEducationSchoolFormArray[0]?.locationCity;
      }
    }
    else {
      this.includeInProjectMember = false;
    }

    if (projectlink == true) {
      this.projectRedirect = true;
    } else {
      this.projectRedirect = false;
    }
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }
  openModalWithClass1(template: TemplateRef<any>, project, projectlink: boolean,checkProgramStatus:any) {
    console.log("project",project)
    this.programStatus = checkProgramStatus;
    this.projectService.program_detail(project._id).subscribe((res: any) => {
      //console.log("=======",res.programDetails)
      
      for (let i = 0; i < res?.programDetails?.programReview?.length; i++) {
        this.includeInProgramReview.push(res?.programDetails?.programReview[i]?.reviewBy);
      }

      if (this.includeInProgramReview.length > 0) {
        this.includeProgramReview = this.includeInProgramReview?.includes(this.userInfo?._id);
      }
      else {
        this.includeProgramReview = false;
      }
      this.completeProgramCertificate = res?.certificateData?.certificateUrl;
      this.projectDialog = res?.programDetails;
      console.log("this.projectDialog",this.projectDialog);
    });
    
    this.includeInProject = [];
    this.userProjectInclude = [];
   
    const obj = {
      project_id: project?._id,
      userId: this.userInfo?._id,
    };
    
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }


  genratePdf() {
    this.dafaultGenratepdf = true;
    setTimeout(() => {
      const dashboard = document.getElementById('contentToConvert');
      const dashboardHeight = dashboard.clientHeight;
      const dashboardWidth = dashboard.clientWidth;
      const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

      domtoimage.toPng(dashboard, options).then((imgData) => {
        const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        doc.save('Dashboard for hyperpanels.pdf');
      });
      this.dafaultGenratepdf = false;
    }, 1000);
  }

  openBingoDialog(template3: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef3 = this.modalService.show(
      template3,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }

  openPaymentDialog(template1: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef1 = this.modalService.show(
      template1,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }

  showFilters() {
    this.isFilterBy = !this.isFilterBy;
  }

  closeFilters() {
    this.isFilterBy = false;
    this.projectFilterFormGroup.reset();
    this.projectFilterFormGroup.get("country").setValue('');
  }

  navigateProjectSection() {
    this.modalRef1.hide();
    this.router.navigateByUrl('/student-dashboard/$/project');
  }

  hideAndShowPromo(status: string) {
    if (status === "promo") {
      this.promoEnable = !this.promoEnable;
    } else {
      this.promoEnable = !this.promoEnable;
    }

  }

  getProjectedCreatedByMe(id: string) {
    let obj = { projectOwner: id };
    this.studentDashboardService.getProjectIcreatedDatais(obj).subscribe((response: any) => {
      this.projectData = response?.data?.data;
      this.cdr.detectChanges();
    })
  }

  getAllCompletedProjectsData() {
    let obj = { projectStatus: 'completed', limit: 100, userId: this.userid };
    this.studentDashboardService.getAllCompletedProjects(obj).subscribe((response: any) => {
      this.completedProjectsData = response?.data?.data;
      this.cdr.detectChanges();
    })
  }

  getAllImpactPartnersData() {
    this.studentDashboardService.getProjectByImpactPartners().subscribe((response: any) => {
      this.impactPartnerProjectsData = response.data;
      this.cdr.detectChanges();

    })
  }

  getAllProjectByMentorsData() {
    let obj = { projectType: 'mentors', projectFilter: this.projectFilterData };
    this.studentDashboardService.getAllProjectByMentorsCount(obj).subscribe((response: any) => {
      this.mentorsProjectData = response?.data?.data;
      this.cdr.detectChanges();

    });
  }

  getAllProjectInProgressData() {
    let obj = { user_id: this.userid, projectFilter: this.projectFilterData };
    this.projectService.projectdashboard_detail(obj).subscribe((response: any) => {
      this.projectInProgressData = response.data;
      this.cdr.detectChanges();
    });
    // this.studentDashboardService.getAllProjectInProgress().subscribe((response:any)=>{
    //   this.projectInProgressData = response.data;
    // })
  }

  getAllProjectInPending() {
    let obj = { user_id: this.userid };
    this.projectService.getAllPendingProjectByStudent(obj).subscribe((response: any) => {
      this.pendingProjects = response.data;
      this.cdr.detectChanges();
    });
    // this.studentDashboardService.getAllProjectInProgress().subscribe((response:any)=>{
    //   this.projectInProgressData = response.data;
    // })
  }

  getAllProjectByCollegeyData() {
    //this.show_loader = true;
    let obj = { projectType: 'collegey', projectFilter: this.projectFilterData };
    this.studentDashboardService.getAllProjectByCollegeyCount(obj).subscribe((response: any) => {
      this.collegeyProjectData = response?.data?.data;
      this.cdr.detectChanges();
      // this.show_loader = false;
    })
  }

  createproject(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }

  // get user rewards points data in observable

  // getUserRewardPoints() {
  //   let creditRewardPoint = {
  //     "user_id": this.userid,
  //   };
  //   this.studentService.getUserRewardPoints(creditRewardPoint).subscribe((res) => {
  //     this.resRewardData = res;
  //     this.resRewardData?.data?.rewardsPointobjects.forEach(element => {
  //       this.totalCreditRewardPoint = parseFloat(this.totalCreditRewardPoint) + parseFloat(element.rewardCreditPoint);
  //       this.totalDebitRewardPoint = parseFloat(this.totalDebitRewardPoint) + parseFloat(element.rewardDebitPoint);
  //     });
  //     this.totalLeftRewardPoint = parseFloat(this.totalCreditRewardPoint) - parseFloat(this.totalDebitRewardPoint);
  //   });
  // }

  getUserRewardPoints() {
    const rewardData = this.authService.getReward();
      this.resRewardData = rewardData;
      this.resRewardData?.rewardsPointobjects.forEach(element => {
        this.totalCreditRewardPoint = parseFloat(this.totalCreditRewardPoint) + parseFloat(element.rewardCreditPoint);
        this.totalDebitRewardPoint = parseFloat(this.totalDebitRewardPoint) + parseFloat(element.rewardDebitPoint);
      });
      this.totalLeftRewardPoint = parseFloat(this.totalCreditRewardPoint) - parseFloat(this.totalDebitRewardPoint);
  }

  getRewardRedeemedSettingData() {
    const obj = {};
    this.studentService.getRewardRedeemedSettingData(obj).subscribe(
      (response) => {
        this.rewardRedeemedData = response?.data;
      },
      (err) => {

      },
    );
  }



  paymentForProject(id: string, projectTitle: any) {

    if (this.totalLeftRewardPoint > this.rewardRedeemedData?.redeemed_value && this.rewardRedeemedData?.redeemed_allow == 'yes') {
      this.paymentForFreeProject(id, true, 'reward', this.rewardRedeemedData?.redeemed_value);
    }
    else {
      this.studentDashboardService.getProjectPayment(id).subscribe((response: any) => {
        if (response.status == "success") {

          /* let creditRewardPoint = {
            "user_id": this.userid,
            "rewardName": "Project Join :"+" "+projectTitle,
            "rewardCreditPoint": "200",
          };
          this.studentService.createCreditRewardPoint(creditRewardPoint).subscribe((result) => {
            this.toastrService.info("Congratulations! 200 Reward Point.");
            this.document.location.href = response.session.url;
          }); */

          this.document.location.href = response.session.url;
        }
      })
    }
  }

  paymentForFreeProject(id: string, rewardjoin: boolean, paymentType: any, paymentAmount: any) {
    let obj = { project_id: id, user_id: this.userid, rewardjoin: rewardjoin, paymentType: paymentType, paymentAmount: paymentAmount };
    this.projectService.UserProjectSuccess(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        // this.studentService.createCreditRewardPoint(creditRewardPoint).subscribe((result) => {
        //   this.toastrService.info("Congratulations! 200 Reward Point.");
        //   this.router.navigate(['/success']);
        // });
        this.toastrService.info("Congratulations! 200 Reward Point.");
        this.router.navigate(['/success']);
      },
      (err) => {
        this.toastrService.error('Add project faild');
      },
    );
  }

  openPaymentModal(id: string) {
    this.modalRef.hide();
    const initialState = {
      project_id: id,
      user_id: this.userid,
      class: "my-modal"
    };
    this.modalRef = this.modalService.show(PaymentDialogComponent, { initialState });
  }

  getBannerImage() {
    this.ImageUrl = localStorage.getItem("BannerImage");
  }
  multipleFiles1(event: any) {
    var file = event.target.files;
    if (file[0].type == 'image/jpeg' || file[0].type == 'image/png' || file[0].type == 'image/jpg') {
      debugger;
      this.multiple1 = [];
      var multipleFiles = event.target.files;
      this.bannerImage = event.target.files[0];
      // console.log('image :', this.bannerImage);
      if (multipleFiles) {
        for (var file of multipleFiles) {
          var multipleReader = new FileReader();
          multipleReader.onload = (e: any) => {
            this.admincarImg = e.target.result;
          };
          multipleReader.readAsDataURL(file);
        }
      }
      // console.log("bannerImage:", this.bannerImage);
      let data = new FormData();
      data.append("file", this.bannerImage);
      this.studentDashboardService
        .uploadBanner(data)
        .subscribe((res: any) => {
          this.ImageUrl = res.data.data.fileUrl;
          // console.log('ImageUrl:', this.ImageUrl);
          localStorage.setItem("BannerImage", this.ImageUrl)
        });
    }
    else {
      this.toastrService.error('Allow only .png, .jpeg, .jpg this file');
      return;
    }

  }

  getInviteProjectDetail(tokenid) {
    if (tokenid != "$") {
      const data = {
        "id": tokenid
      }
      this.projectService.fetchrefralProject(data).subscribe(
        (res) => {
          if (res.status = "success") {
            this.fetchrefralProjectResponse = res.data;
            this.cdr.detectChanges();

            //console.log("referal fetchrefralProjectResponse Id : ",this.fetchrefralProjectResponse);
            const projectID = this.fetchrefralProjectResponse.projectDetails[0].id;
            this.projectService.project_detail(projectID).subscribe(
              (result) => {

                this.selectedProject = result;
                //console.log("Project Id Details : ",this.selectedProject.data?.projectDetails?.projectDetail);
                this.projectDialog = this.selectedProject.data?.projectDetails?.projectDetail;
                if (projectID == '615d5843ddcd3e4b7bdc9b8d') {
                  this.projectRedirect = true;
                } else {
                  this.projectRedirect = false;
                }
                this.modalRef = this.modalService.show(this.viewAddDialogRef, { class: 'gray modal-lg', ignoreBackdropClick: true });
              }
            );

          }
        }
      );
    }
  }

  msgcollegey(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true }));
    //this.modalRef.setClass("modal-width");
  }

  // Add Testimonial

  addTestimonial() {
    let profile = this.dashboard?.profile;
    let cityName = profile?.cityObj.name;
    let countryName = profile?.countryObj?.name;
    let fName = profile.name;
    let lname = profile.last_name;
    if (!fName) {
      return;
    }
    this.submittedTestimonial = true;
    let obj = this.testimonialFormGroup.value;
    obj['user'] = this.userid;
    obj['name'] = fName + " " + lname;
    obj['country'] = cityName + ", " + countryName;
    if (obj['url']) {
      obj['type'] = 'text url';
    } else {
      obj['type'] = 'text';
    }
    if (this.testimonialFormGroup.invalid) {
      return;
    }
    // console.log("addTestimonial reqData :", obj); 
    this.studentDashboardService.addTestimonial(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.modalRef.hide();
        this.testimonialFormGroup.reset();
        this.submittedTestimonial = false;
      },
      (err) => {
        this.toastrService.error('testimonial not added');
        this.submittedTestimonial = false;
      },
    );
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.testimonialFormGroup.controls[controlName].hasError(errorName);
  };
  public hasErrorDate = (controlName: string, errorName: string) => {
    return this.editProjectForm.controls[controlName].hasError(errorName);
  };

  openModalProjectReview(template: TemplateRef<any>, projectData, projectId) {
    this.editProjectTitle = projectData?.title;
    this.projectReviewId = projectId;
    this.modalRef.hide();
    this.modalReviewRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }
  openModalProgramReview(template: TemplateRef<any>, programData, programId) {
    this.editProgramTitle = programData?.title;
    this.programReviewId = programData.Programs;
    this.modalRef.hide();
    this.modalReviewRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }


  addProjectReview() {
    let profile = this.dashboard?.profile;
    let fName = profile.name;
    let lname = profile.last_name;

    this.submitProjectReview = true;
    let obj = this.addReviewForm.value;
    obj['user'] = this.userid;
    obj['name'] = fName + " " + lname;
    obj['project'] = this.projectReviewId;
    obj['user_image'] = profile?.avatar;

    if (this.addReviewForm.invalid) {
      return;
    }

    this.studentDashboardService.updateReviewproject(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.modalReviewRef.hide();
        this.addReviewForm.reset();
        this.submitProjectReview = false;
        this.getDashboardDetail();
      },
      (err) => {
        this.toastrService.error('review not added');
        this.submitProjectReview = false;
      },
    );

  }
  addProgramReview() {
    let profile = this.dashboard?.profile;
    let fName = profile.name;
    let lname = profile.last_name;

    this.submitProjectReview = true;
    let obj = this.addReviewForm.value;
    obj['user'] = this.userid;
    obj['name'] = fName + " " + lname;
    obj['program'] = this.programReviewId;
    obj['user_image'] = profile?.avatar;

    if (this.addReviewForm.invalid) {
      return;
    }

    this.studentDashboardService.updateReviewprogram(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.modalReviewRef.hide();
        this.addReviewForm.reset();
        this.submitProjectReview = false;
        this.getDashboardDetail();
      },
      (err) => {
        this.toastrService.error('review not added');
        this.submitProjectReview = false;
      },
    );

  }


  public reviewhasError = (controlName: string, errorName: string) => {
    return this.addReviewForm.controls[controlName].hasError(errorName);
  };

  openModalProjectEdit(template: TemplateRef<any>, projectData, projectId) {

    this.editProjectTitle = projectData?.title;
    this.acceptMentorInvitation = projectData?.acceptMentorInvitation;
    this.acceptMentorName = projectData?.mentor?.name;

    this.editProjectForm.patchValue({
      startDate: moment(projectData?.start_date).format('YYYY-MM-DD'),
      lastDate: moment(projectData?.end_date).format('YYYY-MM-DD'),
      requestMentor: projectData?.requestMentor,
    });
    this.modalRef.hide();
    this.projectReviewId = projectId;
    this.modalProjectEdit = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }

  updateProjectData() {
    this.submitProjectData = true;
    let obj = this.editProjectForm.value;
    obj['project'] = this.projectReviewId;
    obj['student'] = this.dashboard?.profile?.name + " " + this.dashboard?.profile?.last_name;
    obj['projectName'] = this.editProjectTitle;
    if (this.editProjectForm.invalid) {
      return;
    }
    this.studentDashboardService.updateProjectfieldData(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.modalProjectEdit.hide();
        this.editProjectForm.reset();
        this.submitProjectData = false;
        this.getDashboardDetail();
      },
      (err) => {
        this.toastrService.error('project not updated');
        this.submitProjectData = false;
      },
    );
  }

  isAuthenticated() {
    return this.authService.getToken();
  }

  navid(){
    if(!this.isAuthenticated()){
      this.toastrService.error('Please login first');
      this.router.navigateByUrl('/');
    }
  }
}