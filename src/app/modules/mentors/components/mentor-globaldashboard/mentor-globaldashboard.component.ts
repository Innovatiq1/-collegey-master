import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, TemplateRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Load Mentor Services
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../../../../core/services/project.service';

// Load Modal
import { User } from 'src/app/core/models/user.model';
import { Dashboard, MentorDashboard, SignedUpProjects } from 'src/app/core/models/student-dashboard.model';
import { StudentProfileStatusText } from 'src/app/core/enums/student-profile-status-text.enum';

// Modal Services and Extra library Services
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

//clipboard
import { Clipboard } from '@angular/cdk/clipboard';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mentor-globaldashboard',
  templateUrl: './mentor-globaldashboard.component.html',
  styleUrls: ['./mentor-globaldashboard.component.css']
})
export class MentorGlobaldashboardComponent implements OnInit {
  @Input() activeTab: string;

  sizeError:Boolean = false;

  // Dahboard Data Assign
  submit: Boolean = false;
  mentors: any[];
  dashboard: MentorDashboard = new MentorDashboard();
  progressBarValue: number = 25;
  bannerFor: String;
  bannerImages: any = [];
  listdafaultBanner: any = [];

  // Assign to User Data
  userInfo: User = new User();
  userid: any;
  userComboname: any;
  // Load Model Ref
  modalRef: BsModalRef;

  // Banner Files Data
  files: File[] = [];
  AllbannerImage: any;
  timeZoneList: any;
  CurrentBanner: any;

  //share profile
  siteurl: any;

  mentorFullName: any;
  mentorDisplayName: any;


  membershipForm: FormGroup;
  messageForm: FormGroup;

  // Testimonial
  testimonialFormGroup: FormGroup;
  submittedTestimonial: boolean = false;

  wordCount: any;
  words: any;

  //show word limit
  showWordLimitError: Boolean = false;

  // Tab Group
  tab: any = 'tab1';
  bannerisEdit = this.route.snapshot.data.title === 'mentor-profile' ? true : false;

  fetchcurrentImageheight: any;
  fetchcurrentImagewight: any;

  //userType
  userType:any;

  constructor(
    private modalService: BsModalService,
    private mentorDashboardService: MentorDashboardService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
    public commonService: CommonService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private clipboard: Clipboard,
  ) {
    // Get User Data
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user?.id;
    this.profileType();    
    this.userComboname = loggedInInfo?.user?.name + '-' + loggedInInfo?.user?.last_name;
    this.siteurl = environment.frontEndUrl;
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();

    this.testimonialFormGroup = this.fb.group({
      testimonal: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    });
    this.bannerFor = "profile";
  }

