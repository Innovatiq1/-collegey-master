import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject,Subject,throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Logger } from 'src/app/core/services/logger.service';
import { map } from 'rxjs/operators';
import { ApiGenericResponse } from '../models/response.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('CommonService');

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  $isAvatarChanged = new BehaviorSubject<boolean>(false);
  private locationChanged = new Subject<any>();
  $isBannerImageChanged = new BehaviorSubject<boolean>(false);
  public subscribProfileForm = new Subject();
  
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sanitizer: DomSanitizer) {}

  sendUpdate(obj) { 
      this.locationChanged.next({ city: obj.city, state: obj.state, country: obj.country });
  }

  getUpdate(): Observable<any> { 
      return this.locationChanged.asObservable();
  }

  uploadImage(formData, source): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiEndpoint}common/upload-files/${source}`,
        formData
      )
      .pipe(
        map((response) => {
          Logging.debug(response.files);
          return response.files;
        })
      );
  }
  uploadResume(formData, source): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiEndpoint}common/upload-resume/${source}`,
        formData
      )
      .pipe(
        map((response) => {
          Logging.debug(response.files);
          return response.files;
        })
      );
  }

  publicuploadResume(formData, source): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiEndpointNew}public/common/upload-resume/${source}`,
        formData
      )
      .pipe(
        map((response) => {
          Logging.debug(response.files);
          return response.files;
        })
      );
  }

  uploadProfile(profile): Observable<any> {
    return this.http
      .put<any>(`${environment.apiEndpoint}auth/edit`, profile)
      .pipe(
        map((response) => {
          Logging.debug(response.files);
          return response.data;
        })
      );
  }

  imagePathMaker(imageName, commonImage?) {
    return imageName ? `${environment.awsUrl}${imageName}` : commonImage;
  }
  imagePathS3(imageName, commonImage?){
    return imageName ? `${environment.filesPath}${imageName}` : commonImage;
  }
  getUserDetails(): Observable<User> {
    return this.http
      .get<ApiGenericResponse<User>>(`${environment.apiEndpoint}auth/me`)
      .pipe(
        map((response) => {
            Logging.debug(response);
           // console.log("/auth/me",response)
            return response.data;
        })
      );
  }

  onRegisterUser(formData): Observable<ApiGenericResponse<any>> {
    return this.http
      .post<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}auth/register`,
        formData
      )
      .pipe(
        map((user) => {
          this.authService.saveUserInfo(user.data);
          return user;
        })
      );
  }

  getUserListComments(): Observable<User> {
    return this.http
      .get<ApiGenericResponse<User>>(`${environment.apiEndpoint}common/getUserListComments`)
      .pipe(
        map((response) => {
            Logging.debug(response);
            return response.data;
        })
      );
  }
  getCommentUsers(): Observable<User> {
    return this.http
      .get<ApiGenericResponse<User>>(`${environment.apiEndpoint}common/getCommentUsers`)
      .pipe(
        map((response) => {
            Logging.debug(response);
            return response.data;
        })
      );
  }
  getUsersListStudent(): Observable<User> {
    let type = 'student';
    return this.http
      .get<ApiGenericResponse<User>>(`${environment.apiEndpoint}profile/student-profileType/${type}`)
      .pipe(
        map((response) => {
            Logging.debug(response);
            return response.data;
        })
      );
  }
  onCreateGroup(formData): Observable<ApiGenericResponse<any>> {
    return this.http
      .post<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}/activity/createGroup`,
        formData
      )
      .pipe(
        map((response) => {
          return response
        })
      );
  }

  editGroupData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'activity/editGroupData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  deleteFeedsGroup = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'activity/deleteFeedsGroup';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

}
