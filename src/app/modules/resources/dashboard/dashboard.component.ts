import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { environment } from 'src/environments/environment';
import {
  Dashboard,
  SignedUpProjects,
} from 'src/app/core/models/student-dashboard.model';
import { Router } from '@angular/router';

// Modal Services and Extra library Services
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';

// Load Services
import { ProjectService } from '../../../core/services/project.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboard: Dashboard = new Dashboard();
  showCompleteProfile: boolean=true;
  isActive: boolean = false;
  userid:any;
  userComboname:any;  
  siteurl:any;  

  // Dahboard Banner Data Assign
  bannerFor: String;
  bannerImages: any = [];
  listdafaultBanner: any = [];

  // Banner Files Data
  files: File[] = [];
  AllbannerImage: any = [];
  timeZoneList: any;
  CurrentBanner: any;

  // Load Model Ref
  modalRef: BsModalRef;

  // Testimonial
  testimonialFormGroup:FormGroup;
  submittedTestimonial: boolean = false;
  show_loader: boolean = false;

  modalRefContactCollegey: BsModalRef;
  submit: Boolean = false;
  contactCollegeyForm: FormGroup;

  ImageUrl:any;
  bannerImage: any;
  multiple1: any = [];
  uploadProfileImage: any;
  admincarImg: any;

  fetchcurrentImageheight:any;
  fetchcurrentImagewight: any;

  qualification:any
  
  constructor(
    private studentDashboardService: StudentDashboardService,
    public commonService: CommonService,
    private router: Router,
    private authService: AuthService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private clipboard: Clipboard,
    private mentorDashboardService: MentorDashboardService,
  )
  { 
    if (this.router.url.indexOf('/blog') > -1) {
      this.isActive = true;
    }
    else
    {
      this.isActive = false;
    }
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user?.id;
    this.userComboname = loggedInInfo?.user?.name+'-'+loggedInInfo?.user?.last_name;
    this.siteurl = environment.frontEndUrl;

    this.testimonialFormGroup = this.fb.group({
      testimonal: ['',Validators.required],
      name:[''],
      qualification:['NIL'],
      country:[''],
      url:[''],
    });
    this.bannerFor = "profile";
  }

  ngOnInit(): void {
    this.getDashboardDetail();
    this.getCurrentUserData();
    this.contactCollegeyForm = this.fb.group({
      message: ['', Validators.required],
    })
  }

  getDashboardDetail() {    
    //this.show_loader = true;
    this.studentDashboardService.getDashboardHeaderDetail().subscribe((res) => {
      this.dashboard = res; 
      console.log('dashboard',this.dashboard);
      const str = this.dashboard?.profile[0]?.type;
      this.qualification = str.charAt(0).toUpperCase() + str.slice(1);
      console.log('qualification',this.qualification);
      
    // this.show_loader = false;
    });
  }

  
  contactCollegey(template: TemplateRef<any>) {
    // if (check == 10) { 
    //   this.tab = 'tab10';
    // }
    // if (check == 11) { 
    //   this.tab = 'tab11';
    // }
    // this.onReset(2);
    this.modalRefContactCollegey = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
    this.modalRefContactCollegey.setClass("modal-width");
  }

  onSubmitMessage() {
    this.submit = true;
    let obj = this.contactCollegeyForm.value;
    obj['user'] = this.userid;
    if (this.contactCollegeyForm.invalid) {
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

  get g() { return this.contactCollegeyForm.controls; }

  // Add Top Banner Popup 

  openAddBannerDialog(template: TemplateRef<any>) {
    this.getBanners();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  goToLink(url: string){
    var url1 = url+this.siteurl+'profile/'+this.userid+'/'+this.userComboname
    //console.log("==========",url1)
    window.open(url1, "_blank");
  }
  goToLinkedin(url: string){
    var url1 = url+this.siteurl+'profile/'+this.userid+'/'+this.userComboname
    //console.log("==========",url1)
    window.open(url1, "_blank");
  }
  goToTwit(url: string){
    var url1 = url+this.siteurl+'profile/'+this.userid+'/'+this.userComboname
    //console.log("==========",url1)
    window.open(url1, "_blank");
  }

  CopyClipboardUrl() { 
    var currentUrl = this.siteurl+'profile/'+this.userid+'/'+this.userComboname;
    this.clipboard.copy(currentUrl);
    this.toastrService.success('Link Copied To Clipboard');
  }

  getCurrentUserData()
  {
    const obj = {
      userid: this.userid,
    };
    //this.show_loader = true;
    this.AllbannerImage = [];
    this.studentDashboardService.getCurrentUserDataFetch(obj).subscribe(
      (response) => { 
        this.CurrentBanner  = response?.data.bannerImage;
        for(let i = 0; i < response?.data?.AllbannerImage?.length; i++) {
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
        for(let i = 0; i < this.bannerImages.length; i++) {
          let checkExistingBanner = this.bannerExists(this.bannerImages[i].imagePath);
          
          if(checkExistingBanner == false)
          {
            this.listdafaultBanner.push(this.bannerImages[i]);
          }
        }

      },
      (err) => {
        
      },
    );
  }

  bannerExists(bannerIame) {
    return this.AllbannerImage.some(function(el) {
      return el.image === bannerIame;
    }); 
  }

  onSelectBanner(event) {
    if(event.addedFiles[0].type == 'image/jpeg' || event.addedFiles[0].type == 'image/png' || event.addedFiles[0].type == 'image/jpg')
    {
      var _URL = window.URL || window.webkitURL;
      var fileMatch, imgesData;

      if ((fileMatch = event.addedFiles[0])) {
        imgesData = new Image();
        var objectUrl = _URL.createObjectURL(fileMatch);
        imgesData.onload = function () {
            var currentWidth  = this.width;
            var currentHeight = this.height;
            window.localStorage.setItem('currentImageheight', currentHeight);
            window.localStorage.setItem('currentImagewight', currentWidth);
            _URL.revokeObjectURL(objectUrl);
        };
        imgesData.src = objectUrl;
      }

      setTimeout(() => {
        this.fetchcurrentImageheight = localStorage.getItem('currentImageheight');
        this.fetchcurrentImagewight  = localStorage.getItem('currentImagewight');
        if(this.fetchcurrentImagewight <= 2000 && this.fetchcurrentImageheight <= 2000)
        {
          this.files.push(...event.addedFiles);
        }
        else
        {
          this.toastrService.error('The maximum size for the 1200 x 190');
          localStorage.removeItem('currentImageheight');
          localStorage.removeItem('currentImagewight');
          return;
        }
      }, 1000);

      
    }
    else
    {
      this.toastrService.error('Allow only .png, .jpeg, .jpg this file');
      return;
    }
  }

  over(drop:NgbDropdown){
    drop.open()
  }
  out(drop:NgbDropdown){
    drop.close()
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
          this.files = [];
          this.toastrService.success(response.message);
          this.getCurrentUserData();
          this.getBanners();
        },
        (err) => {
  
        },
      );
    } else {
      this.toastrService.error('Please upload a File! & upload only .png, .jpeg, .jpg'); 
    }
  }

  choiceUserBannerImage(bannerIndex: any,choiceBanner: any,defaultBannerId:any) {
    const obj = { 
      userid: this.userid,
      bannerIndex: bannerIndex,
      choiceBanner: choiceBanner,
      defaultBannerId: defaultBannerId
    };
    this.studentDashboardService.choiceUserBannerImage(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message, "", {timeOut: 4000});
        this.getCurrentUserData();
        this.getBanners();
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

  hideCompleteProfile(){
    this.showCompleteProfile = false;
  }

  msgcollegey(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'gray modal-lg' }));
    //this.modalRef.setClass("modal-width");
  }

  // Add Testimonial

  addTestimonial()
  {
    let profile =  this.dashboard?.profile;
    let cityName = profile?.cityObj.name;
    let countryName = profile?.countryObj?.name;
    let fName = profile.name;
    let lname = profile.last_name; 
    if(!fName){
      return;
    }
    this.submittedTestimonial = true;
    let obj = this.testimonialFormGroup.value;
    obj['user'] = this.userid;
    obj['name'] = fName+" "+lname; 
    obj['country'] = cityName+", "+countryName;    
    if(obj['url']){
      obj['type'] = 'text url';
    }else{
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
  
}
