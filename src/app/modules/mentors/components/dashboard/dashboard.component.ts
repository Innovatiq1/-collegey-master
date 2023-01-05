import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudentProfileStatusText } from 'src/app/core/enums/student-profile-status-text.enum';
import { Question } from 'src/app/core/models/common.model';
import { Dashboard, MentorDashboard, SignedUpProjects } from 'src/app/core/models/student-dashboard.model';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { environment, timezone } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  submit: Boolean = false;
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef3: BsModalRef;

  profileText: string = "Beginner";
  // Profile and office hours completed
  profilefirstStepCompleted: boolean = false;
  profilesecondStepCompleted: boolean = false;

  firstname: any;
  lastname: any;
  fullname: any;

  modalProjectEdit: BsModalRef;

  isFilterBy: boolean = false;
  promoEnable = false;
  MentoyByToolTrip: boolean = false;

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
        items: 1
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
  dashboard: MentorDashboard = new MentorDashboard();
  questionList: Question[] = [];

  userInfo: User = new User();

  progressBarValue: number = 25;

  isProfileCompleted = false;
  userSubscription: Subscription;

  mentors: any[];
  projects: any[];
  completedProjects: any[];
  opportunitiesArr: any[];
  pendingProjects: any[];
  liveProjects: any[];
  inviteProjects: any[];
  inProgressProjects: any[];
  allMentorProjects: any[];
  allCollegyProjects: any[];

  // Data Not Found in Project
  pendingprojectsNotfound: boolean = false;
  compltprojectNotfound: boolean = false;
  livesprojectsNotfound: boolean = false;
  projectsprogressNotfound: boolean = false;
  projectsInviteByStudentNotfound: boolean = false;


  projectIdeaForm: FormGroup;
  showErrorMessage = false;
  isAllQuestionAnswered = false;
  answer: any;
  questionnaireForm: FormGroup;
  projectDialog: any;
  reqstudent = true;
  memberships = false;
  opportunities = false;
  messegeclg = false;
  messegestu = false;
  test = false;
  userid: any;

  projectRedirect: boolean = false;
  showProjectAccept: boolean = false;
  includeInJoinProject: boolean = false;

  // Project Edit Data
  editProjectForm: FormGroup;
  submitProjectData: boolean = false;
  editProjectTitle: any;
  currentProjectId: any;

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private mentorDashboardService: MentorDashboardService,
    private toastrService: ToastrService,
    public commonService: CommonService,
    private authService: AuthService,
    private fb: FormBuilder,
    // private Editor: ClassicEditor,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: any,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.editProjectForm = this.fb.group({
      lastDate: ['', Validators.required],
      startDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getDashboardDetail();
    this.getUserInfo();
    this.initProjectIdeaForm();
    this.cdr.detectChanges();
  }

  redirectToProject() {
    localStorage.setItem("redirectProject", 'yes');
    setTimeout(() => {
      this.router.navigateByUrl('/mentors/profile');
    }, 1000);
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

  initProjectIdeaForm() {
    this.projectIdeaForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required]
    });
  }

  getUrl(val) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(val);
  }

  getUserInfo() {
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user._id;
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
  }

  openAddBannerDialog(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  updateInvitationProjectData(accept:any,projectId:any) {
    let obj = {
      inviteAction: accept, 
      projectId: projectId,
      userid: this.userid,
    }
    this.mentorDashboardService.updateInvitationProjectData(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.modalRef.hide();
        this.getDashboardDetail();
      },
      (err) => {
        
      },
    );
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

  getProjectAvatarColor(tempArray = []) {
    tempArray.forEach((doc: any, index) => {
      doc.cssIndex = this.getIndex(index);
    });
  }

  getDashboardDetail() {
    this.mentorDashboardService.getDashboardDetail().subscribe((res) => {
      if (res.profile.profile_completion) {
        this.calculateProfileProgress(
          res.profile.profile_completion.profile_text
        );
      }
      this.dashboard = res;
      this.firstname = this.dashboard?.profile?.name[0].toUpperCase() + this.dashboard?.profile?.name.substring(1);
      this.lastname = this.dashboard?.profile?.last_name[0].toUpperCase() + this.dashboard?.profile?.last_name.substring(1);
      this.fullname = this.firstname + ' ' + this.lastname;
      this.fullname = this.capitalize(this.firstname); //only the first name should display on Welcome, dashboard
      this.projects = this.dashboard.projects;
      this.pendingProjects = this.dashboard.pendingProjects;
      this.completedProjects = this.dashboard.completedProjects;
      this.liveProjects = this.dashboard.liveProjects;
      this.inviteProjects = this.dashboard.inviteProjects;
      this.inProgressProjects = this.dashboard.inProgressProjects;
      this.allMentorProjects = this.dashboard.allCollegeyMentorProjects;
      this.allCollegyProjects = this.dashboard.allCollegyProject;
      this.profileText = this.dashboard.profile.mentor_profile_completion.profile_text;
      this.profilefirstStepCompleted = this.dashboard.profile?.mentor_profile?.profile?.is_completed;
      this.profilesecondStepCompleted = this.dashboard.profile?.mentor_profile?.officeTimezone?.is_completed;

      if (res.pendingProjects.length == 0) { this.pendingprojectsNotfound = true; }
      if (res.completedProjects.length == 0) { this.compltprojectNotfound = true; }
      if (res.liveProjects.length == 0) { this.livesprojectsNotfound = true; }
      if (res.inProgressProjects.length == 0) { this.projectsprogressNotfound = true; }
      if (res.inviteProjects.length == 0) { this.projectsInviteByStudentNotfound = true; }

      this.cdr.detectChanges();
    });
  }

  capitalize(input) {
    var words = input.split(' ');
    var CapitalizedWords = [];
    words.forEach(element => {
      CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
    });
    return CapitalizedWords.join(' ');
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

  openGiveProjectIdeaModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
    this.modalRef.setClass("modal-width");
  }

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
    //this.userSubscription.unsubscribe();
  }

  openModalWithClass(template: TemplateRef<any>, project, projectlink: boolean,showInviteAccept:boolean) {
    this.projectDialog = project;

    if (this.projectDialog?.projectPlan?.projectDuration?.includes('month')) {
      this.projectDialog['project_week'] = this.projectDialog?.projectPlan?.projectDuration;
    }
    else {
      this.projectDialog['project_week'] = this.projectDialog?.projectPlan?.projectDuration + ' week';
    }
    
    if (projectlink == true) {
      this.projectRedirect = true;
    } else {
      this.projectRedirect = false;
    }
    
    if(project?.mentor?._id == this.userInfo?._id)
    {
      this.includeInJoinProject = true;
    }
    else
    {
      this.includeInJoinProject = false;
    }

    this.showProjectAccept = showInviteAccept;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
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

  openModalProjectEdit(template: TemplateRef<any>, projectData, projectId) {
    this.editProjectTitle = projectData?.title;
    this.editProjectForm.patchValue({
      startDate: moment(projectData?.start_date).format('YYYY-MM-DD'),
      lastDate: moment(projectData?.end_date).format('YYYY-MM-DD'),
    });
    this.modalRef.hide();
    this.currentProjectId = projectId;
    this.modalProjectEdit = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }

  updateProjectData() {
    this.submitProjectData = true;

    let obj = this.editProjectForm.value;
    obj['project'] = this.currentProjectId;
    if (this.editProjectForm.invalid) {
      return;
    }

    this.mentorDashboardService.updateProjectfieldData(obj).subscribe(
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

}
