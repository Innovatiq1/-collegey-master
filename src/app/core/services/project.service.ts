import { Injectable } from '@angular/core';
import { ApiGenericResponse } from '../models/response.model';
import { Dashboard, Project, EnrollProjects } from '../models/student-dashboard.model';
import { Banner } from '../models/banner.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Logger } from './logger.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('ProjectDashboardService');

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  headers_object:any = {};
  httpOptions:any;
  setHeader(){
    this.headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.httpOptions = {
      headers: this.headers_object
    };
    return this.httpOptions;
  }
  constructor(private http: HttpClient) {}


  getProjectFeesData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'admin/mentor/fetchSingleProjectFeesData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  
  // Project Payment Api 

  payForpaidProject = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/payForpaidProject';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  // formData => project id

  projectdashboard_detail(data:any) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  deleteProjectPost(data:any) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/deleteProjectpost`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
  deleteProgramPost(data:any) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/deleteProgrampost`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }


  getAllPendingProjectByStudent(data:any) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/getAllPendingProjectByStudent`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  addNewProject = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/addNewProject';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  pogramesList(data:any) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/progamesList`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
  completedpogramesList(data:any) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/completedprogamesList`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
  addNewProgramPost = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/addNewProgramPost';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };



  addNewProjectPost = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/addNewProjectPost';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateProjectPost = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/updateProjectPost';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };


  updateProgramPost = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/updateProgramPost';
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


  updateMenprogramStatus = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/updateMenprogramStatus';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  
  addNewProjectPostLike = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/addNewProjectPostLike';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  addNewProjectEvent = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/addNewProjectEvent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  editNewProjectEvent = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/EditNewProjectEvent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };


  addNewProgramEvent = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/addNewProgramEvent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  editNewProgramEvent = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/EditNewProgramEvent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };


  RemoveProjectEvent = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/RemoveProjectEvent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  RemoveProgramEvent = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/RemoveProgramEvent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };


  UserProjectSuccess = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/UserProjectSuccess';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  
  updateProgramPaymentStatus = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'booking/updateProgramPaymentStatus';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  UserProgramSuccess = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/UserProgramSuccess';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateProjectPaymentStatus = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/updateProjectPaymentStatus';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  project_detail(project_id) {
    return this.http.get(`${environment.apiEndpoint}projectDashboard/${project_id}`).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  program_detail(program_id) {
    return this.http.get(`${environment.apiEndpoint}projectDashboard/getProgram/${program_id}`).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }


  allchat(project_id) {
    return this.http.get(`${environment.apiEndpoint}projectDashboard/chat/${project_id}`).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
  allchatProgram(project_id) {
    return this.http.get(`${environment.apiEndpoint}projectDashboard/programchat/${project_id}`).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }


  getAllFeeds(project_id) {
    return this.http.get(`${environment.apiEndpoint}projectDashboard/feed/${project_id}`).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
  postchat(project_id,data) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/chat/${project_id}`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
  postprogramchat(project_id,data) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/programchat/${project_id}`,data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  // postfile(data,source) {
  //   return this.http.post('http://beta.api.collegey.com/api/uploadfiles',data,source,this.setHeader()).toPromise();
  // }
  postChatfile(project_id,file) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/chat/file/${project_id}`,file).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
  programPostfile(program_id,file) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/file/program/${program_id}`,file).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }


  postfile(project_id,file) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/file/${project_id}`,file).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  getAllProjectFiles(project_id) {
    return this.http.get(`${environment.apiEndpoint}projectDashboard/file/${project_id}`).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
  getAllProgramFiles(project_id) {
    return this.http.get(`${environment.apiEndpoint}projectDashboard/file/program/${project_id}`).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }


  deleteProjectFile(data) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/delFileById`, data)
    .pipe(map((response) => {
     
      Logging.debug(response);
      return response;
    })
    );
  }
  deleteProgramFile(data) {
    return this.http.post(`${environment.apiEndpoint}projectDashboard/program/delFileById`, data)
    .pipe(map((response) => {
     
      Logging.debug(response);
      return response;
    })
    );
  }


  uploadImage(formData): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiEndpoint}uploadfiles`,
        formData
      )
      .pipe(
        map((response) => {
          Logging.debug(response.files);
          return response.files;
        })
      );
  }

  inviteProjectLink = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/invitee';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  inviteProgramLink = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/inviteeProgram';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };


  fetchrefralProject = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'projectDashboard/fetchrefralProject';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getBanners = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'bannerImage/getBanners';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

}
