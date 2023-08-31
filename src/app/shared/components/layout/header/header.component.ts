import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { User } from 'src/app/core/models/user.model';
import { AuthModalType } from 'src/app/core/enums/login.enum';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppConfig, ConfigService } from 'src/app/core/services/config.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';
import { UserType } from 'src/app/core/enums/user-type.enum';
import { NavbarService } from 'src/app/core/services/nav-bar.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import {
  Dashboard,
  SignedUpProjects,
} from 'src/app/core/models/student-dashboard.model';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { MentorService } from 'src/app/core/services/mentor.service';

enum RoutesUrl {
  LOGIN = '/login',
  SIGN_UP = '/sign-up',
  PUBLIC_PROFILE = '/profile/',
  HOME = '/',
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchBox') searchBox: ElementRef;
  dashboard: Dashboard = new Dashboard();
  @Output()
  authModalEmitter: EventEmitter<AuthModalType> = new EventEmitter<AuthModalType>();
  userInfo: User = new User();
  USER_TYPES = UserType;
  isBannerScrolled: boolean;
  appConfig: AppConfig;
  onConfigChanged: Subscription;
  isProfileCompleted = false;

  userSubscription = new Subscription();

  isShowLoginButton = true;
  navToggle: boolean;

  @Output()
  isMobileMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  resData: any;
  creditPoints: any;
  rewardPoint: any = 0;
  totalDebitRewardPoint: any = 0;
  totalLeftRewardPoint: any = 0;
 notifications=[]
 notificationCount:number
 itemsPerLoad = 10; // Number of items to load per click
 currentPage = 1;
 dropdownVisible = false;
 private isApiCallInProgress = false;


 
// notificationCount:number
 //dropdownVisible = false;
 //notifications=[]
 displayedNotifications=[]

  topSearchResult: any;
  showSearchResultDrop: boolean = false;
  constructor(
    private router: Router,
    public authService: AuthService,
    private studentDashboardService: StudentDashboardService,
    private mentorService:MentorService,
    public configService: ConfigService,
    private cdr: ChangeDetectorRef,
    public commonService: CommonService,
    private studentService: StudentService,
    private navBarService: NavbarService,
    private modalService: BsModalService,
    private resourcesService: ResourcesService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    const loggedInInfo = this.authService.getUserInfo();
    if (loggedInInfo?.user?.forgetPasswordChange == true) {
      this.router.navigateByUrl('/reset-password');
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutsideCurrentPopup(event: Event) {
    if (!this.searchBox.nativeElement.contains(event.target)) {
      this.showSearchResultDrop = false;;
      this.searchBox.nativeElement.value = '';
    }
  }

  // Add white background on home page when page scrolled
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

  ngOnInit(): void {
    this.methodToCallOnce();
    //
    
    this.userSubscription.add(
      this.authService.currentUser$.subscribe((userInfo) => {
        if (userInfo) {
          this.userInfo = userInfo.user;
          this.getDashboardDetail();
        } else {
          this.getUserInfo();
        }

      })
    );
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && event.url) {
        if (
          (event.url === RoutesUrl.LOGIN ||
            event.url === RoutesUrl.SIGN_UP ||
            event.url.includes(RoutesUrl.PUBLIC_PROFILE)) &&
          !this.isAuthenticated()
        ) {
          this.isShowLoginButton = false;
        }
      }
    });
    this.userSubscription.add(
      this.commonService.$isAvatarChanged.subscribe((response) => {
        if (response) {
          this.getUpdatedAvatar();
        }
      })
    );

