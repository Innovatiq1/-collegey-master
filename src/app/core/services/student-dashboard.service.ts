import { Injectable } from '@angular/core';
import { ApiGenericResponse } from '../models/response.model';
import { Dashboard, Project, EnrollProjects } from '../models/student-dashboard.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Logger } from './logger.service';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('StudentDashboardService');

@Injectable({
  providedIn: 'root',
})
export class StudentDashboardService {
  constructor(private http: HttpClient) {}

  fetchSidebarQuetion = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/fetchSidebarQuetion';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getCurrentUserDataFetch = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/profile/getCurrentUserDataFetch';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getMentors(): Observable<any> {
    const apiUrl = environment.apiEndpoint + 'admin/adminUserListing/mentors';
    return this.http
      .get<ApiGenericResponse<any>>(apiUrl)
      .pipe(map((response) => response.data));
  }

  getHomepageContentData = (filter:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/profile/getHomeContentData';
    return this.http.get(endpoint,{params: filter}).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateReviewproject = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/updateReviewproject';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);   
      })
    );
  };


  updateReviewprogram = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/updateReviewprogram';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };


  updateProjectfieldData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/updateProjectfieldData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getAllMentorUserData = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/profile/getAllMentorUserData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  updateBannerImage = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/profile/updateBannerImage';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getDashboardDetail(): Observable<Dashboard> {
    return this.http
      .get<ApiGenericResponse<Dashboard>>(
        `${environment.apiEndpoint}profile/student-dashboard`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  getDashboardDetailNew(): Observable<Dashboard> {
    return this.http
      .get<ApiGenericResponse<Dashboard>>(
        `${environment.apiEndpoint}profile/student-mainDashboard`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  getDashboardHeaderDetail(): Observable<Dashboard> {
    return this.http
      .get<ApiGenericResponse<Dashboard>>(
        `${environment.apiEndpoint}profile/student-dashboard-header`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  saveDashboardQuestionnaire(data) {
    return this.http.put<ApiGenericResponse<any>>(
      `${environment.apiEndpoint}profile/student-questionnaire`,
      data
    ).pipe(map(response => {
      Logging.debug(response);
      return response.data;
    }));
  }

  // Upload The Multiple Banner Image

  uploadMultipleBanner = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'common/upload-allbanner';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  
  choiceUserBannerImage = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/choiceUserBannerImage';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };
  
  // formData => project id

  onSignUpProject(formData): Observable<EnrollProjects> {
    return this.http.post<ApiGenericResponse<any>>(environment.apiEndpoint +
      'profile/student-project-signup', formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }

  saveProjectIdea(formData) {
    return this.http.post<ApiGenericResponse<any>>(environment.apiEndpoint +
      'profile/student-project-idea', formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }

  onAddWatchlistProject(data): Observable<EnrollProjects> {
    return this.http.post<ApiGenericResponse<any>>(environment.apiEndpoint +
      'profile/addprojecttowatchlist', data).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }

  onRemoveWatchlistProject(data): Observable<EnrollProjects> {
    return this.http.post<ApiGenericResponse<any>>(environment.apiEndpoint +
      'profile/removeprojectfromwatchlist', data).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }

  CheckProjectAvilableSloat = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/CheckProjectAvilableSloat';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getProjectIcreatedDatais(data:any) {
    return this.http.post(`${environment.apiEndpoint}admin/project/fetchproject`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  getAllCompletedProjects(data:any) {
    return this.http.post(`${environment.apiEndpoint}admin/project/fetchproject`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  getAllProjectByMentorsCount(data:any) {
    return this.http.post(`${environment.apiEndpoint}admin/project/fetchproject`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  getAllProjectByCollegeyCount(data:any) {
    return this.http.post(`${environment.apiEndpoint}admin/project/fetchproject`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
  programsPaymentDoneuser(data:any) {
    return this.http.post(`${environment.apiEndpoint}booking/user`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }


  getProjectByImpactPartners(){
    return this.http
    .get<ApiGenericResponse<Dashboard>>(
      `${environment.apiEndpoint}admin/project?projectType=impact-partner`
    )
    .pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getAllProjectInProgress(){
    return this.http
    .get<ApiGenericResponse<Dashboard>>(
      `${environment.apiEndpoint}admin/project?projectStatus=pending`
    )
    .pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }
  
  getProjectAddWatchlist(id:string){
    var watchlist= "add";
    return this.http
    .get<ApiGenericResponse<Dashboard>>(
      `${environment.apiEndpointNew}user/activity/watchlist/${watchlist}/${id}`
    )
    .pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }
  
  onCreateStudentForm(formData): Observable<EnrollProjects> {
    return this.http.post<ApiGenericResponse<any>>(environment.apiEndpoint +
      'admin/project', formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }
  getProjectPayment(id:string) {
    return this.http
      .get<ApiGenericResponse<Dashboard>>(
        `${environment.apiEndpoint}booking/checkout-session/${id}`
      )
      .pipe( 
        map((response) => {
          Logging.debug(response);
          return response;
        })
      );
  }
  getProgramsPayment(id:string) {
    return this.http
      .get<ApiGenericResponse<Dashboard>>(
        `${environment.apiEndpoint}booking/checkout-session-progrms/${id}`
      )
      .pipe( 
        map((response) => {
          Logging.debug(response);
          return response;
        })
      );
  }


  saveStudentEvent(formData): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/event`, formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }
  updateStudentEvent(formData): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/event/updateEvent`, formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }
  saveAttendEvent(data): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/event/attend`, data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }
  saveFollower(data): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/event/Follower`, data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }

  saveunFollower = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpointNew+'user/event/UnFollower';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  saveUniverCityFollower(data): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/event/univerCityFollower`, data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }
  
  getAllStudentEvents(docLimit): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/event/eventData`, docLimit).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }
  getAllStudentEventsByMonth(docLimit): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/event/eventDataByMonth`, docLimit).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }
  getAllEventsByUser(docLimit): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/event/eventDataByUser`, docLimit).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }
  // 
  uploadBanner(data){
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/upload`, data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));  
  }

  addTestimonial = (data:any): Observable<any> => { 
    const endpoint = environment.apiEndpoint+'admin/review/add-studenttestimonial';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

}
