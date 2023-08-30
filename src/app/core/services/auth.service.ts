import { Injectable, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable, BehaviorSubject,throwError } from 'rxjs';
import { AuthModalType } from '../enums/login.enum';
import { Logger } from './logger.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiGenericResponse } from '../models/response.model';
import { map } from 'rxjs/operators';
import { AppConstants } from 'src/app/shared/constants/app.constants';  
import { AuthType } from '../enums/auth-type.enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthDialogComponent } from 'src/app/shared/components/auth-dialog/auth-dialog.component';
import { StaticDataService } from './static-data.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User, Student } from '../models/user.model';
import { UserType } from '../enums/user-type.enum';
import { catchError } from 'rxjs/operators';
import { StudentService } from 'src/app/core/services/student.service';
import { MentorService } from './mentor.service';

interface AuthModalSubject {
  show: boolean;
  type: AuthModalType;
  redirectUrl?: string;

}

const log = new Logger('AuthService');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authModal$: Subject<AuthModalSubject> = new Subject();
  private authModalRef: BsModalRef;
  private successModalRef: BsModalRef;
  itemsPerLoad = 10; // Number of items to load per click
  currentPage = 1;
  notificationCount:number
  dropdownVisible = false;
  notifications=[]
  displayedNotifications=[]
  authModalConfig = {
    backdrop: true,
    keyboard: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog-centered auth-modal',
  };

  // User as Observable
  private currentUser: BehaviorSubject<Student> = new BehaviorSubject<Student>(
    null
  );
  readonly currentUser$ = this.currentUser.asObservable();

  $selectUserLogin: BehaviorSubject<UserType> = new BehaviorSubject<UserType>(null);
  public totalLeftRewardPoint1: any = localStorage.getItem('totalLeftRewardPoint');
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient,
    private modalService: BsModalService,
    private staticDataService: StaticDataService,
    private router: Router,
    private toastrService: ToastrService,
    private studentService: StudentService,
    private mentorService:MentorService,
    //private cdr: ChangeDetectorRef,
  ) {
    this.currentUser$ = this.currentUser.asObservable();
  }

  openAuthDialog(authType: AuthType, userType?: UserType, socialUserInfo?) {
    this.closeSuccessDialog();
    if (socialUserInfo) {
      this.authModalConfig['initialState'] = { socialUserInfo };
    }
    if (userType === UserType.COUNSELOR) {
      this.router.navigateByUrl('/counselor-sign-up');
      return;
    }
    this.authModalRef = this.modalService.show(
      AuthDialogComponent,
      this.authModalConfig
    );
    this.authModalRef.content.authType = authType;
  }

  closeSuccessDialog() {
    if (this.successModalRef) {
      this.successModalRef.hide();
    }
  }

  closeAuthDialog() {
    if (this.authModalRef) {
      this.authModalRef.hide();
    }
  }

  getLinkedinAccessToken = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/auth/getLinkedinAccessToken';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getLinkedinDetailsFetch = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/auth/getLinkedinDetailsFetch';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  
  getLinkedinDetailsFetch1 = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/auth/getLinkedinDetailsFetch1';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  socialLogin(socialUser): Observable<ApiGenericResponse<any>> {
    return this.http
      .post<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}auth/social-login`,
        socialUser
      )
      .pipe(
        map((response) => {
          if (response.data) {
            // this.loadStaticData();
            this.saveUserInfo(response.data);
          }
          return response;
        })
      );
  }

  loadStaticData() {
    this.staticDataService._getStaticDataList().subscribe((data) => {
      this.staticDataService._saveStaticDataList(data);
    });
    this.staticDataService
      .getCountries()
      .subscribe((data) => {
        if(data) {
          this.staticDataService.saveCountries(data);
        }
      });
  }

  login(formData) {
    return this.http
      .post<any>(`${environment.apiEndpoint}auth/login`, formData)
      .pipe(
        map((res) => {
          var user_id = res.data.user._id;
          this.saveUserInfo(res.data);
          this.setReward(user_id);
          this.userList()
          this.getunReadCount()
          // this.saveUserIn(res);
          return res;
        })
      );
  }
  userList() {
    this.mentorService.getUserList().subscribe((response: any) => {
     const currentTime :any= new Date();
      this.notifications = response.data[0].notification
      for (let f = 0; f < this.notifications.length; f++) {
        var groupTimeAgo = this.notifications[f].createdAt;
        this.notifications[f].timeago = this.timeDifference(groupTimeAgo);
      }
     
      this.loadMoreNotifications()
    });
  //}
  }
  loadMoreNotifications() {
    const startIndex = (this.currentPage - 1) * this.itemsPerLoad;
    const endIndex = startIndex + this.itemsPerLoad;
    this.displayedNotifications = this.notifications.slice(startIndex, endIndex);
    this.dropdownVisible=false

    if(this.displayedNotifications.length===0){
      this.currentPage=1
     this.userList()
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
  markAsRead(id:any){
  this.mentorService.notificationupdate(id).subscribe((response: any) => {
    //console.log("response",response)
    if(response.status=='success'){
      this.getunReadCount()
      //this.router.navigateByUrl("/")
      this.userList()
     
    }

  })
}
getunReadCount(){
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


  checkloginpassword = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/profile/checkloginpassword';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  logOut() {
    this.http
      .post(`${environment.apiEndpoint}auth/logout/`, {})
      .pipe(
        map(
          (response) => {
            log.info(response);
            this.clearLocalStorage();
            this.toastrService.success(`Logged out successfully`);
          },
          (error: Error) => {
            log.error(error);
          }
        )
      )
      .subscribe();
  }

  forgotPassword(email): Observable<ApiGenericResponse<any>> {
    return this.http
      .post<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}common/forgot-password`,
        email
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  checkResetUrlValidation(token) {
    return this.http
      .get<any>(`${environment.apiEndpoint}common/reset-password/${token}`)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  resetPassword(object) {
    return this.http
      .post<any>(
        `${environment.apiEndpoint}common/reset-password/${object.token}`,
        object
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getUserInfo() {
    return JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA));
  }

  saveUserInfo(info) {
    this.loadStaticData();
    //console.log("ths is static data",info);
    localStorage.setItem(AppConstants.KEY_USER_DATA, JSON.stringify(info));
    this.currentUser.next(info);
  }

//   saveUserIn(info) {
//     const user = localStorage.getItem('currentUser');
// // if user is null
// if(user == null){
//   return this.http
//   .post<any>(`${environment.apiEndpoint}auth/login`, FormData)
// } else {
//   // redirect to home through navigateByURL()
// }
//   }


  /**
   * @returns token
   */
  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA));
      return user ? user.token : null;
    }
  }

  /**
   * @description clear all local storage at time of logout
   */
  clearLocalStorage() {
    // Reset logged in user
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AppConstants.KEY_STATIC_DATA);
      localStorage.removeItem(AppConstants.KEY_USER_DATA);
      localStorage.removeItem(AppConstants.KEY_COUNTRIES_DATA);
      localStorage.removeItem(AppConstants.KEY_COUNTRY_PHONE_CODE);
      localStorage.removeItem(AppConstants.KEY_COUNSELOR_SOURCE);
      localStorage.removeItem(AppConstants.KEY_User_Reward_Point);
      localStorage.removeItem('totalLeftRewardPoint');
      this.router.navigateByUrl('/');
    }
  }

  setReward(id:any){
    let creditRewardPoint ={
      "user_id": id, 
    };
    let totalDebitRewardPoint: any = 0;
    let rewardPoint: any = 0;
    this.studentService.getUserRewardPoints(creditRewardPoint).subscribe((res) => {
      var reward = res['data'];      
      localStorage.setItem(AppConstants.KEY_User_Reward_Point, JSON.stringify(reward));
      let creditPoints = reward.rewardsPointobjects;
      creditPoints.forEach(element => {
        rewardPoint = parseFloat(rewardPoint) + parseFloat(element.rewardCreditPoint);
        totalDebitRewardPoint  = parseFloat(totalDebitRewardPoint) + parseFloat(element.rewardDebitPoint);
      });
      let totalLeftRewardPoint = parseFloat(rewardPoint) - parseFloat(totalDebitRewardPoint);
      this.totalLeftRewardPoint1 = totalLeftRewardPoint;
      localStorage.setItem('totalLeftRewardPoint', totalLeftRewardPoint.toString());
    })
  }

  getReward() {
    return JSON.parse(localStorage.getItem(AppConstants.KEY_User_Reward_Point));
  }
}
