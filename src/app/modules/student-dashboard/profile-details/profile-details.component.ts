import { Component, OnInit, HostListener, Inject, PLATFORM_ID, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { Utils } from 'src/app/shared/Utils';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { Dashboard, SignedUpProjects } from 'src/app/core/models/student-dashboard.model';
import { StudentProfileStatusText } from 'src/app/core/enums/student-profile-status-text.enum';
import { isPlatformBrowser } from '@angular/common';
import { AppConfig, ConfigService } from 'src/app/core/services/config.service';
import { Subscription } from 'rxjs';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { Countries, State, Cities } from 'src/app/core/models/static-data.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit, AfterViewInit {
  dashboard: Dashboard = new Dashboard();
  isPublic = this.route.snapshot.data.title === 'public_profile' ? true : false;
  id: any;
  isActive: boolean = false;
  ImageUrl: any;
  ProfileData: any;
  CurrentBanner: any;
  userComboname: any;
  siteurl: any;
  progressBarValue: number = 25;
  firstname: any;
  lastname: any;
  badgeMastersList: any;
  showbadges: Boolean = false;
  appConfig: AppConfig;
  isBannerScrolled: boolean = false;
  onConfigChanged: Subscription;
  loggedInUser: any;

  //location data
  countries: Countries[] = JSON.parse(localStorage.getItem(AppConstants.KEY_COUNTRIES_DATA));
  states: State[];
  cities: Cities[];
  allStates: any[] = []
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentDashboardService: StudentDashboardService,
    private authService: AuthService,
    public commonService: CommonService,
    private clipboard: Clipboard,
    private toastrService: ToastrService,
    public configService: ConfigService,
    public cdr: ChangeDetectorRef,
    private staticDataService: StaticDataService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    const loggedInInfo = this.authService.getUserInfo();
    this.loggedInUser = loggedInInfo?.user?.id;
    if (this.isPublic) {
      this.id = this.route.snapshot.paramMap.get('id');
    }
    else
    { 
      this.id = loggedInInfo?.user?.id;
    } 
    this.getCurrentUserData();
    this.getBannerImage();
    this.siteurl = environment.frontEndUrl;
    this.getStateList();
  }

  ngOnInit(): void {
    if (!this.isPublic) {
      this.studentDashboardService.getDashboardDetailNew().subscribe((res) => {
        if (res.profile.profile_completion) {
          this.calculateProfileProgress(
            res.profile.profile_completion.profile_text
          );
          
        }
        this.getCurrentUserData();
        this.dashboard = res;
      });
    }
  }

  //Get list of states
  getStateList() {
    this.staticDataService.getAllStates().subscribe(
      (response) => {
        this.allStates = response;         
        this.cdr.detectChanges();
      },
      (error) => {
        // this.toastrService.error(error.message || 'Oops something went wrong');
      }
    );
  }
  getStateName(id)
  {
    var result = this.allStates?.filter(item =>item.id==id)
    return result[0]?.name ? result[0]?.name: '';
  }
  
  getCountryName(id)
  {
    var result = this.countries?.filter(item =>item.id==id)
    if(result?.length > 0)
    {
      return result[0]?.name ? result[0]?.name: '';
    }
    else
    {
       return '';
    }
    
  }

  ngAfterViewInit(): void {
    // Subscribe to all the settings change events
    this.onConfigChanged = this.configService.onAppConfigChanged.subscribe(
      (config: AppConfig) => {
        this.appConfig = config;
        this.cdr.detectChanges();
      }
    );
  }

  @HostListener('window:scroll', ['$event'])
  updateHeader($event) {
    if (isPlatformBrowser(this.platformId)) {
      const scrollHeight = 250;
      const currPos =
        (window.pageYOffset || $event.target.scrollTop) -
        ($event.target.clientTop || 0);
      if (currPos >= scrollHeight) {
        this.isBannerScrolled = true;
      } else {
        this.isBannerScrolled = false;
      }
    }
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

  getBannerImage() {
    this.ImageUrl = localStorage.getItem("BannerImage");
  }

  _getImageName(file) {
    return Utils.getDocumentName(file);
  }

  sliceImageName(file) {
    return file.slice(27);
  }
  
  CopyClipboardUrl() {
    var currentUrl = this.siteurl + 'profile/' + this.id + '/' + this.userComboname;
    this.clipboard.copy(currentUrl);
    this.toastrService.success('Link Copied To Clipboard');
  }

  getCurrentUserData() {
    const obj = {
      userid: this.id,
    };
    this.studentDashboardService.getCurrentUserDataFetch(obj).subscribe(
      (response) => {
        this.ProfileData = response?.data;
        this.firstname = this.ProfileData?.name[0].toUpperCase() + this.ProfileData?.name.substring(1);   
        this.lastname = this.ProfileData?.last_name[0].toUpperCase() + this.ProfileData?.last_name.substring(1); 
        this.badgeMastersList = response?.data?.badgemastersdata;
        if (this.badgeMastersList.length > 0) {
          this.showbadges = true;
        }

        this.CurrentBanner = response?.data.bannerImage;
        this.userComboname = response?.data?.name.toLowerCase() + '-' + response?.data?.last_name.toLowerCase();
        this.userComboname = this.userComboname.replace(/\s/g, '');
      },
      (err) => {

      },
    );
  }

}