    this.userSubscription.add(
      this.studentService.isProfileCompleted$.subscribe((response) => {
        if (response) {
          this.isProfileCompleted =
            response?.profile_completion.profile_completed;
        } else if (this.isAuthenticated()) {
          // this.commonService.getUserDetails().subscribe((resp) => {            
          //   this.isProfileCompleted = resp.profile_completed;
          // });

          const loggedInInfo = this.authService.getUserInfo();
          this.isProfileCompleted = loggedInInfo?.user?.profile_completed;
        }
      })
    );
  }
  private methodToCallOnce(): void {
    this.userList();
    this.getunReadCout();
    // Your code to be executed only once
    console.log('Method called once during component loading.');
  }
  userList() {
    
     if (!this.isApiCallInProgress) {
      
    this.mentorService.getUserList().subscribe((response: any) => {
     const currentTime :any= new Date();
      this.notifications = response.data[0].notification
      for (let f = 0; f < this.notifications.length; f++) {
        var groupTimeAgo = this.notifications[f].createdAt;
        this.notifications[f].timeago = this.timeDifference(groupTimeAgo);
      }
     
      this.loadMoreNotifications()
      this.isApiCallInProgress=true
    });
  }
  //}
  }
  loadMoreNotifications() {
    const startIndex = (this.currentPage - 1) * this.itemsPerLoad;
    const endIndex = startIndex + this.itemsPerLoad;
    this.displayedNotifications = this.notifications.slice(startIndex, endIndex);
    this.dropdownVisible=false

    if(this.displayedNotifications.length===0){
      this.currentPage=1
     //this.userList()
     this.loadMoreNotifications()
      
    }
  }
  timeDifference(previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var preDate = new Date(previous);
    var curDate = new Date();
    var elapsed = curDate.valueOf() - preDate.valueOf();
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + 'm ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + 'h ago';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + 'd ago';
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + 'mth ago';
    } else {
      return Math.round(elapsed / msPerYear) + 'yrs ago';
    }
  }
  loadMore() {
  if (this.displayedNotifications.length < this.notifications.length) {
      
      this.currentPage++;
      this.loadMoreNotifications();
    } else {
      
      this.currentPage=1
    }
  }
  toggleDropddown(){
    this.dropdownVisible = !this.dropdownVisible;

  }
  markAsRead(notification:any){
    notification.isRead = true;
  



    //displayedNotifications
  this.mentorService.notificationupdate(notification._id).subscribe((response: any) => {

    //console.log("response",response)
    if(response.status=='success'){
      //notification.read = true; 
      const notificationIndex = this.displayedNotifications.findIndex(n => n.id === notification._id);
          if (notificationIndex !== -1) {
            this.displayedNotifications[notificationIndex].isRead = true; 
          }
      this.getunReadCout()
      //this.router.navigateByUrl("/")
      //this.userList()
     
    }

  })
}
getunReadCout(){
this.mentorService.getunReadCount().subscribe((response: any) => {
  if(response.status=='success'){
    console.log("======response.data==",response.data)
    //co
    this.notificationCount=response.data

    // Trigger change detection

    //this.userList()
   //this.getunReadCout()
  }    
})
}


  // markAsRead(notification) : void{
  //   notification.isRead = true;
  // }

  ntitile : string = "New Notifications";
  //notificationCount = 5;

  // notifications = [
  //   { text: 'New Instructor', course:'Advanced Java', time: '30 Min ago.' },
  //   {  text: 'Student Programs', course: 'Skills, Council Membership', time: '15 Min ago.' },
  //   {  text: 'Global Education Program', course:'Global Programs', time: '02 Days ago.' },
  //   {  text: 'Undergraduate Recruitment tours : Spring 2023', course:'Tour & In Detail program', time: '2 days ago.' }
    
  //   // Add more notifications here
  // ];

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  toggleExpansion(){
    this.isExpanded =! this.isExpanded;
  }
  isExpanded = false
  // notifications() {
  //   this.list = !this.list
  // }
  // list = true;
  // showDropdown = false;
  // togglrDropdown(){
  //   this.showDropdown = !this.showDropdown
  // }

  searchTopSearch(event) {
    const obj = {
      searchKeyword: event.target.value,
    };

    this.resourcesService.getSearchPostData(obj).subscribe(
      (response) => {
        if (response?.data != null) {
          this.showSearchResultDrop = true;
          this.topSearchResult = response?.data;
        }
      }
    );

  }

  onNavigateSingle(slug) {
    this.router.navigateByUrl(`blog/${slug}`);
  }

  getUpdatedAvatar() {
    // console.log('updated');
    if (this.isAuthenticated()) {
      this.commonService.getUserDetails().subscribe((response) => {
        if (response) {
          const updatedAvatar = response.avatar;
          this.userInfo.avatar = updatedAvatar;
          this.setUserData();
        }
      });
    }
  }
  openNewLink() {

    window.open("/events", '_blank');

  }
  setUserData() {
    const loggedInInfo = this.authService.getUserInfo();
    loggedInInfo.user = this.userInfo;
    localStorage.setItem(
      AppConstants.KEY_USER_DATA,
      JSON.stringify(loggedInInfo)
    );
  }

  getUserInfo() {
    const loggedInInfo = this.authService.getUserInfo();
    // console.log(loggedInInfo)
    this.userInfo = loggedInInfo ? loggedInInfo.user : null;
    // if(this.userInfo?._id && this.userInfo?.type != 'mentor')
    // {
    //   this.getUserRewardPoints();
    // }
  }

  onRegister(userType) {
    this.authService.openAuthDialog(AuthType.SIGN_UP, userType);
  }

  openLoginModal() {
    this.authService.$selectUserLogin.next(UserType.STUDENTS);
    this.authService.openAuthDialog(AuthType.LOGIN, UserType.STUDENTS);
  }

  onLogOut() {
    this.authService.logOut();
    localStorage.removeItem('user_data');
    localStorage.removeItem('static_data');
    localStorage.removeItem('fetchcurrentUserRole');
    // localStorage.clear();
  }

  isAuthenticated() {
    return this.authService.getToken();
  }

  isLoginRoleCheck() {
    if (localStorage.getItem('fetchcurrentUserRole') == 'mentor') {
      return true;
    }
    else {
      return false;
    }
  }

  toggleNav() {
    this.navBarService.toggleMenu();
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

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  getDashboardDetail() {
    this.studentDashboardService.getDashboardDetail().subscribe((res) => {
      this.dashboard = res;
      // console.log("header : ");
    });
  }

  // get user rewards points data in observable

  // getUserRewardPoints() { 
  //   let creditRewardPoint ={
  //     "user_id": this.userInfo?._id, 
  //   };
  //   this.studentService.getUserRewardPoints(creditRewardPoint).subscribe((res) => {      
  //     this.resData = res;
  //     this.creditPoints = this.resData.data.rewardsPointobjects;
  //     this.creditPoints.forEach(element => {
  //       this.rewardPoint = parseFloat(this.rewardPoint) + parseFloat(element.rewardCreditPoint);
  //       this.totalDebitRewardPoint  = parseFloat(this.totalDebitRewardPoint) + parseFloat(element.rewardDebitPoint);
  //     });
  //     this.totalLeftRewardPoint = parseFloat(this.rewardPoint) - parseFloat(this.totalDebitRewardPoint);
  //   }); 
  // }

  // getUserRewardPoints() {    
  // const rewardData = this.authService.getReward();
  //   // this.resData = res;
  //   this.creditPoints = rewardData.rewardsPointobjects;
  //   this.creditPoints.forEach(element => {
  //     this.rewardPoint = parseFloat(this.rewardPoint) + parseFloat(element.rewardCreditPoint);
  //     this.totalDebitRewardPoint  = parseFloat(this.totalDebitRewardPoint) + parseFloat(element.rewardDebitPoint);
  //   });
  //   this.totalLeftRewardPoint = parseFloat(this.rewardPoint) - parseFloat(this.totalDebitRewardPoint);
  // }

}