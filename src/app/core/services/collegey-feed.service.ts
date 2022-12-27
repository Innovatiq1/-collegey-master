import { Injectable } from '@angular/core';
import { ApiGenericResponse } from '../models/response.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Logger } from './logger.service';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('CollegeyFeedService');

@Injectable({
  providedIn: 'root'
})
export class CollegeyFeedService {

  constructor(private http: HttpClient) { }
  // create post
  createFeedComment(feedId,comment):Observable<any>{
    return this.http.post<ApiGenericResponse<any>>(environment.apiEndpoint +
      `collegeyFeed/postComment/${feedId}`, comment).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }
  // like post
  LikeFeedData(feedId,comment):Observable<any>{
    return this.http.post<ApiGenericResponse<any>>(environment.apiEndpoint +
      `collegeyFeed/like/${feedId}`, comment).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }
    // dislike post
    DisLikeFeedData(feedId,comment):Observable<any>{
      return this.http.put<ApiGenericResponse<any>>(environment.apiEndpoint +
        `collegeyFeed/dislike/${feedId}`, comment).pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        }));
    }

  //edit feed comment
  editFeedPostComment = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpointNew+'user/collegeyFeed/updateFeedComment';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //delete feed comment

  deleteFeedPostComment (data: any): Observable<any> {
    const endpoint = environment.apiEndpointNew+'user/collegeyFeed/removeFeedComment';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  
  // share post
  shareFeedData(feedId,comment):Observable<any>{
    return this.http.post<ApiGenericResponse<any>>(environment.apiEndpoint +
      `collegeyFeed/share/${feedId}`, comment).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;   
      }));
  }
  inviteSave(formData): Observable<any> {
    //debugger
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/invite/sendInvite`, formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;  
      }));
  }
  recommendSave(formData): Observable<any> {
    //debugger
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/recommend`, formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }
  futureSave(formData): Observable<any> {
    debugger
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/activity/groups/future`, formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }

  getFeedById(docLimit): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/collegeyFeed`, docLimit).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }


  // get all groups
  
  getGroups = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpointNew+'user/activity/allGroupList';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

// get all groups pagination
  getGroupsByPagination(pageNo,size) {
    const apiUrl = `${environment.apiEndpointNew}user/activity/group/getpagination/all?pageNo=${pageNo}&size=${size}`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  // get groups by userid
  getGroupListBasedonUserId(filterName): Observable<User> {
    return this.http
      .get<ApiGenericResponse<User>>(`${environment.apiEndpoint}activity/group?filterName=${filterName}`)
      .pipe(
        map((response) => {
            Logging.debug(response);
            return response.data;
        })
      );
  }
// create post
  postFeedData(data: any) {
      return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpointNew}user/collegeyFeed`, data).pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        }));
  }

  addNewGroupFeedPost = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpointNew+'user/collegeyFeed/addNewGroupFeedPost';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  addNewFeedPost = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpointNew+'user/collegeyFeed/addNewFeedPost';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  
  updateFeedPost = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpointNew+'user/collegeyFeed/updateFeedPost';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  deleteFeedPost (data): Observable<any> {
    const endpoint = environment.apiEndpointNew+'user/collegeyFeed/deletePostById';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  // get groups post by id
  getGroupFeedById(docLimit): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpoint}collegeyFeed/groupWiseData`, docLimit).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }
  // get groups post by id
  getGroupFeedById1(docLimit): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpoint}collegeyFeed/groupWiseData`, docLimit).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      }));
  }
  // get groups by id
  getEachGroup(id): Observable<User> {
    return this.http
      .get<ApiGenericResponse<User>>(`${environment.apiEndpoint}/activity/eachGroup/${id}`)
      .pipe(
        map((response) => {
            Logging.debug(response);
            return response.data;
        })
      );
  }
  //add memebers in group
  addMembersInGroup(id,formData): Observable<any> {
    debugger
    return this.http.put<ApiGenericResponse<any>>(`${environment.apiEndpoint}activity/updateGroupMembers/${id}`, formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }
  //request to join in group
  requestToJoin(id,formData): Observable<any> {
    debugger
    return this.http.put<ApiGenericResponse<any>>(`${environment.apiEndpoint}activity/requestToJoin/${id}`, formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      }));
  }
    //accept to join in group
    acceptRequest(id,formData): Observable<any> {
        return this.http
        .put<ApiGenericResponse<User>>(`${environment.apiEndpoint}/activity/acceptRequestToJoin/${id}`,formData )
        .pipe(
          map((response) => {
              Logging.debug(response);
              return response.data;
          })
        );
    }
      //reject to join in group
      rejectRequest(id,formData){
        return this.http
        .put<ApiGenericResponse<User>>(`${environment.apiEndpoint}/activity/rejectRequestToJoin/${id}`,formData )
        .pipe(
          map((response) => {
              Logging.debug(response);
              return response.data;
          })
        );
    }

    getAcademicBoxData = (data:any): Observable<any> => {
      const apiUrl = environment.apiEndpoint + 'admin/collegeyFeed/getAcademy';
      return this.http.get(apiUrl,{params: data}).pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
    }

    getMasterQuestion = (data:any): Observable<any> => {
      const apiUrl = environment.apiEndpoint + 'admin/collegeyFeed/getMasterQuestion';
      return this.http.get(apiUrl,{params: data}).pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
    }

    getAnswerData = (data:any): Observable<any> => {
      const apiUrl = environment.apiEndpoint + 'admin/collegeyFeed/getAnswer';
      return this.http.post(apiUrl, data).pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
    }
  
}
