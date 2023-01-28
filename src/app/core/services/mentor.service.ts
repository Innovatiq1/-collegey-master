import { Injectable,EventEmitter  } from '@angular/core';
import { Logger } from './logger.service';
import { HttpClient } from '@angular/common/http';
import { ApiGenericResponse } from '../models/response.model';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, BehaviorSubject,throwError, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MentorProfile, MentorsProfile } from '../models/student-profile.model';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('MentorService');

@Injectable({
  providedIn: 'root',
})
export class MentorService {
  constructor(private http: HttpClient) {}
  private wishToExit = new BehaviorSubject(false);
  wishToExit$ = this.wishToExit.asObservable();

  private isProfileCompleted = new BehaviorSubject<MentorProfile>(null);
  isProfileCompleted$ = this.isProfileCompleted.asObservable();

  getMentorProfile(): Observable<MentorProfile> {
    const apiUrl = `${environment.apiEndpoint}profile/mentor`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getMentorUserDataFetch = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/profile/getMentorUserDataFetch';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  saveMentorProfile(data): Observable<MentorProfile> {
    const apiUrl = `${environment.apiEndpoint}profile/mentor`;
    return this.http.put<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        this.isProfileCompleted.next(response.data);
        return response.data;
      })
    );
  }

  redirectToDashboard(exit) {
    this.wishToExit.next(exit);
  }
  getMentor() {
    const apiUrl = `${environment.apiEndpointNew}user/mentor/getMentor`;
    return this.http
      .get(apiUrl)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getUniv() {
    const apiUrl = `${environment.apiEndpointNew}user/mentor/getUniversities`;
    return this.http
      .get(apiUrl)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  
// getMentorList() {
//   const apiUrl = `${environment.apiEndpoint}admin/adminUserListing?type=mentor`;
//   console.log("=====",apiUrl)
//   return this.http
//     .get(apiUrl)
//     .pipe(
//       map((response) => {
//         return response;
//       })
//     );
// }
getMentorList(filterName) { 
  const apiUrl = `${environment.apiEndpointNew}user/mentor/getUser?filterName=${filterName}`;
  return this.http
    .get(apiUrl)
    .pipe(
      map((response) => {
        return response;
      })
    );
}

  updateMentorProfileStep01 = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/updateMentorProfileStep01';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateMentorProfileStep02 = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/updateMentorProfileStep02';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  mentorId = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/getMentor';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateMentorProfileStep03 = (data:any): Observable<any> => {
    console.log('data-=-=-=-=-=-profile-=-=-=->',data)
    const endpoint = environment.apiEndpoint+'profile/updateMentorProfileStep03';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateMenprojectStatus = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/updateMenprojectStatus';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  invokeProfile = new EventEmitter(); 
  subsVar: Subscription;
  onProfileUpdate() {    
    this.invokeProfile.emit(); 
  } 

}
