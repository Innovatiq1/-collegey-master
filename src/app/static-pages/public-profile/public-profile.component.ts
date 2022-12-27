import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from 'src/app/core/services/profile.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicProfile } from 'src/app/core/models/student-dashboard.model';
import { compact } from 'lodash';
import { CommonService } from 'src/app/core/services/common.service';
import { User } from 'src/app/core/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { DEFAULT_CONFIG } from 'src/configs/default';
import { Utils } from 'src/app/shared/Utils';
import { ConfigService } from 'src/app/core/services/config.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { QualificationType } from 'src/app/modules/students/components/profile/student-history/components/history-form/history-form.component';

declare const FB: any;

enum BasicSocialMediaHandles {
  FACEBOOK = 'Facebook',
  TWITTER = 'Twitter',
  LINKEDIN = 'LinkedIn'
}

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css'],
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  slug: string;
  studentProfile: PublicProfile = new PublicProfile();
  userInfo: User = new User();
  isVisibleMoreSocialMediaIcon = false;
  basicSocialMedialHandlesList = [];
  socialHandleList = [];
  userCredentials = {
    awards : [],
    certificates: [],
    participations: [],
    internship: [],
    volunteer: [],
    experience: [],
    'online learning': []
  };

  qualificationType = QualificationType;

  credentialKeys = Object.keys(this.userCredentials);



  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private authService: AuthService,
    public commonService: CommonService,
    public router: Router,
    public toasterService: ToastrService,
    private configService: ConfigService,
    private datePipe: DatePipe
    
  ) {
    // initialise facebook sdk after it loads if required
    if (!window['fbAsyncInit']) {
      window['fbAsyncInit'] = function () {
        window['FB'].init({
          appId: DEFAULT_CONFIG.keys.FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v3.0',
        });
      };
    }

    // load facebook sdk if required
    const url = 'https://connect.facebook.net/en_US/sdk.js';
    if (!document.querySelector(`script[src='${url}']`)) {
      let script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script);
    }
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug || undefined;
    this.configService.configs.blueLogo = true;
    this.getPublicProfile();
    this.getUserInfo();
  }

  getSocialShareUrl() {
    return `${environment.frontEndUrl}${this.router.url}`;
  }

  getFbShareUrl() {
    const shareUrl = this.getSocialShareUrl();
    FB.ui(
      {
        appId: DEFAULT_CONFIG.keys.FACEBOOK_APP_ID,
        method: 'share',
        mobile_iframe: true,
        action_type: 'og.shares',
        display: 'popup',
        action_properties: JSON.stringify({
          object: {
            'og:url': shareUrl,
            'og:title': 'Title',
            'og:image': environment.frontEndUrl,
            'og:image:width': '1200',
            'og:image:height': '630',
            'og:description': 'Description',
          },
        }),
      },
    );
  }

  getTwitterShareUrl() {
    const shareUrl = this.getSocialShareUrl();
    const url: string = `https://twitter.com/intent/tweet?url=${shareUrl}`;
    window.open(url, '_blank');
  }
  getLinkedInShareUrl() {
    const shareUrl = this.getSocialShareUrl();
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`;
    window.open(url, '_blank');
  }

  getUserInfo() {
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
  }

  getPublicProfile() {
    this.profileService.getPublicProfile(this.slug).subscribe((res) => {
      this.studentProfile = res.data;
      this.studentProfile.student_profile.projects.describe_any_project = compact(
        res.data.student_profile.projects.describe_any_project
      );
      this.getUserCredentials();
      this.getSocialMediaConnects();
    });
  }

  getUserCredentials() {
    const awards = this.studentProfile.student_profile.projects.award;
    for(let i = 0; i < awards.length; i++) {
      for(let j = 0;  j < this.credentialKeys.length; j++) {
        if(awards[i].type === this.credentialKeys[j]) {
          this.userCredentials[this.credentialKeys[j]].push(awards[i]);
        }
      }
    }
    console.log(this.userCredentials);
  }

  dateParser(duration) {
    if(duration && duration.length > 0) {
      const parseDate = [];
      duration.forEach(date => {
        parseDate.push(Utils.transformNumericDate(date));
      });
      return parseDate.join();
    }
  }


  getSocialMediaConnects() {
    const social_media = this.studentProfile.student_profile.ways_to_be_in_touch.social_media;
    social_media.forEach(handle => {
      const socialMediaObj: any = {};
      if(handle.channel_name === BasicSocialMediaHandles.FACEBOOK) {
          socialMediaObj.channel_link = handle.channel_link;
          socialMediaObj.channel_name = handle.channel_name;
          socialMediaObj.channel_icon = '/assets/images/fb.svg';
          this.basicSocialMedialHandlesList.push(socialMediaObj);
      }else if(handle.channel_name === BasicSocialMediaHandles.TWITTER) {
        socialMediaObj.channel_link = handle.channel_link;
        socialMediaObj.channel_name = handle.channel_name;
        socialMediaObj.channel_icon = '/assets/images/twitter.svg';
        this.basicSocialMedialHandlesList.push(socialMediaObj);
      } else if(handle.channel_name === BasicSocialMediaHandles.LINKEDIN) {
        socialMediaObj.channel_link = handle.channel_link;
        socialMediaObj.channel_name = handle.channel_name;
        socialMediaObj.channel_icon = '/assets/images/linkedin.svg';
        this.basicSocialMedialHandlesList.push(socialMediaObj);
      }

      if(handle.channel_name !== BasicSocialMediaHandles.FACEBOOK &&
         handle.channel_name !== BasicSocialMediaHandles.TWITTER && 
         handle.channel_name !== BasicSocialMediaHandles.LINKEDIN) {
           this.socialHandleList.push(handle);
         }


    });
  }

  downloadDocuments(filePath) {
    const route = this.commonService.imagePathMaker(filePath);
    window.open(route);
  }

  _getDocumentName(file) {
    return Utils.getDocumentName(file);
  }

  copyUrl() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.value = window.location.href;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toasterService.success('Portfolio link copied');
  }

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
  }
}
