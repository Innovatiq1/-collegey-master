import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,Inject,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,AbstractControl} from '@angular/forms';
import { Subscription, Observable, of,Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { MentorsProfile } from 'src/app/core/models/student-profile.model';
import { MentorService } from 'src/app/core/services/mentor.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment,timezone } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Countries, State, Cities } from 'src/app/core/models/static-data.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import {
  Dashboard,
  SignedUpProjects,
} from 'src/app/core/models/student-dashboard.model';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-mentor-profileid',
  templateUrl: './mentor-profileid.component.html',
  styleUrls: ['./mentor-profileid.component.css']
})
export class MentorProfileidComponent implements OnInit {
  officeWorkDay : any[] = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  officeFormGroup: FormGroup;
  MentorOfficeTimeZone:any;

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
  profileInfo: any;
  stateName: any;
  cityName:any;

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

  ImageUrl:any;
  bannerImage: any;
  multiple1: any = [];
  uploadProfileImage: any;
  admincarImg: any;
  @Input() mentorProfileData;
  @Input() section;
  @Output() onSubmitProfileForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();
  profileFormSubscription: Subscription;

  // Profile Step Formgroup
  mentorid:any;
  profileFormGroup: FormGroup;
  submittedProfile: boolean = false;
  msg_success: boolean      = false;
  msg_danger: boolean       = false;
  mentorVideointro:any;
  MentorProfileInfo:any;
  public getVideoIntro:any;
  mentorExperience:any = [];
  
  showotherIndustry:boolean = false;
  showotherExpertise:boolean = false;
  showotherInterest:boolean = false;

  isChecked: boolean = false;
  countryName:any;

  // Country Object 
  countries: Countries[] = JSON.parse(localStorage.getItem(AppConstants.KEY_COUNTRIES_DATA));
  states:any = [];
  cities:any = [];
  selectedCity: any;
  profileFavBooksArray:any = [];
  tab: any;
  activeTab: any;
  userInfo: any;
  MentorProfileInfoHours: any = [];

  constructor(
    @Inject(DOCUMENT) private document: any,
    private formBuilder: FormBuilder,
    private staticDataService: StaticDataService,
    private mentorService: MentorService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    public sanitizer:DomSanitizer,
    private mentorDashboardService: MentorDashboardService,
    private studentDashboardService: StudentDashboardService,
    public commonService: CommonService,
    private router: Router,
    private authService: AuthService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private clipboard: Clipboard,


  ) {
    if (this.router.url.indexOf('/blog') > -1) {
      this.isActive = true;
    }
    else
    {
      this.isActive = false;
    }
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user?.id;
    // this.userComboname = loggedInInfo?.user?.name+'-'+loggedInInfo?.user?.last_name;
    this.siteurl = environment.frontEndUrl;

    this.testimonialFormGroup = this.fb.group({
      testimonal: ['',Validators.required],
      name:[''],
      qualification:['NIL'],
      country:[''],
      url:[''],
    });
    this.bannerFor = "profile";
    this.timeZoneList = timezone;
    this.officeFormGroup = this.formBuilder.group({
      officeHours: this.formBuilder.array([]),
      timezone: ['', Validators.required],
    });
    // const loggedInInfo = this.authService.getUserInfo();
    // this.userid        = loggedInInfo?.user._id;
    this.profileFormGroup = this.formBuilder.group({ 
      fullLegalName: ['',Validators.required],
      country: ['',Validators.required],
      state: ['',Validators.required],
      city: ['',Validators.required],
      timezone: ['',Validators.required], 
      professionalTitle: ['',Validators.required],
      website: ['',Validators.required],
      experience: ['', Validators.required],
      lastEducationalInstitutionAttended: ['', Validators.required],
      lastCollegeDegree: ['', Validators.required],
      industry: ['', Validators.required],
      other_industry: [''],
      expertise: ['', Validators.required],
      other_expertise: [''],
      interest: ['', Validators.required],
      other_interest: [''],  
      can_help: ['', Validators.required],
      favBooks: ['', Validators.required],
      linkedIn: ['', Validators.required],
      aboutYou: ['', Validators.required],
      shouldAgree: [null, Validators.required],
     });
     for(let i = 1; i<= 100; i++){
       this.mentorExperience.push(i);
     }
   }

