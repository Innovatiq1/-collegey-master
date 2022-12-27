import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { environment } from 'src/environments/environment';
import {
  Dashboard,
  SignedUpProjects,
} from 'src/app/core/models/student-dashboard.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';

// Modal Services and Extra library Services
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// Load Services
import { ProjectService } from '../../../../core/services/project.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { MentorService } from 'src/app/core/services/mentor.service';

import { StudentService } from 'src/app/core/services/student.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dash-header',
  templateUrl: './dash-header.component.html',
  styleUrls: ['./dash-header.component.css'],
})
export class DashHeaderComponent implements OnInit {
  sizeError:Boolean = false;
  dashboard: Dashboard = new Dashboard();
  showCompleteProfile: boolean = false;
  completeProfileMsgShow: boolean = false;

  isActive: boolean = false;
  userid: any;
  userComboname: any;
  siteurl: any;

  // Dahboard Banner Data Assign
  bannerFor: String;
  bannerImages: any = [];
  listdafaultBanner: any = [];

  // Banner Files Data
  files: File[] = [];
  AllbannerImage: any = [];
  timeZoneList: any;
  CurrentBanner: any;
  badgeMastersList: any;
  showbadges: Boolean = false;

  bannerUpload: Boolean = false;

  firstname: any;
  lastname: any;
  currentUserRole: any;

  wordCount: any;
  words: any;

  //show word limit
  showWordLimitError: Boolean = false;

  // Load Model Ref
  modalRef: BsModalRef;
  testimonialModalRef: BsModalRef;
  modalRefContactCollegey: BsModalRef;

  // Testimonial
  testimonialFormGroup: FormGroup;
  submittedTestimonial: boolean = false;
  show_loader: boolean = false;

  // Message Collegy 
  collegymsgFormGroup: FormGroup;
  submittedCollegyMsg: boolean = false;

  //Contact Collegey
  contactCollegeyForm: FormGroup;
  submit: Boolean = false;

  // Tab Group
  tab: any = 'tab1';

  ImageUrl: any;
  bannerImage: any;
  multiple1: any = [];
  uploadProfileImage: any;
  admincarImg: any;

  //mentor profile view
  mentorProfileView: Boolean = false;
  mentorId: any;
  mentorProfileBanner: any;
  ProfilePic: any;
  mentorFullName: any;
  mentorDisplayName: any;
  mentorData: any;
  loggedInInfo:any
  fetchcurrentImageheight: any;
  fetchcurrentImagewight: any;
  constructor(
    private studentService: StudentService,
    private studentDashboardService: StudentDashboardService,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private clipboard: Clipboard,
    private mentorDashboardService: MentorDashboardService,
    private cdr: ChangeDetectorRef,
    private mentorService: MentorService,
    private cookieService: CookieService,
  ) {
    if (this.router.url.indexOf('/blog') > -1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }

    if (this.router.url.indexOf('/mentor-profile') > -1) {
      this.mentorProfileView = true;
      this.mentorId = this.route.snapshot.paramMap.get('id');
      this.getMentorData();
    } else {
      this.mentorProfileView = false;
    }

    this.loggedInInfo = this.authService.getUserInfo();
    this.userid = this.loggedInInfo?.user?.id;
    this.userComboname = this.loggedInInfo?.user?.name.toLowerCase() + '-' + this.loggedInInfo?.user?.last_name.toLowerCase();
    this.userComboname = this.userComboname.replace(/\s/g, '');
    this.siteurl = environment.frontEndUrl;


    this.testimonialFormGroup = this.fb.group({
      testimonal: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      name: [''],
      qualification: ['NIL'],
      country: [''],
      url: ['', [Validators.pattern(/^(?!\s*$).+/)]],
    });

    this.bannerFor = "profile";

    this.collegymsgFormGroup = this.fb.group({
      message: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    });

    this.completeProfileMsgShow = JSON.parse(
      this.cookieService.get('hide_completeProfile') || 'false'
    );

    this.studentService.getStudentProfile().subscribe((profileData) => {
      let profile_completed_status = profileData?.profile_completion?.profile_text;
      if (profile_completed_status == "Expert") {
        this.showCompleteProfile = false;
        this.completeProfileMsgShow = true;
      }
      else
      {
        this.showCompleteProfile = true;
      }
    });
  }

  ngOnInit(): void {
    this.contactCollegeyForm = this.fb.group({
      message: ['', Validators.required],
    })
    this.getDashboardDetail();
    this.getCurrentUserData();
  }

  over(drop:NgbDropdown){
    drop.open()
  }
  out(drop:NgbDropdown){
    drop.close()
  }

