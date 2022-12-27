import { Component, OnInit, OnDestroy, TemplateRef, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { StudentService } from 'src/app/core/services/student.service';
import { Dashboard, SignedUpProjects } from 'src/app/core/models/student-dashboard.model';
import { ToastrService } from 'ngx-toastr';
import { Question } from 'src/app/core/models/common.model';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { StudentProfileStatusText } from 'src/app/core/enums/student-profile-status-text.enum';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { Subscription } from 'rxjs';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-university-dashboard',
  templateUrl: './university-dashboard.component.html',
  styleUrls: ['./university-dashboard.component.css']
  })
  export class UniversityDashboardComponent implements OnInit {
  modalRef: BsModalRef;

  // dashboard: Dashboard = new Dashboard();
  questionList: Question[] = [];

  userInfo: User = new User();
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 300,
    navText: ['<', '>'],
    items: 1,
    nav: false,
  };
  events=false;
  plan=false;
  Dashboard=true;
  collegefeedback=false;
  progressBarValue: number = 25;

  slidesStore: any[] = [];

  isProfileCompleted = false;
  userSubscription: Subscription;

  projectIdeaForm: FormGroup;
  enrollProjectList: SignedUpProjects[] = [];

  showErrorMessage = false;
  isAllQuestionAnswered = false;
  answer: any;
  questionnaireForm: FormGroup;


  constructor(
    private studentService: StudentService,
    private studentDashboardService: StudentDashboardService,
    private toastrService: ToastrService,
    public commonService: CommonService,
    private authService: AuthService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit(): void {
  
  }
  dashboard(){
    this.Dashboard=true;
    this.events=false;
    this.plan=false;
    this.collegefeedback=false;
  }
  event() {
  this.events=true
  this.Dashboard=false;
  this.plan=false;
  this.collegefeedback=false;
  }
  travelpan(){
    this.plan=true;
    this.events=false;
    this.Dashboard=false;
    this.collegefeedback=false;
  }
  feedback(){
    this.collegefeedback=true;
    this.events=false;
    this.Dashboard=false;
    this.plan=false;
  }
  openEventModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass("modal-width");
  }
  opentravelModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass("modal-width");
  }
  openfeedbackModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass("modal-width");
  }
  opennetworkModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass("modal-width");
  }
  openinvitestudentModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass("modal-width");
  }
}