   eventCheck(event){
    if(event.target.checked){
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
}

    ngOnInit(): void {
     this.mentorid= localStorage.getItem("mentorid")
     this.fetchProfiledata();
     this.getCurrentUserData();
     this.getDashboardDetail();
      // console.log("this is mentorid",mentorid)
    }
    
    onChangeSomeTypes(event:any)
    {
      if(event.target.value == 'other_industry')
      {
        this.showotherIndustry = true;
      }
      else
      {
        this.showotherIndustry = false;
      }
      if(event.target.value == 'other_expertise')
      {
        this.showotherExpertise = true;
      }
      else
      {
        this.showotherExpertise = false;
      }
      if(event.target.value == 'other_interest')
      {
        this.showotherInterest = true;
      }
      else
      {
        this.showotherInterest = false;
      }
    }

    onSelectCountry(country) {
      this.getStateList(country.target.value,"") ;
      this.profileFormGroup.patchValue({
        state: '',
        city: '',
      });
    }

    getStateList(id,stateId) {
      this.staticDataService.getStates(id).subscribe((response) => {
          if(response){
          console.log("=========",response)
          //this.states = response;
          var result = response.filter(item =>item.id==stateId)
          this.stateName = result[0].name;
          console.log("=====result=====",result)
          }
          //this.profileFormGroup.get('state').enable();
         // this.cdr.detectChanges();
        },
        
      );
    }

    onSelectCity(city) {
      this.selectedCity = city.target.value;
    }

    getCityList(id,cityId) {
      this.staticDataService.getCities(id).subscribe(
        (response) => {
          this.cities = response;
     
        },
        (error) => {
          this.toastrService.error(error.message || 'Oops something went wrong');
        }
      );
      this.staticDataService.getCity(cityId).subscribe(
        (response) => {
          this.cities = response;
          this.cityName = response[0].name;
          //console.log("=====result=====",result)
          //console.log("dddddddddddxxxxxxddddddddd",response)
     
            
          
          
          ////var result = response.filter(item =>item.id==57588)
          //this.CityName = result[0].name;
          // this.profileFormGroup.get('city').enable();
          // this.cities.forEach(city => {
          //   if(city.id == this.profileFormGroup.get('city').value) {
          //     this.selectedCity = city.name;
          //     this.cdr.detectChanges();
          //   }
          // })
        },
        (error) => {
          this.toastrService.error(error.message || 'Oops something went wrong');
        }
      );
    }

    onSelectState(state) {
      this.getCityList(state.target.value,"");
    }
    
    removeVideoConformation(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'gray modal-lg' })
      );
    }

    removeVideo(){
      this.getVideoIntro = '';
      this.modalRef.hide();
    }

    fetchProfiledata()
    {
      var data = {id:this.mentorid}
      this.mentorService.mentorId(data).subscribe((profile) => {
        this.profileInfo = profile.data.mentor;
        this.MentorProfileInfo = profile.data.mentor.mentor_profile.profile;
        this.userComboname = this.profileInfo.name+'-'+this.profileInfo.last_name;
        this.MentorProfileInfoHours = profile.data.mentor.mentor_profile.officeHours;
        const countryId = this.MentorProfileInfo?.country;
        const stateId   = this.MentorProfileInfo?.state;
        const cityId   = this.MentorProfileInfo?.city;
        //var newArray = this.countries.filter(person=> person.id===countryId)
        let countries = this.countries
        let counties1 =countries[countryId-1]
        this.countryName= counties1.name
        //var newArraydd = countries.filter(person=> person.id===countryId)
        this.getVideoIntro     = this.MentorProfileInfo?.videoIntroduction;
        // if(this.MentorProfileInfo.length <= 0)
        // {
        //   this.createReminder();
        // }
        // else
        // {
        //   this.editReminder(); 
        // }

        const countryId11 = this.MentorProfileInfo?.country;
        const stateId1   = this.MentorProfileInfo?.state;
        if (stateId&&cityId) {
          this.getCityList(stateId,cityId);
        }
        if (countryId&&stateId) {
            this.getStateList(countryId,stateId);
                    } 

                   // console.log("ddddddddddddddddddstates",this.states)

        



        


        
      });
    }
    addOfficeHours(dayget:any) {
      let officeArray = this.formBuilder.group({
        days: [dayget, Validators.required],
        start_time: ['', Validators.required],
        end_time: ['', Validators.required],
        closed: [false, Validators.required],
      })
      this.officeHours.push(officeArray);
    }

    createReminder() {
      for(let i = 0; i< this.officeWorkDay.length; i++){
        let daysAdd = this.officeWorkDay[i];
        this.addOfficeHours(daysAdd);
      }
    }
    editReminder() {
      this.officeFormGroup.patchValue({
         timezone: this.MentorOfficeTimeZone
      });
     for(let i = 0; i < this.officeWorkDay.length; i++){
         let officeArray = this.formBuilder.group({
           days: [this.MentorProfileInfo[i].days, Validators.required],
           start_time: [this.MentorProfileInfo[i].start_time, Validators.required],
           end_time: [this.MentorProfileInfo[i].end_time, Validators.required],
           closed: [this.MentorProfileInfo[i].closed == 'false' ? false : true, Validators.required],
         }) 
         this.officeHours.push(officeArray);
       }
 
     }
     get officeHours() : FormArray {
      return this.officeFormGroup.get("officeHours") as FormArray
    }
    onSubmitForm(exit) {
      this.submittedProfile = true;
      this.profileFavBooksArray = [];
      let obj = this.profileFormGroup.value;
      obj['user'] = this.userid;
      obj['mentorVideointro'] = this.mentorVideointro; 
      
      for(let i = 0; i< obj.favBooks.length; i++){
        if(obj.favBooks[i].value)
        {
          this.profileFavBooksArray.push(obj.favBooks[i].value);
        }
        else
        { 
          this.profileFavBooksArray.push(obj.favBooks[i]);
        }
      }

      if (this.profileFormGroup.invalid || !this.profileFormGroup.get('shouldAgree').value){
        return; 
      }
      obj['favBooks'] = this.profileFavBooksArray;
    
      this.mentorService.updateMentorProfileStep01(obj).subscribe(
        (response) => {
          this.toastrService.success(response.message);
          this.profileFormGroup.reset();
          this.submittedProfile = false;
          this.fetchProfiledata();
          if(exit == true)
          {
            this.commonService.subscribProfileForm.next('office-step');
          } 
        },
        (err) => {
          this.toastrService.error('profile not update');
          this.submittedProfile = false;
        },
      );     
    }

    uploadFileApi(file) {
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('files', file);
        this.http.post(environment.apiEndpointNew+'public/uploadFile', formData)
          .subscribe((res: any) => {
            resolve(res.url);
          }, (err => {
            reject(err);
          }))
      })
    }
  
    uploadRecordVideo(event) {
      if (event.target.files[0].size/1024/1024 > 50) {
        this.toastrService.error('The file is too large. Allowed maximum size is 50 MB.');
        return;
      }
      if(event.target.files[0].type != 'video/mp4')
      {
        this.toastrService.error('Allowed only Mp4 & Allowed maximum size is 50 MB');
        return;
      }
      this.uploadFileApi(event.target.files[0]).then((data) => {
         this.mentorVideointro = data;
       }).catch((err) => {
         this.toastrService.error('Video upload faild');
       })
     }
     getDashboardDetail() {    
      //this.show_loader = true;
      this.studentDashboardService.getDashboardHeaderDetail().subscribe((res) => {
        this.dashboard = res; 
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
    goToLink(url: string){
      var url1 = url+this.siteurl+'mentor-profile/'+this.mentorid+'/'+this.userComboname
      //console.log("==========",url1)
      window.open(url1, "_blank");
  }
  goToLinkedin(url: string){
    var url1 = url+this.siteurl+'mentor-profile/'+this.mentorid+'/'+this.userComboname
    //console.log("==========",url1)
    window.open(url1, "_blank");
  }
  
  goToTwit(url: string){
    var url1 = url+this.siteurl+'mentor-profile/'+this.mentorid+'/'+this.userComboname
    //console.log("==========",url1)
    window.open(url1, "_blank");
  }
  
  CopyClipboardUrl() {
    var currentUrl = this.siteurl+'mentor-profile/'+this.mentorid+'/'+this.userComboname;
    this.clipboard.copy(currentUrl);
    this.toastrService.success('Link Copied To Clipboard');
  }
  
    getCurrentUserData()
    {
      const obj = {
        userid: this.mentorid,
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
        this.files.push(...event.addedFiles);
  
      }
      else
      {
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
          this.toastrService.success(response.message);
          this.getCurrentUserData();
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
      console.log('image :', this.bannerImage);
      if (multipleFiles) {
        for (var file of multipleFiles) {
          var multipleReader = new FileReader();
          multipleReader.onload = (e: any) => {
            this.admincarImg = e.target.result;
          };
          multipleReader.readAsDataURL(file);
        }
      }
      console.log("bannerImage:", this.bannerImage);
      let data = new FormData();
      data.append("file", this.bannerImage);
      this.studentDashboardService
        .uploadBanner(data)
        .subscribe((res: any) => {
          this.ImageUrl = res.data.data.fileUrl;
          console.log('ImageUrl:', this.ImageUrl);
          //this.settingToLocal();
        });
    }

    hideCompleteProfile(){
      this.showCompleteProfile = false;
    }
  
    msgcollegey(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true}));
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
      console.log("addTestimonial reqData :", obj); 
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