  getMentorData() {
    const obj = {
      userid: this.mentorId,
    };
    this.mentorService.getMentorUserDataFetch(obj).subscribe(
      (response) => {

        this.badgeMastersList = response?.data?.badgemastersdata;
        if (this.badgeMastersList.length > 0) {
          this.showbadges = true;
        }
        this.mentorData = response?.data;
        this.mentorProfileBanner = response?.data.bannerImage;
        this.ProfilePic = response?.data?.avatar;
        // this.mentorProjects = response?.mentorProject;

        // this.MentorProfileInfo = response?.data?.mentor_profile?.profile;
        this.mentorFullName = response?.data?.mentor_profile?.profile.fullLegalName.toLowerCase();
        this.mentorDisplayName = this.mentorFullName[0].toUpperCase() + this.mentorFullName.substring(1);
        // this.mentorDisplayName = this.capitalize(this.mentorFullName);


        // this.mentorFullName    = this.mentorFullName.replace(/\s/g,'');

        // this.MentorOfficeInfo  = response?.data?.mentor_profile?.officeHours;

        // this.MentorOfficeTimezone = response?.data?.mentor_profile?.officeTimezone?.timezoneName;

        // this.profilefirstStepCompleted  = response?.data?.mentor_profile?.profile?.is_completed;
        // this.profilesecondStepCompleted = response?.data?.mentor_profile?.officeTimezone?.is_completed;

      },
      (err) => {

      },
    );
  }

  // getDashboardDetail() {
  //   //this.show_loader = true;
  //   this.studentDashboardService.getDashboardHeaderDetail().subscribe((res) => {
  //     this.dashboard = res;
  //     this.firstname = this.dashboard?.profile[0]?.name[0].toUpperCase() + this.dashboard?.profile[0]?.name.substring(1);
  //     this.lastname = this.dashboard?.profile[0]?.last_name[0].toUpperCase() + this.dashboard?.profile[0]?.last_name.substring(1);
  //     // this.show_loader = false;
  //   });
  // }

  getDashboardDetail() {
    //this.show_loader = true;
      var res =this.loggedInInfo.user      
      var obj:Dashboard | any={
        profile:[{
        avatar:res?.avatar,
        cityObj:res?.cityObj?.name,
        countryObj:res?.countryObj?.name,
        email:res?.email,
        last_name:res?.last_name,
        name:res?.name,
        stateObj:res?.stateObj?.name,
        _id:res?._id,
        }]
      };
      
      this.dashboard = obj
      
      this.firstname = this.dashboard?.profile[0]?.name[0].toUpperCase() + this.dashboard?.profile[0]?.name.substring(1);
      this.currentUserRole = this.dashboard?.profile[0]?.type;
      this.lastname = this.dashboard?.profile[0]?.last_name[0].toUpperCase() + this.dashboard?.profile[0]?.last_name.substring(1);
      // this.show_loader = false;

  }

  // Add Top Banner Popup 

  openAddBannerDialog(template: TemplateRef<any>) {
    this.getBanners();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
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
    var currentUrl = this.siteurl + 'profile/' + this.userid + '/' + this.userComboname;
    this.clipboard.copy(currentUrl);
    this.toastrService.success('Link Copied To Clipboard');
  }

  getCurrentUserData() {
    const obj = {
      userid: this.userid,
    };
    //this.show_loader = true;
    this.AllbannerImage = [];
    this.studentDashboardService.getCurrentUserDataFetch(obj).subscribe(
      (response) => {
        this.CurrentBanner = response?.data.bannerImage;
        this.badgeMastersList = response?.data?.badgemastersdata;
        if (this.badgeMastersList.length > 0) {
          this.showbadges = true;
        }
        for (let i = 0; i < response?.data?.AllbannerImage?.length; i++) {
          this.AllbannerImage.push(response?.data?.AllbannerImage[i]);
        }
        //this.show_loader = false;
      },
      (err) => {
        //  this.show_loader = false;
      },
    );
  }

