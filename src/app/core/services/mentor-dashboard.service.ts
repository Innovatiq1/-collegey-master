import { Injectable } from '@angular/core';
import { ApiGenericResponse } from '../models/response.model';
import { MentorDashboard, Project, EnrollProjects } from '../models/student-dashboard.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Logger } from './logger.service';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('MentorDashboardService');

@Injectable({
  providedIn: 'root',
})
export class MentorDashboardService {
  constructor(private http: HttpClient) {}

  updateProjectfieldData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/updateProjectfieldData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  
  updateInvitationProjectData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/updateInvitationProjectData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getDashboardDetail(): Observable<MentorDashboard> {
    return this.http
      .get<ApiGenericResponse<MentorDashboard>>(
        `${environment.apiEndpoint}profile/mentor-dashboard`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  addMember(data): Observable<MentorDashboard> {
    return this.http
      .post<ApiGenericResponse<MentorDashboard>>(
        `${environment.apiEndpoint}profile/create/member`,data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  getMentorPerks(): Observable<MentorDashboard> {
    return this.http
      .get<ApiGenericResponse<MentorDashboard>>(
        `${environment.apiEndpoint}profile/mentor-perks`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  addtoFavroriteperk = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/addtoFavroriteperk';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  addToFavoriteOpportunities = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/addToFavoriteOpportunities';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  // User Banner 

  getCurrentUserData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/getCurrentUserData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };
   
  getProjectFeesData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'admin/mentor/fetchSingleProjectFeesData';
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

  getAgreegateData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/agreegate-terms';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getAgreementData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/agreement-terms-conditions';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getMentorResources = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/mentor-resource';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getMentorArticle = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/mentor-article';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getResourcesTitle = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/resource-title';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getMentorCurated = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/mentor-curated';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getMentorFile = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/mentor-file';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  addTestimonial = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/add-mentortestimonial';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  addContactCollegey = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/add-ContactCollegey';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  addNewHostEvent = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/add-NewHostEvent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateHostEventData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/update-HostEvent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getMentorHostevent = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/mentor-hostevent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getMentorHosteventWithid = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/mentor-hosteventWithid';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  deleteMentorHosteventWithid = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/mentor-deleteeventWithid';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getOpportunities(): Observable<MentorDashboard> {
    return this.http
      .get<ApiGenericResponse<MentorDashboard>>(
        `${environment.apiEndpoint}profile/findopportunities`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  //  Start Get Admin Mentor Perks List Function
  getAdminMentorPerks = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/mentor-admin-perks';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };
 //  End Get Admin Mentor Perks List Function

//  Start Get Admin Collegey Opportunity List Function

getAdminCollegeyOpportunity = (data:any): Observable<any> => {
  const endpoint = environment.apiEndpoint+'profile/admin-collegey-opportunity';
  return this.http.post(endpoint, data).pipe(
    catchError((err) => {
      return throwError(err);
    })
  ); 
};

//  End Get Admin  Collegey Opportunity List Function

uploadBanner(data){
  return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/upload`, data).pipe(
    map((response) => {
      Logging.debug(response);
      return response;
    }));  
}

uploadMultipleBanner = (data:any): Observable<any> => {
  const endpoint = environment.apiEndpoint+'common/upload-allbanner';
  return this.http.post(endpoint, data).pipe(
    catchError((err) => {
      return throwError(err);
    })
  ); 
};

}
