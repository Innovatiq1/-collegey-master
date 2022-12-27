import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  HostListener,
  PLATFORM_ID,
  Inject,
  TemplateRef,ViewEncapsulation, ViewChild 
} from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { UserType } from 'src/app/core/enums/user-type.enum';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
// import Swiper core and required modules
import SwiperCore, { Mousewheel, Pagination } from "swiper/core";

// install Swiper modules
SwiperCore.use([Mousewheel, Pagination]);


@Component({
  selector: 'app-home',
 /*  template: `<swiper [direction]="'vertical'" [slidesPerView]="1" [spaceBetween]="30" [mousewheel]="true" [pagination]="{
    clickable: true
  }" class="mySwiper">
  <ng-template swiperSlide>
    <div class="corousal-one" [style.height.px]="screenHeight">
      <app-corousal-one [screenHeight]="screenHeight"></app-corousal-one>
    </div>
  </ng-template>
  <ng-template swiperSlide>
    <div class="corousal-two" [style.height.px]="screenHeight">
      <app-corousal-two [mobile]="mobileView"></app-corousal-two>
    </div>
  </ng-template>
  <ng-template swiperSlide>
    <div class="corousal-seven" [style.height.px]="screenHeight">
      <app-corousal-seven [mobile]="mobileView"></app-corousal-seven>
    </div>
  </ng-template>
  <ng-template swiperSlide>
    <div class="corousal-ten" *ngIf="!mobileView">
      <app-corousal-ten [mobile]="mobileView"></app-corousal-ten>
    </div>
    <div class="corousal-ten" *ngIf="mobileView" mobile="mobileView">
      <app-corousal-ten [mobile]="mobileView"></app-corousal-ten>
    </div>
  </ng-template>
  <ng-template swiperSlide>
    <div class="corousal-three" [style.height.px]="screenHeight">
      <app-corousal-three></app-corousal-three>
    </div>
  </ng-template>
  <ng-template swiperSlide>
    <div class="corousal-four" [style.height.px]="screenHeight">
      <app-corousal-four></app-corousal-four>
    </div>
  </ng-template>
  <ng-template swiperSlide>
    <div class="corousal-five" [style.height.px]="screenHeight">
      <app-corousal-five></app-corousal-five>
    </div>
  </ng-template>
  <ng-template swiperSlide>
    <div *ngIf="!mobileView" class="corousal-six" [style.height.px]="screenHeight">
      <app-corousal-six></app-corousal-six>
    </div>
    <div *ngIf="mobileView" class="corousal-six">
      <app-corousal-six></app-corousal-six>
    </div>

  </ng-template>
  <ng-template swiperSlide>
    <div *ngIf="!mobileView" class="corousal-eight" [style.height.px]="screenHeight">
      <app-corousal-eight [mobile]="mobileView"></app-corousal-eight>
    </div>

    <div *ngIf="mobileView" class="corousal-eight">
      <app-corousal-eight [mobile]="mobileView"></app-corousal-eight>
    </div>
  </ng-template>
  <ng-template swiperSlide>
    <app-corousal-nine></app-corousal-nine>
  </ng-template>
  <ng-template  swiperSlide>
  <div class="corousal-footer">
    <app-footer ></app-footer>
    </div>
  </ng-template>
</swiper>`, */
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  public screenWidth: any;
  public mobileView: boolean;
  public screenHeight: any;
  modalRef: BsModalRef;

  fullPageObj: any;
  blueLogo = false;
  isHomePage: true;
  isBannerScrolled: boolean;
  isShowCookies = false;

  // Add Home Data
  public homepageFistData:any;
  public homepageSecondData:any;
  public homepageThirdData:any;
  public homepageForthData:any;
  public homepageFifthData:any;
  public homepageSixData:any;
  public homepageSevenData:any;
  public homepageEighthData:any;
  public homeFooterImpactImg:any;
  constructor(
    private modalService: BsModalService,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private studentDashboardService: StudentDashboardService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.screenWidth = window.innerWidth;
    //console.log(this.screenWidth);
    if (this.screenWidth < 900) {
      this.mobileView = true;
    }
    if (this.screenWidth >= 900) {
      this.mobileView = false;
    }
  }

  ngOnInit(): void {
    this.getHomepageContentData();
    this.screenHeight = window.innerHeight;
    this.configService.updateConfig({
      headerClass: 'transparent-header',
      blueLogo: false,
    });
    this.getCounselorInviteSource();
    this.isShowCookies = JSON.parse(
      this.cookieService.get('accept_cookies') || 'false'
    );
  }

  getHomepageContentData()
  {
    let obj = {};
    this.studentDashboardService.getHomepageContentData(obj).subscribe(
      (response) => { 
        this.homepageFistData      = response?.data?.home_first_section[0];
        this.homepageSecondData    = response?.data?.home_second_section[0];
        this.homepageThirdData     = response?.data?.home_third_section[0];
        this.homepageForthData     = response?.data?.home_fourth_section[0];
        this.homepageFifthData     = response?.data?.home_fifth_section[0];
        this.homepageSixData       = response?.data?.home_sixth_sec_data[0];
        this.homepageSevenData     = response?.data?.home_bottom_first_slide_data;
        this.homepageEighthData    = response?.data?.home_bottom_second_slide_data;
        this.homeFooterImpactImg   = response?.data?.home_footer_section[0]?.imagePath;
      }, 
      (err) => {
      
      },
    );   
  }

  openEmailVerificationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
    this.modalRef.setClass('modal-width max-width');
  }

  getCounselorInviteSource() {
    this.activatedRoute.queryParams.subscribe((param) => {
      if (param && param.source === 'counselor_invite') {
        localStorage.setItem(AppConstants.KEY_COUNSELOR_SOURCE, param.source);
      }
    });
  }

  onRegister() {
    if (!this.authService.getToken()) {
      this.authService.openAuthDialog(AuthType.SIGN_UP);
      return;
    }
    const user: User = JSON.parse(
      localStorage.getItem(AppConstants.KEY_USER_DATA)
    ).user;

    if (user.type === UserType.COUNSELOR) {
      this.router.navigateByUrl('/counselor/dashboard');
    } else if (user.type === UserType.STUDENTS) {
      // if (user.profile_completed) {
      //   this.router.navigateByUrl('/student/dashboard');
      // }
      this.router.navigateByUrl('/student-dashboard/$');
      //  else {
      //   this.router.navigateByUrl('student/profile');
      // }
    }
  }

  hideCookies() {
    this.isShowCookies = true;
  }

  acceptCookies() {
    this.isShowCookies = true;
    const expiryDate = new Date(2090, 1, 25, 13, 30, 30);
    this.cookieService.set(
      'accept_cookies',
      JSON.stringify(this.isShowCookies),
      expiryDate
    );
  }

  @HostListener('window:scroll', ['$event'])
  updateHeader($event) {
    if (isPlatformBrowser(this.platformId)) {
      const scrollHeight = 1050;
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

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
  }
}