  ngOnInit(): void {
    this.membershipForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      email: ['', [Validators.required, Validators.email]]
    })

    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    })

    this.getDashboardDetail();
    this.getCurrentUserData();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.testimonialFormGroup.controls[controlName].hasError(errorName);
  };


  // Add Top Banner Popup 

  openAddBannerDialog(template: TemplateRef<any>) {
    this.getBanners();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }

  goToLink(url: string) {
    var url1 = url + this.siteurl + 'profile/' + this.userid + '/' + this.userComboname
    //console.log("==========",url1)
    window.open(url1, "_blank");
  }

  goToLinkedin(url: string) {
    var url1 = url + this.siteurl + 'profile/' + this.userid + '/' + this.userComboname
    //console.log("==========",url1)
    window.open(url1, "_blank");
  }

  goToTwit(url: string) {
    var url1 = url + this.siteurl + 'profile/' + this.userid + '/' + this.userComboname
    //console.log("==========",url1)
    window.open(url1, "_blank");
  }

  CopyClipboardUrl() {

    var currentUrl = this.siteurl + 'mentor-profile/' + this.userid + '/' + this.userComboname.replace(/\s/g, "");
    this.clipboard.copy(currentUrl);
    this.toastrService.success('Link Copied To Clipboard');
  }

  getCurrentUserData() {
    const obj = {
      userid: this.userInfo?._id,
    };
    this.mentorDashboardService.getCurrentUserData(obj).subscribe(
      (response) => {
        this.tab = this.activeTab;
        this.AllbannerImage = response.data.AllbannerImage;
        this.CurrentBanner = response.data.bannerImage;
      },
      (err) => {

      },
    );
  }

  getBanners() {
    const obj = {
      bannerFor: this.bannerFor,
    };
    this.projectService.getBanners(obj).subscribe(
      (response) => {
        this.bannerImages = response.data;
        this.listdafaultBanner = [];
        for (let i = 0; i < this.bannerImages.length; i++) {
          let checkExistingBanner = this.bannerExists(this.bannerImages[i].imagePath);
          if (checkExistingBanner == false) {
            this.listdafaultBanner.push(this.bannerImages[i]);
          }
        }
        this.cdr.detectChanges();

      },
      (err) => {

      },
    );
  }

  bannerExists(bannerIame) {
    return this.AllbannerImage.some(function (el) {
      return el.image === bannerIame;
    });
  }

  // Get the Dashboard information

  getDashboardDetail() {
    this.mentorDashboardService.getDashboardDetail().subscribe((res) => {
      if (res.profile.profile_completion) {
        this.calculateProfileProgress(
          res.profile?.profile_completion?.profile_text
        );
      }
      this.dashboard = res;
     // this.mentorFullName = this.dashboard?.profile?.name.toLowerCase() + ' ' + this.dashboard?.profile?.last_name.toLowerCase();
      // if (this.dashboard?.profile?.mentor_profile?.profile?.fullLegalName != '') {
      //   this.mentorFullName = this.dashboard?.profile?.mentor_profile?.profile?.fullLegalName.toLowerCase();
      //   this.mentorDisplayName = this.capitalize(this.mentorFullName);
      // }

      if (this.dashboard?.profile?.mentor_profile) {
        console.log('yes');
        this.mentorFullName = this.dashboard?.profile?.mentor_profile?.profile?.fullLegalName.toLowerCase();
        this.mentorDisplayName = this.capitalize(this.mentorFullName);
      }
      else {
        console.log('no');
        this.mentorFullName = this.dashboard?.profile?.name.toLowerCase()+' '+this.dashboard?.profile?.last_name.toLowerCase();
        this.mentorDisplayName = this.capitalize(this.mentorFullName);
      }
      this.cdr.detectChanges();
    });
  }

  profileType(){
    const loggedInInfo = this.authService.getUserInfo();
    this.userType = this.capitalize(loggedInInfo?.user?.type);    
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

  onSelectBanner(event) {
    this.sizeError=false;
    if (event.addedFiles[0].type == 'image/jpeg' || event.addedFiles[0].type == 'image/png' || event.addedFiles[0].type == 'image/jpg') {
      var _URL = window.URL || window.webkitURL;
      var fileMatch, imgesData;
      if ((fileMatch = event.addedFiles[0])) {
        imgesData = new Image();
        var objectUrl = _URL.createObjectURL(fileMatch);
        imgesData.onload = function () {
          var currentWidth = this.width;
          var currentHeight = this.height;
          window.localStorage.setItem('currentImageheight', currentHeight);
          window.localStorage.setItem('currentImagewight', currentWidth);
          _URL.revokeObjectURL(objectUrl);
        };
        imgesData.src = objectUrl;
      }

      setTimeout(() => {
        this.fetchcurrentImageheight = localStorage.getItem('currentImageheight');
        this.fetchcurrentImagewight = localStorage.getItem('currentImagewight');
        if (this.fetchcurrentImagewight <= 2000 && this.fetchcurrentImageheight <= 2000) {
          this.files.push(...event.addedFiles);
        }
        else {
          this.sizeError=true;
          localStorage.removeItem('currentImageheight');
          localStorage.removeItem('currentImagewight');
          return;
        }
      }, 1000);

    }
    else {
      this.toastrService.error('Allow only .png, .jpeg, .jpg this file');
      return;
    }
  }

  onRemoveBanner(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  addUserBannerData() {
    const formDataBanner = new FormData();
    if (this.files.length > 0) {
      this.files.forEach((file) => {
        formDataBanner.append('file', file);
      });

      formDataBanner.append('userid', this.userInfo?._id);
      this.mentorDashboardService.uploadMultipleBanner(formDataBanner).subscribe(
        (response) => {
          this.files = [];
          this.toastrService.success(response.message);
          this.getCurrentUserData();
          this.choiceUserBannerImage(0, 'userbanner', null);
        },
        (err) => {

        },
      );
    } else {
      this.toastrService.error('Please upload a File! & upload only .png, .jpeg, .jpg');
    }

  }

  choiceUserBannerImage(bannerIndex: any, choiceBanner: any, defaultBannerId: any) {
    const obj = {
      userid: this.userInfo?._id,
      bannerIndex: bannerIndex,
      choiceBanner: choiceBanner,
      defaultBannerId: defaultBannerId
    };
    this.mentorDashboardService.choiceUserBannerImage(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.getCurrentUserData();
        this.getBanners();
        this.modalRef.hide()
      },
      (err) => {

      },
    );
  }

  // Refer Collegey 

  get f() { return this.membershipForm.controls; }

  onSubmitMembership() {
    this.submit = true;
    if (this.membershipForm.invalid) return
    let data = {
      name: this.membershipForm.value.name,
      email: this.membershipForm.value.email
    }
    this.mentorDashboardService.addMember(data).subscribe((res) => {
      if (res) {
        this.toastrService.success('Member referred successfully!');
        this.onReset(1)
        this.modalRef.hide();
        this.getMentorPerks()
      } else {
        this.toastrService.error('Something went wrong!');
      }
      this.cdr.detectChanges();
    });
  }

  getMentorPerks() {
    this.mentorDashboardService.getMentorPerks().subscribe((res: any) => {
      if (res) {
        this.mentors = res
      } else {
        this.toastrService.error('Something went wrong!');
      }
      this.cdr.detectChanges();
    });
  }

  onReset(value) {
    this.submit = false;
    if (value == 1) this.membershipForm.reset();
    if (value == 2) this.messageForm.reset();
  }

  membership(template: TemplateRef<any>, check) {
    if (check == 3) {
      this.tab = 'tab3';
    }
    this.onReset(1);
    this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
    // this.modalRef.setClass("modal-width");
  }

  msgcollegey(template: TemplateRef<any>, check) {
    this.testimonialFormGroup.reset();
    this.showWordLimitError = false;
    if (check == 10) {
      this.tab = 'tab10';
    }
    if (check == 11) {
      this.tab = 'tab11';
    }
    this.onReset(2);
    this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
    // this.modalRef.setClass("modal-width");
  }

  wordCounts(text, limit) {
    this.wordCount = text ? text.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
    if (this.words > limit) {
      return true;
    } else {
      return false;
    }
  }

  // Add Testimonial

  addTestimonial() {
    this.submittedTestimonial = true;
    let obj = this.testimonialFormGroup.value;
    obj['user'] = this.userInfo?._id;

    const testimonalTextCount = this.wordCounts(this.testimonialFormGroup.value.testimonal, 250)

    if (this.testimonialFormGroup.invalid || testimonalTextCount) {
      return;
    }
    this.mentorDashboardService.addTestimonial(obj).subscribe(
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

  wordCounter(event) {
    if (event.keyCode != 32) {
      this.wordCount = event.target.value ? event.target.value.split(/\s+/) : 0;
      this.words = this.wordCount ? this.wordCount.length : 0;
    }

    if (this.words > 250) {
      this.showWordLimitError = true;
    } else {
      this.showWordLimitError = false;
    }
  }

  get g() { return this.messageForm.controls; }

  onSubmitMessage() {
    this.submit = true;
    const messageTextCount = this.wordCounts(this.messageForm.value.message, 250)
    let obj = this.messageForm.value;
    obj['user'] = this.userInfo?._id;
    if (this.messageForm.invalid || messageTextCount) {
      return;
    }
    this.mentorDashboardService.addContactCollegey(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.modalRef.hide();
        this.messageForm.reset();
        this.submit = false;
      },
      (err) => {
        this.toastrService.error('Contact not send');
        this.submit = false;
      },
    );
  }

}
