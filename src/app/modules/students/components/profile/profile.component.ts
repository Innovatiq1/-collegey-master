import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { StudentService } from 'src/app/core/services/student.service';
import { Observable, Subscription } from 'rxjs';
import {
  Profile,
  StudentProfile,
} from 'src/app/core/models/student-profile.model';
import { Utils } from 'src/app/shared/Utils';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProfileStatus } from 'src/app/core/models/student-dashboard.model';
import { StudentProfileStatusText } from 'src/app/core/enums/student-profile-status-text.enum';
import { ConfigService } from 'src/app/core/services/config.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { User } from 'src/app/core/models/user.model';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileComponent implements OnInit, OnDestroy {
  studentProfileData: StudentProfile;
  onBoardingSteps: ProfileStatus;
  progressBarValue = 0;
  profileText:string = "Beginner";
  isLoading: boolean;
  isSticky: boolean;
  boxScroll: string;
  eduStep: any;
  onConfigChanged: Subscription;
  profileCompletedSubscription: Subscription;
  document: any;

  user: User = JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA)).user;

  isProfileCompletedModalShown = false;
  @ViewChild('profileCompletedModal', { static: false })
  profileCompletedModal: ModalDirective;
  sections : any[] = [{name:"geography",isOpen:false},{name:"history_updated",isOpen:false},{name:"interest",isOpen:false},{name:"know_you_better",isOpen:false},{name:"projects",isOpen:false},{name:"headed",isOpen:false},{name:"prefrences",isOpen:false},{name:"ways_to_be_in_touch",isOpen:false}]
  currentSection : any = {name:"geography",isOpen:false}; 
  resData : any;

  constructor(
    private studentService: StudentService,
    private toastrService: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public configService: ConfigService,
    private el: ElementRef,
    private studentDashboardService: StudentDashboardService,
    private commonService : CommonService,
    private authService: AuthService,
  )
  { 
    
  }

  submitStudentProfile(profileData, sectionReference = null) {  
    let formData: any = {};
    formData.student_profile = Object.assign({}, profileData);
    formData = Utils.removeNullFields(formData);
    this.studentService.saveStudentProfile(formData).subscribe(
      (profile) => {
        if (profile) {
          this.studentProfileData = profile;
                    this.calculateProfileProgress(
            profile.profile_completion.profile_text
          );
          this.toastrService.success('Profile Updated');
        
          if(formData.student_profile?.projects?.redirectAction == false)
          {
            return false;
          }
          else if(formData.student_profile?.geography?.redirectAction == false)
          {
            // console.log("failed")
            return false;
          }
          else if(formData.student_profile?.history_updated?.redirectAction == false)
          {
            return false;
          }
          else if(formData.student_profile?.interest?.redirectAction == false)
          {
            return false;
          }
          else if(formData.student_profile?.know_you_better?.redirectAction == false)
          {
            return false;
          }
          else if(formData.student_profile?.headed?.redirectAction == false)
          {
            return false;
          }
          else if(formData.student_profile?.prefrences?.redirectAction == false)
          {
            return false;
          }
          else if(formData.student_profile?.ways_to_be_in_touch?.redirectAction == false)
          {
            return false;
          } 
          else
          {
            // console.log('sectionReference==>', sectionReference);
            // console.log('formData?.ways_to_be_in_touch?.redirectAction==>', formData?.student_profile?.ways_to_be_in_touch?.redirectAction);
            
            if (sectionReference == 'ways_to_be_in_touch' && formData?.student_profile?.ways_to_be_in_touch?.redirectAction) {
                this.router.navigateByUrl('/student-dashboard/$/profile');           
            } else {
              this.setProfileStepsStatus(profile.profile_completion.profile_status);
              this.navigatingToDashboard(); // in case of user click save and exit button
              this.openNextAccordionOnSubmit(sectionReference);
            }


          }
          // this.scrollToElement();
          window.scroll(0, 500);
        }
      },
      (error) => {
        this.toastrService.error(
          error.message || 'Unable to proceed. Please try after some time'
        );
      }
    );
  }

  onBack(profileData, sectionReference = null) {
    for(let i in this.sections){
        this.sections[i].isOpen = false;
    }
    if (sectionReference) {
      for(let i in this.sections){
        // console.log("Checking",this.sections[i].name,sectionReference)
        if(this.sections[i].name === sectionReference && parseInt(i)!==0){
          this.sections[parseInt(i)-1].isOpen = true;
          this.currentSection = this.sections[parseInt(i)-1];
          break;
        }
      }
    } else {
      // this.checkIsProfileCompleted(sectionReference);
    }
    window.scroll(0, 500);
    // console.log("Current Section",this.currentSection)
  }

  openNextAccordionOnSubmit(sectionReference) {
    //console.log("Open Next",sectionReference);
    for(let i in this.sections){
        this.sections[i].isOpen = false;
    }

    if (sectionReference) {
      for(let i in this.sections){
       // console.log("Checking",this.sections[i].name,sectionReference)
        if(this.sections[i].name === sectionReference){
          this.sections[parseInt(i)+1].isOpen = true;
          this.currentSection = this.sections[parseInt(i)+1];
          break;
        }
        if(sectionReference == 'ways_to_be_in_touch'){
          if(this.currentSection?.name == this.sections[i].name){
            this.sections[i].isOpen = true;
          // console.log( this.currentSection)


          }
        } 
      }
    } else {
      // this.checkIsProfileCompleted(sectionReference);
    }
    // console.log("Current Section",this.currentSection)
  }

  checkIsProfileCompleted(accordionReference) {
    let isProfileCompleted = false;
    this.profileCompletedSubscription = this.studentService.isProfileCompleted$.subscribe(
      (response) => {
        if (response) {
          isProfileCompleted = response?.profile_completion.profile_completed;
          this.cdr.detectChanges();
        }
      }
    );

    // trigger profile completed modal after submit personal detail step
    // accordionReference = null in case of personal detail
    if (isProfileCompleted && !accordionReference) {
      this.isProfileCompletedModalShown = true;
    } else {
      this.isProfileCompletedModalShown = false;
      this.router.navigateByUrl('student/dashboard');
    }
  }

  navigatingToDashboard() {
    this.profileCompletedSubscription =  this.studentService.wishToExit$.subscribe((exit) => {
      if (exit) {
        // this.router.navigateByUrl('student-dashboard');
        // console.log("exit")
      }
    });
  }

  /**
   * Scroll to next openAccordion
   */
  scrollToElement() {
    const currentAccordion = this.el.nativeElement.querySelector('.panel-open');

    if (currentAccordion) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: currentAccordion.getBoundingClientRect().top + window.scrollY + 75,
      });
    }
  }

  setProfileStepsStatus(steps: ProfileStatus) {
    
    this.onBoardingSteps = steps;
    if(Object.keys(steps).length > 0){
      let keys = Object.keys(steps);
     // console.log("Keys",keys)
     this.eduStep = localStorage.getItem('step')
     if (this.eduStep == 'education') {
       this.currentSection = this.sections[1]
       this.sections[1].isOpen = true;
     } else {
       this.currentSection = this.sections[0]
       this.sections[0].isOpen = true;
     }

      // for(let j in this.sections){
      //     this.sections[j].isOpen =!steps[this.sections[j].name] ;
      //    // console.log("Run",steps[this.sections[j].name]);
      //     if(!steps[this.sections[j].name]){
            
      //       this.currentSection = this.sections[j]
      //       //console.log(this.currentSection)
      //       break;
      //     } else {
      //         this.eduStep = localStorage.getItem('step')
      //         if (this.eduStep == 'education') {
      //           this.currentSection = this.sections[1]
      //           this.sections[1].isOpen = true;
      //         } else {
      //           this.currentSection = this.sections[0]
      //           this.sections[0].isOpen = true;
      //         }

              
      //     }
      // }
    }
    // console.log("My Sections",this.sections)
  }

  onActivate(event) {
    // console.log("interwardasds");
    
    window.scroll(0,0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
    
}

  calculateProfileProgress(statusText) {
   // console.log("statusText : ", statusText);
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

  createDefaultInitialProfile (): StudentProfile {
    let studentProfile : StudentProfile;
      studentProfile = {
        student_profile:{
          geography:null,
          history:null,
          history_updated: null,
          ways_to_be_in_touch: null,
          headed: null,
          interest: null,
          know_you_better: null,
          prefrences: null,
          projects: null
        },
        profile_completion:{
          profile_completed: false,
          profile_percentage: 0,
          profile_text: "Beginner",
          profile_status: new ProfileStatus()
        }
      }
    return studentProfile;
  }

  ngOnInit(): void {

    // get student profile data and store data in observable
    this.configService.updateConfig({
      headerClass: 'transparent-header',
      blueLogo: false
    });

    this.studentService.getStudentProfile().subscribe((profileData) => {
        let profile = profileData;
        let educationArray = profile?.student_profile?.history_updated?.education;

        for (let i = 0; i < educationArray?.length; i++)
        {
          let collegegradeArray = educationArray[i]?.collegegrade;
          let gradeArray = educationArray[i]?.grade;
          collegegradeArray?.sort(function (a, b) {
            var keyA = b["stdyear"],
            keyB = a["stdyear"];
            
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

          gradeArray?.sort(function (a, b) {
            var keyC = b["name"],
            keyE = a["name"];
            
            if (keyC < keyE) return -1;
            if (keyC > keyE) return 1;
            return 0;
          });

        }
          
        this.studentProfileData = this.createDefaultInitialProfile()
        this.cdr.detectChanges();
        if (Object.keys(profile).length > 1) {
          this.studentProfileData = profile;
          if(profile.profile_completion){
            this.progressBarValue = profile.profile_completion?.profile_percentage;
            this.profileText = profile.profile_completion?.profile_text;
            this.setProfileStepsStatus(profile.profile_completion?.profile_status);
            this.calculateProfileProgress(profile.profile_completion?.profile_text);
          }
        }
        else {
          this.sections[0].isOpen = true;
        }

        let sectionBooleanA = [];
        let sectionBooleanB = [];

        this.sections.forEach((element, index) => { 
          if(index < 4){
            sectionBooleanA.push(element.isOpen);
          }else if(index > 3){
            sectionBooleanB.push(element.isOpen);
          }else{

          }
        });
     
        let checker = arr => arr.every(v => v === false);
        
        // Add Reward point

        if(profileData?.profile_completion.profile_status?.geography == true && profileData?.profile_completion.profile_status?.history_updated == true && profileData?.profile_completion.profile_status?.interest == true && profileData?.profile_completion.profile_status?.know_you_better == true)
        {
            let checkData = {
                "user_id": this.user?._id,
                "rewardName" : "Profile Step Location,Education,Interests,Favorites"
            }; 
            this.studentService.checkRewardPoints(checkData).subscribe((res) => { 
              this.resData = res;
              if(this.resData.data === 0){
                let rewObj = {
                  "user_id": this.user?._id,
                  "rewardName" : "Profile Step Location,Education,Interests,Favorites",
                  "rewardCreditPoint":"100",
                }
                this.studentService.updateProfileRewardPoints(rewObj).subscribe(
                  (response) => {
                    var loggedInInfo = this.authService.getUserInfo();
                    var userInfo = loggedInInfo.user;                    
                    this.toastrService.info("Congratulations! 100 Reward Point.");
                    this.authService.setReward( userInfo?._id);
                  },
                  (err) => {
                    
                  },
                );
              }
            });
        }

        if(profileData?.profile_completion.profile_status?.projects == true && profileData?.profile_completion.profile_status?.headed == true && profileData?.profile_completion.profile_status?.prefrences == true && profileData?.profile_completion.profile_status?.ways_to_be_in_touch == true)
        {
            let checkData = {
              "user_id": this.user?._id,
              "rewardName" : "Profile Step Project & Accomplishments,Future Education Plans,Education Preferences,Personal"
            };
            this.studentService.checkRewardPoints(checkData).subscribe((res) => { 
              this.resData = res;
              if(this.resData.data === 0){
                let rewObj = {
                  "user_id": this.user?._id,
                  "rewardName" : "Profile Step Project & Accomplishments,Future Education Plans,Education Preferences,Personal",
                  "rewardCreditPoint":"150",
                }
                this.studentService.updateProfileRewardPoints(rewObj).subscribe(
                  (response) => {
                    var loggedInInfo = this.authService.getUserInfo();
                    var userInfo = loggedInInfo.user; 
                    this.toastrService.info("Congratulations! 150 Reward Point.");
                    this.authService.setReward( userInfo?._id);
                  },
                  (err) => {
                    
                  },
                );
              }
            }); 
        }
        
        // if(checker(sectionBooleanA) === true){
        //   let checkData = {
        //     "user_id": this.user?._id,
        //     "rewardName" : "ProfilePartA"
        //   }; 
        //   this.studentService.checkRewardPoints(checkData).subscribe((res) => { 
        //     this.resData = res;
        //     if(this.resData.data === 0){
        //       let creditRewardPoint = {
        //         "user_id": this.user?._id,
        //         "rewardName" : "ProfilePartA",
        //         "rewardCreditPoint":"100",
        //         "uniqueId" : ""
        //       };
        //       //console.log("creditRewardPoint : ", creditRewardPoint);
        //       this.studentService.createCreditRewardPoint(creditRewardPoint).subscribe((result) => { 
        //        // console.log("reward points credited : ",result);
        //       });
        //     }
        //   });

        // }else{
          
        //   let checkData = {
        //     "user_id": this.user?._id,
        //     "rewardName" : "ProfilePartA"
        //   }; 
        //   this.studentService.checkRewardPoints(checkData).subscribe((res) => { 
        //     this.resData = res;
        //     //console.log("resData : ", this.resData);
        //     if(this.resData.data > 0){
        //       let creditRewardPoint ={
        //         "user_id": this.user?._id,
        //         "rewardName" : "ProfilePartA",
        //         "rewardCreditPoint":"100",
        //         "uniqueId" : ""
        //       };
        //       //console.log("creditRewardPoint : ", creditRewardPoint);
        //       this.studentService.removeCreditRewardPoint(creditRewardPoint).subscribe((result) => { 
        //         //console.log("reward points credited : ",result);
        //       });
        //     }
        //   });
        // } 
                
        // if(checker(sectionBooleanB)===true){
        //   //console.log("ProfilePartB :", true);
        //   let checkData = {
        //     "user_id": this.user?._id,
        //     "rewardName" : "ProfilePartB"
        //   }; 
        //   this.studentService.checkRewardPoints(checkData).subscribe((res) => { 
        //     this.resData = res;
        //     //console.log("resData : ", this.resData);
        //     if(this.resData.data === 0){
        //       let creditRewardPoint ={
        //         "user_id": this.user?._id,
        //         "rewardName" : "ProfilePartB",
        //         "rewardCreditPoint":"150",
        //         "uniqueId" : ""
        //       };
        //       //console.log("creditRewardPoint : ", creditRewardPoint);
        //       this.studentService.createCreditRewardPoint(creditRewardPoint).subscribe((result) => { 
        //         //console.log("reward points credited : ",result);
        //       });
        //     }
        //   });
        // }else{
        //   let checkData = {
        //     "user_id": this.user?._id,
        //     "rewardName" : "ProfilePartB"
        //   }; 
        //   this.studentService.checkRewardPoints(checkData).subscribe((res) => { 
        //     this.resData = res;
        //     //console.log("resData : ", this.resData.data);
        //     if(this.resData.data > 0){
        //       let creditRewardPoint ={
        //         "user_id": this.user?._id,
        //         "rewardName" : "ProfilePartB",
        //         "rewardCreditPoint":"150",
        //         "uniqueId" : ""
        //       };
        //       // console.log("removeCreditRewardPoint : ", creditRewardPoint);
        //       this.studentService.removeCreditRewardPoint(creditRewardPoint).subscribe((result) => { 
        //         //console.log("reward points credited : ",result);
        //       });
        //     }
        //   });
        // }
        //console.log("Sections",this.sections)
      // })
      
    });                    
  }

  // Make Sticky Vehicle Detail
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   if (!this.isLoading) {
  //     const endBlockHeight = document.getElementById('endBlock').clientHeight;
  //     const endBlockId = document.getElementById('endBlock');
  //     const contentHeight = document.getElementById('profileQuestionBox')
  //       .clientHeight;
  //     if (endBlockId) {
  //       const endBlock =
  //         endBlockId.offsetTop + endBlockHeight - contentHeight - 65;
  //       const scrollPosition =
  //         window.pageYOffset ||
  //         document.documentElement.scrollTop ||
  //         document.body.scrollTop;
  //       const topOffset = 580;
  //       if (scrollPosition > endBlock) {
  //         this.boxScroll = -(scrollPosition - endBlock) + 'px';
  //         this.isSticky = false;
  //       } else {
  //         this.boxScroll = 0 + 'px';
  //         this.isSticky = true;
  //       }

  //       if (scrollPosition > topOffset) {
  //         this.isSticky = true;
  //       } else {
  //         this.isSticky = false;
  //       }
  //     }
  //   }
  // }

  hideModal(): void {
    this.profileCompletedModal.hide();
  }

  onHidden(): void {
    this.isProfileCompletedModalShown = false;
  }

  ngOnDestroy(): void {
    this.configService.setDefaultConfigs();
    this.profileCompletedSubscription?.unsubscribe();
  }

  setProfileFormState(sectionName){
    for(let i in this.sections){
      if(this.sections[i].name === sectionName){
        this.sections[i].isOpen = true;
        this.currentSection = this.sections[i];
      }
      else{
        this.sections[i].isOpen = false;
      }
    }

  }
}
