import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { HttpClient } from '@angular/common/http';
import { StudentProjects } from 'src/app/core/models/student-profile.model';
import { CommonService } from 'src/app/core/services/common.service';
import { MentorService } from 'src/app/core/services/mentor.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-students-project',
  templateUrl: './students-project.component.html',
  styleUrls: ['./students-project.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentsProjectComponent implements OnInit {

  @Input() mentorProfileData;
  @Input() section;
  options;
  isCharheStudent: number = -1;
  @Output() onSubmitProjectForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();
  projectFormSubscription: Subscription;
  projectBannerImage: any;

  // Profile Step Formgroup
  projectFormGroup: FormGroup;
  submittedProfile: boolean = false;
  msg_success: boolean = false;
  msg_danger: boolean = false;
  userid: any;
  userName: any;
  userEmail: any;
  userMnumber: any;
  projectFees: any;
  projectWeeklength: any = [1, 2, 3, 4];
  sdg_selection: any = [];
  monthDurationActive: boolean = false;
  chargesStudentvalidation: boolean = false;

  //Student Project form

  bannerImages: any = [];
  bannerFor: String;

  rangeValue: any;

  // Mentor Project SDG
  dropdownSettingsProjectSdg = {};
  projectKeywordArray: any = [];

  // Set Last date and start date
  projectStartDate: any;
  projectSetLastDate: any;
  ProjectSetLastMaxiDate: any;

  @ViewChild('takeInput', { static: false })

  // this InputVar is a reference to our input.

  InputVar: ElementRef;

  wordCount: any;
  words: any;
  //show word limit
  showWordLimitError: Boolean = false;
  showWordLimitMilestoneError: Boolean = false;

  fetchcurrentImageheight: any;
  fetchcurrentImagewight: any;
  projectFeedData:any;
  projectIsPayable:any = 1;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private staticDataService: StaticDataService,
    private mentorService: MentorService,
    private cdr: ChangeDetectorRef,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private projectService: ProjectService,
    private datePipe: DatePipe
  ) {
    this.bannerFor = "mentor";
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user._id;
    this.userName = loggedInInfo?.user.name;
    this.userEmail = loggedInInfo?.user.email;
    this.userMnumber = loggedInInfo?.user.phone_number;

    this.projectFormGroup = this.formBuilder.group({
      projectTitle: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      keyword: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      lastDate: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      startDate: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      minNumberOfStudentsAllowed: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/), Validators.min(3)]],
      maxNumberOfStudentsAllowed: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/), Validators.max(15)]],
      projectUNSDG: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      aboutProject: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      projectDuration: ['4', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      week1Duration: [''],
      week2Duration: [''],
      week3Duration: [''],
      week4Duration: [''],
      week5Duration: [''],
      week6Duration: [''],
      monthDuration: [''],
      range_price: [185],
      isPaid: [''],
    });
    this.sdg_selection = [
      'Goal 1 - No Poverty',
      'Goal 2 - Zero Hunger',
      'Goal 3 - Good Health and Well-being',
      'Goal 4 - Quality Education',
      'Goal 5 - Gender Equality',
      'Goal 6 - Clean Water and Sanitation',
      'Goal 7 - Affordable and Clean Energy',
      'Goal 8 - Decent Work and Economic Growth',
      'Goal 9 - Industry, Innovation and Infrastructure',
      'Goal 10 - Reduced Inequality',
      'Goal 11 - Sustainable Cities and Communities',
      'Goal 12 - Responsible Consumption and Production',
      'Goal 13 - Climate Action',
      'Goal 14 - Life Below Water',
      'Goal 15 - Life on Land',
      'Goal 16 - Peace and Justice Strong Institutions',
      'Goal 17 - Partnerships to achieve the Goal'
    ];

    this.dropdownSettingsProjectSdg = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      limitSelection: 2
    };
    this.isCharheStudent = 0;

    var myDateSet = new Date(new Date());
    var projStartDate = new Date(); 
    projStartDate.setDate(myDateSet.getDate()+28);
    var newprojStartDateSet = this.datePipe.transform(projStartDate, 'yyyy-MM-dd');
    this.projectStartDate = newprojStartDateSet;

    var deadlineDate = new Date();
    deadlineDate.setDate(myDateSet.getDate());
    var startDeadlineDateSet = this.datePipe.transform(deadlineDate, 'yyyy-MM-dd');
    this.ProjectSetLastMaxiDate = startDeadlineDateSet;
    // var myDateSet = new Date();
    // var newDateSet = this.datePipe.transform(myDateSet, 'yyyy-MM-dd');
    // this.projectStartDate = newDateSet;
    // this.projectSetLastDate = newDateSet;
  }

  ngOnInit(): void {
    this.getBanners();
    this.getProjectFeesData();
  }

  getProjectFeesData() { 
    const obj = {
      fees_type: 'mentor',
    };
    this.projectService.getProjectFeesData(obj).subscribe(
      (response) => {
        this.projectFeedData = response?.data;
        this.rangeValue = this.projectFeedData?.default_price;
      },
      (err) => {

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

  wordCounterMilestone(event) {
    if (event.keyCode != 32) {
      this.wordCount = event.target.value ? event.target.value.split(/\s+/) : 0;
      this.words = this.wordCount ? this.wordCount.length : 0;
    }

    if (this.words > 250) {
      this.showWordLimitMilestoneError = true;
    } else {
      this.showWordLimitMilestoneError = false;
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


  onChangeProjectStart(event) {
    // var myCurrentDate = new Date(event.target.value);
    // myCurrentDate.setDate(myCurrentDate.getDate() - 1);
    // var newPlusDate = this.datePipe.transform(myCurrentDate, 'yyyy-MM-dd');
    // this.projectSetLastDate = newPlusDate;

    // Set Maximum Date
    // var myDateSet1 = new Date();
    // myDateSet1.setDate(myDateSet1.getDate() + 1);
    // var newDateSet1 = this.datePipe.transform(myDateSet1, 'yyyy-MM-dd');
    // this.ProjectSetLastMaxiDate = newDateSet1;

    var myCurrentDate = new Date(event.target.value);
    var endDeadlineDate = new Date(this.projectFormGroup.get('startDate').value);
    endDeadlineDate.setDate(myCurrentDate.getDate()-1);
    //console.log("=========endateLine",endDeadlineDate)
    
    var endDeadlineDateSet = this.datePipe.transform(endDeadlineDate, 'yyyy-MM-dd');
    //console.log("=======endDeadlineDateSet==",endDeadlineDateSet)
    this.projectSetLastDate = endDeadlineDateSet;
    
    this.projectFormGroup.patchValue({
      lastDate: this.projectSetLastDate,
    });
    // this.projectFormGroup.patchValue({
    //   lastDate: this.ProjectSetLastMaxiDate,
    // });
    
  }

  getBanners() {
    const obj = {
      bannerFor: this.bannerFor,
    };
    this.projectService.getBanners(obj).subscribe(
      (response) => {
        this.bannerImages = response.data;
        // console.log("BannerImages==>", this.bannerImages)
      },
      (err) => {

      },
    );
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.projectFormGroup.controls[controlName].hasError(errorName);
  };


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

  changeProjectduration(event) {
    this.projectWeeklength = [];
    if (event.target.value == '3 month' || event.target.value == '4 month' || event.target.value == '5 month' || event.target.value == '6 month' || event.target.value == '7 month' || event.target.value == '8 month' || event.target.value == '9 month') {
      this.monthDurationActive = true;
    }
    else {
      for (let f = 1; f <= event.target.value; f++) {
        this.projectWeeklength.push(f);
      }
      this.monthDurationActive = false;
    }
  }

  bannerUpload(event) {
    var file = event.target.files;
    if (file[0].type == 'image/jpeg' || file[0].type == 'image/png' || file[0].type == 'image/jpg') {
      if (event.target.files[0].size / 1024 / 1024 > 10) {
        this.toastrService.error('The file is too large. Allowed maximum size is 10 MB.');
        return;
      }

      var _URL = window.URL || window.webkitURL;
      var fileMatch, imgesData;

      if ((fileMatch = event.target.files[0])) {
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
          this.uploadFileApi(event.target.files[0]).then((data) => {
            this.projectBannerImage = data;
            this.cdr.detectChanges();
          }).catch((err) => {
            this.toastrService.error('Image upload faild');
          })
        }
        else {
          this.toastrService.error('The maximum size for the 220 X 230');
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

  removeProjectBanner() {
    this.projectBannerImage = '';
  }

  updateProfile() {
    throw new Error('Method not implemented.');
  }

  priceChange(event) {
    this.rangeValue = event.target.value;
  }

  onSubmitForm(exit) {
    // submit form
    this.submittedProfile = true;
    this.projectKeywordArray = [];
    if (!this.projectBannerImage) {
      this.projectBannerImage = this.bannerImages[0].imagePath;
    }
  
    let obj = this.projectFormGroup.value;
    obj['user_id'] = this.userid;
    obj['project_img'] = this.projectBannerImage;
    obj['username'] = this.userName;
    obj['useremail'] = this.userEmail;
    obj['userphone'] = this.userMnumber;
    obj['projectIsPayable'] = this.projectIsPayable;
    if (this.projectFormGroup.value.range_price == 0) {
      obj['projectfess'] = this.projectFees;
    }
    else {
      obj['projectfess'] = this.rangeValue;
    }

    for (let i = 0; i < obj.keyword.length; i++) {
      this.projectKeywordArray.push(obj.keyword[i].value);
    }

    if (this.monthDurationActive) {
      const aProjectDescriptionCount = this.wordCounts(this.projectFormGroup.value.monthDuration, 250);
      if (aProjectDescriptionCount) {
        return;
      }
    }

    const aboutProjectCount = this.wordCounts(this.projectFormGroup.value.aboutProject, 250);

    if (this.projectFormGroup.invalid || aboutProjectCount) {
      return;
    }
    obj['keyword'] = this.projectKeywordArray;
    //console.log("======obj===",obj)
    this.mentorService.updateMentorProfileStep03(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message, null, { timeOut: 90000 });
        this.projectFormGroup.reset();
        this.submittedProfile = false;
        this.router.navigateByUrl('mentors/dashboard');
      },
      (err) => {
        this.toastrService.error('project not update');
        this.submittedProfile = false;
      },
    );
  }

  selectImage(image) {
    if (image) {
      this.projectBannerImage = image.imagePath;
    } else {
      this.projectBannerImage = this.bannerImages[0];
    }
  }

  onFormBack() {
    const formData = this.projectFormGroup.getRawValue();
    this.onBackForm.emit(formData);
    this.commonService.subscribProfileForm.next('office-step');
  }


  // ngOnDestroy(): void {
  //   this.projectFormSubscription.unsubscribe();
  // }


  clickRadio(event) {
    if (event.target.value == 1) {
      this.isCharheStudent = 1;
      this.projectFormGroup.value.range_price = this.projectFeedData?.default_price;
      this.projectFees = 0;
      this.projectIsPayable = 1;
    } else if (event.target.value == 0) {
      this.isCharheStudent = 0;
      this.projectFees = 185;
      this.projectFormGroup.value.range_price = this.projectFeedData?.default_price;
      this.projectIsPayable = 1;
    } else {
      this.isCharheStudent = -1
    }
  }

}