  getBanners() {
    const obj = {
      bannerFor: this.bannerFor,
    };
    this.listdafaultBanner = [];
    this.projectService.getBanners(obj).subscribe(
      (response) => {
        this.bannerImages = response.data;
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
      return el?.image === bannerIame;
    });
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
      formDataBanner.append('userid', this.userid);
      this.studentDashboardService.uploadMultipleBanner(formDataBanner).subscribe(
        (response) => {
          this.bannerUpload = true;
          this.files = [];
          this.toastrService.success(response.message);
          this.getCurrentUserData();
          this.getBanners();
          this.choiceUserBannerImage(0, 'userbanner', null)
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
      userid: this.userid,
      bannerIndex: bannerIndex,
      choiceBanner: choiceBanner,
      defaultBannerId: defaultBannerId
    };
    this.studentDashboardService.choiceUserBannerImage(obj).subscribe(
      (response) => {
        if (!this.bannerUpload) {
          this.toastrService.success(response.message, "", { timeOut: 4000 });
        }
        this.getCurrentUserData();
        this.getBanners();
        this.modalRef.hide();
        this.bannerUpload = false;
      },
      (err) => {

      },
    );
  }


  multipleFiles1(event: any) {
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
        //this.settingToLocal();
      });
  }

  // settingToLocal(){
  //   localStorage.setItem("BannerImage",this.ImageUrl)
  //   const obj = {
  //     userid: this.userid,
  //     bannerImage: this.ImageUrl,
  //   };
  //   this.studentDashboardService.updateBannerImage(obj).subscribe(
  //     (response) => {

  //     },
  //     (err) => {

  //     },
  //   );   
  // }

  hideCompleteProfile() {
    this.showCompleteProfile = false;
    this.completeProfileMsgShow = true;
    var expiryDate = new Date();
    var minutes = 480;
    expiryDate.setTime(expiryDate.getTime() + (minutes * 60 * 1000));
    this.cookieService.set(
      'hide_completeProfile',
      JSON.stringify(this.completeProfileMsgShow),
      expiryDate
    );
  }

  msgcollegey(template: TemplateRef<any>) {
    this.submittedTestimonial = false;
    this.showWordLimitError = false;
    this.testimonialFormGroup.reset();
    this.testimonialModalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true }));
    //this.modalRef.setClass("modal-width");
  }

  onCloseTestimonialModal() {
    this.testimonialModalRef.hide();
    this.submittedTestimonial = false;
  }

  // Add Testimonial
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
  wordCounts(text, limit) {
    this.wordCount = text ? text.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
    if (this.words > limit) {
      return true;
    } else {
      return false;
    }
  }

  addTestimonial() {
    const testimonalTextCount = this.wordCounts(this.testimonialFormGroup.value.testimonal, 250)
    let profile = this.dashboard?.profile;
    let cityName = profile[0].cityObj;
    let countryName = profile[0].countryObj
    let fName = profile[0].name;
    let lname = profile[0].last_name;
    if (!fName) {
      return;
    }
    this.submittedTestimonial = true;
    let obj = this.testimonialFormGroup.value;
    obj['user'] = this.userid;
    obj['name'] = fName + " " + lname;
    obj['country'] = countryName;
    if (obj['url']) {
      obj['type'] = 'text url';
    } else {
      obj['type'] = 'text';
    }
    if (this.testimonialFormGroup.invalid || testimonalTextCount) {
      return;
    }
    this.studentDashboardService.addTestimonial(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.testimonialModalRef.hide();
        this.testimonialFormGroup.reset();
        this.submittedTestimonial = false;
      },
      (err) => {
        this.toastrService.error('testimonial not added');
        this.submittedTestimonial = false;
      },
    );
  }

  //Contact Collegey Tab

  contactCollegey(template: TemplateRef<any>) {
    // if (check == 10) { 
    //   this.tab = 'tab10';
    // }
    // if (check == 11) { 
    //   this.tab = 'tab11';
    // }
    // this.onReset(2);
    this.submit = false;
    this.showWordLimitError = false;
    this.collegymsgFormGroup.reset();
    this.modalRefContactCollegey = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
    // this.modalRefContactCollegey.setClass("modal-width");
  }

  onCloseContactCollegey() {
    this.modalRefContactCollegey.hide();
    this.submit = false;
  }

  onSubmitMessage() {
    const messageTextCount = this.wordCounts(this.collegymsgFormGroup.value.message, 250);
    this.submit = true;
    let obj = this.collegymsgFormGroup.value;
    obj['user'] = this.userid;
    if (this.collegymsgFormGroup.invalid || messageTextCount) {
      return;
    }
    this.mentorDashboardService.addContactCollegey(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.modalRefContactCollegey.hide();
        this.collegymsgFormGroup.reset();
        this.submit = false;
      },
      (err) => {
        this.toastrService.error('Contact not send');
        this.submit = false;
      },
    );
  }

  // onReset(value) {
  //   this.submit = false;
  //   // if (value == 1) this.membershipForm.reset();
  //   if (value == 2) this.contactCollegeyForm.reset();
  // }

  get g() { return this.contactCollegeyForm.controls; }



  public hasError = (controlName: string, errorName: string) => {
    return this.testimonialFormGroup.controls[controlName].hasError(errorName);
  };

  public hasCollegyMsgError = (controlName: string, errorName: string) => {
    return this.collegymsgFormGroup.controls[controlName].hasError(errorName);
  };

}
