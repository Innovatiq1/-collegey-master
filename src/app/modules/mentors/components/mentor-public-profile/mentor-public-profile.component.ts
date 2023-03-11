import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Load Services
import { MentorService } from 'src/app/core/services/mentor.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';

import { ToastrService } from 'ngx-toastr';
// Load Modal
import { User } from 'src/app/core/models/user.model';
//clipboard
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-mentor-public-profile',
  templateUrl: './mentor-public-profile.component.html',
  styleUrls: ['./mentor-public-profile.component.css']
})
export class MentorPublicProfileComponent implements OnInit {

  profileText:string = "Beginner";

  // Profile and office hours completed

  profilefirstStepCompleted: boolean = false;
  profilesecondStepCompleted: boolean = false;

  isPublic = this.route.snapshot.data.title === 'public_profile' ? true : false;
  id:any;

  // Assign Data
  CurrentBanner: any;
  ProfileData:any;

  mentorFullName: any;

  mentorDisplayName: any;

  MentorProfileInfo:any;
  MentorOfficeInfo:any;
  MentorOfficeTimezone:any;

  mentorProjects: any;

  //logged in user
  loggedInUserTypeMentor: Boolean = true;;

  //share profile
  siteurl:any; 
  userid: any;
  
  // Assign to User Data
  userInfo: User = new User();

  userComboname:any;


  badgeMastersList: any;
  showbadges: Boolean = false;
  public getVideoIntro: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mentorService: MentorService,
    public commonService: CommonService,
    private authService: AuthService,
    private clipboard: Clipboard,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
  )
  { 
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user?.id;
    this.userComboname = loggedInInfo?.user?.name+'-'+loggedInInfo?.user?.last_name;
    this.siteurl = environment.frontEndUrl;
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();

    if (this.isPublic) 
    {
      this.id = this.route.snapshot.paramMap.get('id');
    }
    this.getCurrentUserData();
    
  }

  ngOnInit(): void {
   let usr =  JSON.parse(localStorage.getItem('user_data'));
   if(usr.user.type == 'mentor' ){
    this.loggedInUserTypeMentor = true;
   } else {
    this.loggedInUserTypeMentor = false;
   }
   this.getMentorData();
  }

  getMentorData() {
    this.mentorService.getMentorProfile().subscribe((profile) => {
      this.profileText = profile.mentor_profile_completion.profile_text;
      this.cdr.detectChanges();
});
  }

  getCurrentUserData()
  {
    const obj = {
      userid: this.id,
    };
    this.mentorService.getMentorUserDataFetch(obj).subscribe(
      (response) => {

        this.badgeMastersList = response?.data?.badgemastersdata;
        if (this.badgeMastersList.length > 0) {
          this.showbadges = true;
        }
        this.CurrentBanner  = response?.data.bannerImage;
        this.ProfileData    = response?.data;
        this.mentorProjects = response?.mentorProject;

        this.MentorProfileInfo = response?.data?.mentor_profile?.profile;
        this.mentorFullName = response?.data?.mentor_profile?.profile.fullLegalName.toLowerCase();
        // this.mentorDisplayName = this.mentorFullName[0].toUpperCase() + this.mentorFullName.substring(1);  
        this.mentorDisplayName = this.capitalize(this.mentorFullName);

        
        this.mentorFullName    = this.mentorFullName.replace(/\s/g,'');

        this.MentorOfficeInfo  = response?.data?.mentor_profile?.officeHours;

        this.MentorOfficeTimezone = response?.data?.mentor_profile?.officeTimezone?.timezoneName;
        
        this.profilefirstStepCompleted  = response?.data?.mentor_profile?.profile?.is_completed;
        this.profilesecondStepCompleted = response?.data?.mentor_profile?.officeTimezone?.is_completed;

        this.getVideoIntro = response?.data?.mentor_profile?.profile?.videoIntroduction;
      },
      (err) => {
        
      },
    );   
  }

  capitalize(input) {  
    var words = input.split(' ');  
    var CapitalizedWords = [];  
    words.forEach(element => {  
        CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));  
    });  
    return CapitalizedWords.join(' ');  
} 

  goToLink(url: string){
    var url1 = url+this.siteurl+'profile/'+this.id+'/'+this.mentorFullName
    //console.log("==========",url1)
    window.open(url1, "_blank");
}

goToLinkedin(url: string){
  var url1 = url+this.siteurl+'profile/'+this.id+'/'+this.mentorFullName
  //console.log("==========",url1)
  window.open(url1, "_blank");
}

goToTwit(url: string){
  var url1 = url+this.siteurl+'profile/'+this.id+'/'+this.mentorFullName
  //console.log("==========",url1)
  window.open(url1, "_blank");
}

CopyClipboardUrl() {
  var currentUrl = this.siteurl+'mentor-profile/'+this.id+'/'+this.mentorFullName;
  this.clipboard.copy(currentUrl);
  this.toastrService.success('Link Copied To Clipboard');
}

}
