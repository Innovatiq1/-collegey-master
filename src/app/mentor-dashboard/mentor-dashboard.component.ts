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
import { Dashboard, SignedUpProjects } from 'src/app/core/models/student-dashboard.model';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { StudentService } from 'src/app/core/services/student.service';


@Component({
  selector: 'app-mentor-dashboard',
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.css']
})
export class MentorDashboardComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;  
  modalRef1: BsModalRef;
  modalRef3: BsModalRef;
  isFilterBy:boolean=false;
  promoEnable = false;


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
  dashboard: Dashboard = new Dashboard();
  questionList: Question[] = [];

  userInfo: User = new User();

  progressBarValue: number = 25;


  isProfileCompleted = false;
  userSubscription: Subscription;

  projectIdeaForm: FormGroup;
  enrollProjectList: SignedUpProjects[] = [];

  showErrorMessage = false;
  isAllQuestionAnswered = false;
  answer: any;
  questionnaireForm: FormGroup;
  myProjects : any = [];
  collegeyProjects : any = [];
  impactPartnerProjects : any = [];
  mentorsProject : any = [];
  watchlistProjects : any = [];
  completedProjects : any = [];
  projectDialog : any;
  reqstudent=true;
  projectsprogress=false;
  compltproject=false;
  livesprojects=false;
  pendingprojects=false;
  mentorsprojects=false;
  memberships=false;
  opportunities=false;
  messegeclg=false;
  messegestu=false;
  Hostevent=false;
  Mentorresource=false;
  Mentorperks=false;
  tab : any = 'tab1';
  tab1 : any;
  tab2 : any;
  tab3 : any;
  tab4 : any;
  tab5 : any;
  tab6 : any;
  tab7 : any;
  tab8 : any;
  tab9 : any;
  tab110 : any;
  tab11 : any;
  tab12 : any;
  tab13 : any;
  test=false;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private studentService: StudentService,
    private studentDashboardService: StudentDashboardService,
    private toastrService: ToastrService,
    public commonService: CommonService,
    private authService: AuthService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: any,
    private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
      this.getDashboardDetail();
      this.getUserInfo();
      this.checkIsProfileCompleted();
      this.initProjectIdeaForm();
      // console.log("dtails",this.userInfo,this.dashboard)
      this.cdr.detectChanges();
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
  
    checkIsProfileCompleted() {
      this.userSubscription = this.studentService.isProfileCompleted$.subscribe((response) => {
        if (response) {
          this.isProfileCompleted = response?.profile_completion.profile_completed;
        } else {
          this.commonService.getUserDetails().subscribe((resp) => {
            this.isProfileCompleted = resp.profile_completed;
          });
        }
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
      // console.log(this.userInfo,"llll");
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
    
    onAddOrRemoveWatchlist(type:String,project_id){
      let data = {
        project_id:project_id,
        user_id:this.userInfo._id
      }
      if(type == 'Add'){
        this.studentDashboardService.onAddWatchlistProject(data).subscribe((res)=>{
          // console.log("AddWatchlistResponse",res);
          this.getDashboardDetail();
          this.cdr.detectChanges();
        })
      }
      else if(type == 'Remove'){
        this.studentDashboardService.onRemoveWatchlistProject(data).subscribe((res)=>{
          // console.log("RemoveWatchlistResponse",res);
          this.getDashboardDetail();
          this.cdr.detectChanges();
        })
      }
    }
    getDashboardDetail() {
      this.studentDashboardService.getDashboardDetail().subscribe((res) => {
        if (res.profile.profile_completion) {
          this.calculateProfileProgress(
            res.profile.profile_completion.profile_text
          );
        }
        this.dashboard = res;
        // console.log("Dashboard",res);
        this.myProjects = this.dashboard.signedupProjects;
        this.watchlistProjects = this.dashboard.watchlistProjects;
        this.completedProjects = this.dashboard.completedProjects;
        this.dashboard.projects.docs.forEach((project)=>{
          if(project.projectType == 'collegey'){
            this.collegeyProjects.push(project)
          }
          else if(project.projectType == 'impact-partner'){
            this.impactPartnerProjects.push(project)
          }
          else if(project.projectType == 'mentors'){
            this.mentorsProject.push(project)
          }
        })
        this.answer = res.questionnaire;
        this.getProjectAvatarColor(this.dashboard.projects.docs);   // get dynamic avatar color for project list
        this.enrollProjectList = res.signedupProjects;
        this.getProjectAvatarColor(this.enrollProjectList);   // get dynamic avatar color for signUp project list
        // console.log(this.enrollProjectList);
        this.cdr.detectChanges();
      });
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
      for(let i = 0; i< answers.length; i++) {
        if(answers[i] === false) {
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
          // console.log(this.enrollProjectList);
          this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
          this.modalRef.setClass('modal-small-width profile-completed');
        }
      });
    }
  
    openGiveProjectIdeaModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
      this.modalRef.setClass("modal-width");
    }
  
    openEditAnswerModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
      this.modalRef.setClass("modal-width");
      this.initQuestionnaireForm();
    }
  
    openViewAnswerModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
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
      this.userSubscription.unsubscribe();
    }

  openModalWithClass(template: TemplateRef<any>,project) {  
    this.projectDialog = project;
    // console.log("Modal",this.projectDialog)
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

  showFilters(){
    this.isFilterBy = !this.isFilterBy;
  }

  navigateProjectSection() {
    this.modalRef1.hide();
    this.router.navigateByUrl('/student-dashboard/$/project');
  }

  hideAndShowPromo(status:string){
    if(status === "promo"){
      this.promoEnable = !this.promoEnable;
    }else{
      this.promoEnable = !this.promoEnable;
    }
    
  }
  requeststudent(check){
  if(check==1){
    this.tab = '1';
  }
    this.reqstudent=true;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=false;
    this.mentorsprojects=false;
    this.memberships=false;
    this.opportunities=false;
    this.messegeclg=false;
    this.messegestu=false;
    this.Hostevent=false;
    this.Mentorresource=false;
    this.Mentorperks=false;
    this.test=false;
  }
  projectprogress(check){
    if(check==2){
      this.tab = 'tab2';
    }
  this.reqstudent=false;
  this.projectsprogress=true;
  this.compltproject=false;
  this.livesprojects=false;
  this.pendingprojects=false;
  this.mentorsprojects=false;
  this.memberships=false;
  this.opportunities=false;
  this.messegeclg=false;
  this.messegestu=false;
  this.Hostevent=false;
  this.Mentorresource=false;
  this.Mentorperks=false;
  this.test=false;  
}
  completeproject(check){
    if(check==3){
      this.tab = 'tab3';
    }
  this.reqstudent=false;
  this.projectsprogress=false;
  this.compltproject=true;
  this.livesprojects=false;
  this.pendingprojects=false;
  this.mentorsprojects=false;
  this.memberships=false;
  this.opportunities=false;
  this.messegeclg=false;
  this.messegestu=false;
  this.Hostevent=false;
  this.Mentorresource=false;
  this.Mentorperks=false;
  this.test=false;  
}
  liveproject(check){
    if(check==4){
      this.tab = 'tab4';
    }
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=true;
    this.pendingprojects=false;
    this.mentorsprojects=false;
    this.memberships=false;
    this.opportunities=false;
    this.messegeclg=false;
    this.messegestu=false;
    this.Hostevent=false;
    this.Mentorresource=false;
    this.Mentorperks=false;
    this.test=false;
  }
  pendingproject(check){
    if(check==5){
      this.tab = 'tab5';
    }
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=true;
    this.mentorsprojects=false;
    this.memberships=false;
    this.opportunities=false;
    this.messegeclg=false;
    this.messegestu=false;
    this.Hostevent=false;
    this.Mentorresource=false;   
    this.Mentorperks=false;
    this.test=false;
  }
  mentorproject(check){
    debugger
    if(check==6){
      this.tab = 'tab6';
    }
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=false;
    this.mentorsprojects=true;
    this.memberships=false;
    this.opportunities=false;
    this.messegeclg=false;
    this.messegestu=false;
    this.Hostevent=false;
    this.Mentorresource=false;
    this.Mentorperks=false;
    this.test=false;
  }
  mentorperks(check){
    if(check==7){
      this.tab = 'tab7';
    }
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=false;
    this.mentorsprojects=false;
    this.mentorsprojects=false;
    this.memberships=false;
    this.opportunities=false;
    this.messegeclg=false;
    this.messegestu=false;
    this.Hostevent=false;
    this.Mentorresource=false;
    this.Mentorperks=true;
    this.test=false;
  }
  membership(template: TemplateRef<any>,check){
    if(check==8){
      this.tab = 'tab8';
    }
    this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
    this.modalRef.setClass("modal-width");
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=false;
    this.mentorsprojects=false;
    this.memberships=true;
    this.opportunities=false;
    this.messegeclg=false;
    this.messegestu=false;
    this.Hostevent=false;
    this.Mentorresource=false;
    this.Mentorperks=false;
    this.test=false;
  }
  collegeyopp(check){
    if(check==9){
      this.tab = 'tab9';
    }
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=false;
    this.mentorsprojects=false;
    this.memberships=false;
    this.opportunities=true;
    this.messegeclg=false;
    this.messegestu=false;
    this.Hostevent=false;
    this.Mentorresource=false;
    this.Mentorperks=false;
    this.test=false;}
  msgcollegey(check){
    if(check==10){
      this.tab = 'tab10';
    }
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=false;
    this.mentorsprojects=false;
    this.memberships=false;
    this.opportunities=false;
    this.messegeclg=true;
    this.messegestu=false;
    this.Hostevent=false;
    this.Mentorresource=false;
    this.test=false;
    this.Mentorperks=false;}
  studentmsg(check){
    if(check==11){
      this.tab = 'tab11';
    }
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=false;
    this.mentorsprojects=false;
    this.memberships=false;
    this.opportunities=false;
    this.messegeclg=false;
    this.messegestu=true;
    this.Hostevent=false;
    this.Mentorresource=false;
    this.test=false;
    this.Mentorperks=false;}
  hostevent(check){
    if(check==12){
      this.tab = 'tab12';
    }
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=false;
    this.mentorsprojects=false;
    this.memberships=false;
    this.opportunities=false;
    this.messegeclg=false;
    this.messegestu=false;
    this.Hostevent=true;
    this.test=false;
    this.Mentorresource=false;this.Mentorperks=false;}
  mentorresource(check){ 
    if(check==13){
    this.tab = 'tab13';
  }
    this.reqstudent=false;
    this.projectsprogress=false;
    this.compltproject=false;
    this.livesprojects=false;
    this.pendingprojects=false;
    this.mentorsprojects=false;
    this.memberships=false;
    this.opportunities=false;
    this.messegeclg=false;
    this.messegestu=false;
    this.Hostevent=false;
    this.test=false;
    this.Mentorresource=true;this.Mentorperks=false;}
    testimonal(){
      this.reqstudent=false;
      this.projectsprogress=false;
      this.compltproject=false;
      this.livesprojects=false;
      this.pendingprojects=false;
      this.mentorsprojects=false;
      this.memberships=false;
      this.opportunities=false;
      this.messegeclg=false;
      this.messegestu=false;
      this.Hostevent=false;
      this.Mentorresource=false;this.Mentorperks=false;
      this.test=true;
    }
}