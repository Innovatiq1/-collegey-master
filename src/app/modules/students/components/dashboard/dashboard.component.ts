import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { environment } from 'src/environments/environment';
import {
  Dashboard,
  SignedUpProjects,
} from 'src/app/core/models/student-dashboard.model';
import { Router } from '@angular/router';
import { Countries, State, Cities } from 'src/app/core/models/static-data.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';

// Modal Services and Extra library Services
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';

// Load Services
import { ProjectService } from '../../../../core/services/project.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { Subscription } from 'rxjs';
import { StaticDataService } from 'src/app/core/services/static-data.service';

import { StudentService } from 'src/app/core/services/student.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  sizeError: Boolean = false;
  private subscriptionName: Subscription;
  locationChanged: Boolean = false;
  dashboard: Dashboard = new Dashboard();
  showCompleteProfile: boolean = false;
  completeProfileMsgShow: boolean = false;

  isActive: boolean = false;
  userid: any;
  userComboname: any;
  siteurl: any;
  countries: Countries[] = JSON.parse(
    localStorage.getItem(AppConstants.KEY_COUNTRIES_DATA));

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

  // Load Model Ref
  modalRef: BsModalRef;
  modalRefContactCollegey: BsModalRef;

  //Contact Collegey
  contactCollegeyForm: FormGroup;
  submit: Boolean = false;

  // Tab Group
  tab: any = 'tab1';

  firstname: any;
  lastname: any;

  wordCount: any;
  words: any;

  //show word limit
  showWordLimitError: Boolean = false;

  bannerUpload: Boolean = false;

  // Testimonial
  testimonialFormGroup: FormGroup;
  submittedTestimonial: boolean = false;
  show_loader: boolean = false;

  ImageUrl: any;
  bannerImage: any;
  multiple1: any = [];
  uploadProfileImage: any;
  admincarImg: any;

  cityName: any;
  stateName: any;
  countryName: any;
  qualification:any

  fetchcurrentImageheight: any;
  fetchcurrentImagewight: any;

  constructor(
    private studentDashboardService: StudentDashboardService,
    private studentService: StudentService,
    public commonService: CommonService,
    private router: Router,
    private authService: AuthService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private clipboard: Clipboard,
    private mentorDashboardService: MentorDashboardService,
    private cdr: ChangeDetectorRef,
    private staticDataService: StaticDataService,
    private cookieService: CookieService,
  ) {
    if (this.router.url.indexOf('/blog') > -1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user?.id;
    this.userComboname = loggedInInfo?.user?.name.toLowerCase() + '-' + loggedInInfo?.user?.last_name.toLowerCase();
    this.userComboname = this.userComboname.replace(/\s/g, '')
    this.siteurl = environment.frontEndUrl;

    this.testimonialFormGroup = this.fb.group({
      testimonal: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      name: [''],
      qualification: [''],
      country: [''],
      url: ['', [Validators.pattern(/^(?!\s*$).+/)]],
    });
    this.bannerFor = "profile";

    this.subscriptionName = this.commonService.getUpdate().subscribe
      (message => {
        // console.log("message", message);

        //Get states
        this.staticDataService.getStates(message.country).subscribe(
          (response) => {
            if (response.length == 0) {
              this.stateName = '';
              this.cdr.detectChanges();
            } else {
              for (let index = 0; index < response.length; index++) {
                if (response[index].id == message.state) {
                  this.stateName = response[index].name;
                  this.cdr.detectChanges();
                }
              }
            }

          },
          (error) => {
            // this.toastrService.error(error.message || 'Oops something went wrong');
          }
        );

        //Get Cities
        this.staticDataService.getCities(message.state).subscribe(
          (response) => {
            if (response.length == 0) {
              this.cityName = '';
              this.cdr.detectChanges();
            } else {
              response.forEach(city => {
                if (city.id == message.city) {
                  this.cityName = city.name;
                  this.cdr.detectChanges();
                }
              })
            }
          },
          (error) => {
            // this.toastrService.error(error.message || 'Oops something went wrong');
          }
        );

        //Get Country
        for (let index = 0; index < this.countries.length; index++) {
          if (this.countries[index].id == message.country) {
            this.countryName = this.countries[index].name;
          }
        }
      });

      this.completeProfileMsgShow = JSON.parse(
        this.cookieService.get('hide_completeProfile') || 'false'
      );

      this.studentService.getStudentProfile().subscribe((profileData) => {
        let profile_completed_status = profileData.profile_completion.profile_text;
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
      message: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    })
    this.getDashboardDetail();
    this.getCurrentUserData();
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  getDashboardDetail() {
    //this.show_loader = true;
    this.studentDashboardService.getDashboardHeaderDetail().subscribe((res) => {
      this.dashboard = res;
      this.firstname = this.dashboard?.profile[0]?.name[0].toUpperCase() + this.dashboard?.profile[0]?.name.substring(1);
      this.lastname = this.dashboard?.profile[0]?.last_name[0].toUpperCase() + this.dashboard?.profile[0]?.last_name.substring(1);
      this.cityName = this.dashboard.profile[0].countryObj;
      this.stateName = this.dashboard?.profile[0]?.stateObj;
      this.countryName = this.dashboard.profile[0].cityObj;
      const str = this.dashboard?.profile[0]?.type;
      this.qualification = str.charAt(0).toUpperCase() + str.slice(1);
      this.cdr.detectChanges();
      // this.show_loader = false;
    });
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
        //this.show_loader = false;
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
      return el.image === bannerIame;
    });
  }

  over(drop:NgbDropdown){
    drop.open()
  }
  out(drop:NgbDropdown){
    drop.close()
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
        this.modalRef.hide()
        this.bannerUpload = false;
      },
      (err) => {

      },
    );
  }

  showToastrMsg(event) {
    this.toastrService.success(event, '', { timeOut: 3000 })
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
    this.showWordLimitError = false;
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    // this.modalRef.setClass("modal-width");
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
    this.modalRefContactCollegey = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
    // this.modalRefContactCollegey.setClass("modal-width");
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

  onSubmitMessage() {
    const messageTextCount = this.wordCounts(this.contactCollegeyForm.value.message, 250)
    this.submit = true;
    let obj = this.contactCollegeyForm.value;
    obj['user'] = this.userid;
    if (this.contactCollegeyForm.invalid || messageTextCount) {
      return;
    }
    this.mentorDashboardService.addContactCollegey(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.modalRefContactCollegey.hide();
        this.contactCollegeyForm.reset();
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


  // Add Testimonial
  addTestimonial() {
    const testimonalTextCount = this.wordCounts(this.testimonialFormGroup.value.testimonal, 250);
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

  public hasCollegyMsgError = (controlName: string, errorName: string) => {
    return this.contactCollegeyForm.controls[controlName].hasError(errorName);
  };
}
