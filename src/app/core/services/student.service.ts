import { Injectable } from '@angular/core';
import { Logger } from './logger.service';
import { HttpClient } from '@angular/common/http';
import { ApiGenericResponse } from '../models/response.model';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  StudentProfile,
  DescribeProject,
  Recommendation,
  WritingSample,
  Award,
  Education,
} from '../models/student-profile.model';
import { environment } from 'src/environments/environment';
import {
  Dashboard,
  ProfileCompletion,
} from '../models/student-dashboard.model';

const Logging = new Logger('StudentService');

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) { }
  private wishToExit = new BehaviorSubject(false);
  wishToExit$ = this.wishToExit.asObservable();

  private isProfileCompleted = new BehaviorSubject<StudentProfile>(null);
  isProfileCompleted$ = this.isProfileCompleted.asObservable();

  getStudentProfile(): Observable<StudentProfile> {
    const apiUrl = `${environment.apiEndpoint}profile`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  updatePdfInUser = (data:any): Observable<any> => { 
    const endpoint = environment.apiEndpoint+'profile/updatePdfInUser';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  updatePdfProgramInUser = (data:any): Observable<any> => { 
    const endpoint = environment.apiEndpoint+'profile/updatePdfProgramInUser';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  
  
  resetNewPassword = (data: any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint + 'forget/resetPasswordAction';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  saveStudentProfile(data): Observable<StudentProfile> {
    const apiUrl = `${environment.apiEndpoint}profile`;

    return this.http.put<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        this.isProfileCompleted.next(response.data);
        return response.data;
      })
    );
  }

  saveFutureEducation(data): Observable<StudentProfile> {
    const apiUrl = `${environment.apiEndpoint}profile/student-education-plans`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        this.isProfileCompleted.next(response.data);
        return response.data;
      })
    );
  }

  addIntrestsArea(data): Observable<StudentProfile> {
    const apiUrl = `${environment.apiEndpoint}projectDashboard/interests`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
  addSubjectsArea(data): Observable<StudentProfile> {
    const apiUrl = `${environment.apiEndpoint}projectDashboard/subjects`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  addOutcome(data): Observable<StudentProfile> {
    const apiUrl = `${environment.apiEndpoint}projectDashboard/outcomes`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  addListIntrest(data): Observable<StudentProfile> {
    const apiUrl = `${environment.apiEndpoint}projectDashboard/interestList`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  addListSubject(data): Observable<StudentProfile> {
    const apiUrl = `${environment.apiEndpoint}projectDashboard/subjectsList`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  getOutcomesList(data): Observable<StudentProfile> {
    const apiUrl = `${environment.apiEndpoint}projectDashboard/outcomesList`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  addDescribeProjectSection(data): Observable<DescribeProject> {
    return this.http
      .post<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-project`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  deleteDescribedProject(id) {
    return this.http.delete(`${environment.apiEndpoint}profile/student-project/${id}`)
      .pipe(map(resp => resp));
  }

  updateDescribeProject(data, pId): Observable<DescribeProject> {
    return this.http
      .put<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-project/${pId}`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  updateStudentWork(data, rId): Observable<Recommendation> {
    return this.http
      .put<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-recommendation/${rId}`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  addStudentWork(data): Observable<Recommendation> {
    return this.http
      .post<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-recommendation`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  deleteStudentWork(id) {
    return this.http.delete(`${environment.apiEndpoint}profile/student-recommendation/${id}`)
      .pipe(map(resp => resp));
  }


  addWritingSample(data): Observable<WritingSample> {
    return this.http
      .post<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-writing-sample`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  deleteWritingSample(id) {
    return this.http.delete(`${environment.apiEndpoint}profile/student-writing-sample/${id}`)
      .pipe(map(resp => resp));
  }

  updateWritingSample(data, id): Observable<WritingSample> {
    return this.http
      .put<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-writing-sample/${id}`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  addAwards(data): Observable<Award> {
    return this.http
      .post<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-award`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  updateAward(data, id): Observable<Award> {
    return this.http
      .put<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-award/${id}`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  deleteAwards(id) {
    return this.http.delete(`${environment.apiEndpoint}profile/student-award/${id}`)
      .pipe(map(resp => resp));
  }

  redirectToDashboard(exit) {
    this.wishToExit.next(exit);
  }

  changePassword(passwordData: any) {
    return this.http.post(`${environment.apiEndpoint}common/resetOldPassword`, passwordData)
      .pipe(map(resp => resp));
  }

  getFaqCategory() {
    const apiUrl = `${environment.apiEndpointNew}public/faqcategory`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getFaqData() {
    const apiUrl = `${environment.apiEndpointNew}public/faq`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getReview() {
    const apiUrl = `${environment.apiEndpointNew}public/review`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }
  getUserReward(data: any) {
    return this.http.post(`${environment.apiEndpointNew}public/userReward`, data)
      .pipe(map(resp => resp));
  }

  getAdvisors() {
    const apiUrl = `${environment.apiEndpointNew}public/advisors`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }


  getDirectors() {
    const apiUrl = `${environment.apiEndpointNew}public/directors`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }


  // getTeam() {
  //   const apiUrl = `${environment.apiEndpointNew}public/team`;
  //   return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
  //     map((response) => {
  //       Logging.debug(response);
  //       return response.data;
  //     })
  //   );
  // }

  getTeam() {
    const apiUrl = environment.apiEndpointNew + 'public/listteam';
    // return this.http.get(apiUrl).pipe(
    //   map((response) => {
    //     return response;
    //   })
    // );
    return this.http.get(apiUrl).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getTerms() {
    const apiUrl = `${environment.apiEndpointNew}public/terms`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }


getSequelEventData() {


    const apiUrl = environment.apiEndpointNew + 'public/listAllsequelEvents';
    return this.http.get(apiUrl).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  



  getPrivacy() {
    const apiUrl = `${environment.apiEndpointNew}public/privacy`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getCollegeyLogo() {
    const apiUrl = `${environment.apiEndpointNew}public/collegelogo`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getUniversityLogo() {
    const apiUrl = `${environment.apiEndpointNew}public/universitylogo`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }


  getFooterLogo() {
    const apiUrl = `${environment.apiEndpointNew}public/edistartlogo`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getFollowUser(id) {
    const apiUrl = `${environment.apiEndpointNew}user/activity/follow/${id}`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  getUnFollowUser(id) {
    const apiUrl = `${environment.apiEndpointNew}user/activity/unfollow/${id}`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  postAskAQues(data: any) {
    return this.http.post(`${environment.apiEndpointNew}user/questionsAndAnswer/QNA/askQuestion`, data)
      .pipe(map(resp => resp));
  }

  getAnswerQuesId(data: any) {
    return this.http.post(`${environment.apiEndpointNew}user/questionsAndAnswer/Myquetions`, data).pipe(map(resp => resp));
  }

  getQuesAnsDataAll(data: any) {
    const apiUrl = `${environment.apiEndpointNew}user/questionsAndAnswer/QNA`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getQuestionsByTagName(data) {
    const apiUrl = `${environment.apiEndpointNew}user/questionsAndAnswer/questionsByTag`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  updateQuestions(data) {
    const apiUrl = `${environment.apiEndpointNew}user/questionsAndAnswer/QNA/updateQuestions`;
    return this.http.post<ApiGenericResponse<any>>(apiUrl, data).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  postAnswers(data: any, questionId: string) {
    return this.http.post(`${environment.apiEndpointNew}user/questionsAndAnswer/QNA/answer`, data)
      .pipe(map(resp => resp));
  }

  likeDislikeAns1(data: any) {
    const apiUrl = `${environment.apiEndpointNew}user/questionsAndAnswer/QNA/answer/likedislike`;
    return this.http.post(apiUrl, data)
      .pipe(map(resp => resp));
  }

  likeDislikeAns(data: any, questionId: string) {
    return this.http.post(`${environment.apiEndpointNew}user/questionsAndAnswer/QNA/answer/likedislike/${questionId}`, data)
      .pipe(map(resp => resp));
  }

  removeQuestion(id: any) {
    return this.http.get(`${environment.apiEndpointNew}user/questionsAndAnswer/QNA/delQuestion/${id}`)
      .pipe(map(resp => resp));
  }

  removeAnswer(id: any) {
    return this.http.get(`${environment.apiEndpointNew}user/questionsAndAnswer/QNA/delAnswer/${id}`)
      .pipe(map(resp => resp));
  }

  getMyBadge(userId: any) {
    return this.http.post(`${environment.apiEndpoint}admin/assignbadge/badgeList/`, userId)
      .pipe(map(resp => resp));
  }


  /* Start Reward Masters APIs */

  getRewardMasterList() {
    const apiUrl = `${environment.apiEndpoint}rewardspoint/`;
    return this.http.get<ApiGenericResponse<any>>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );

  }

  createNewRewardMaster() {
    let userId = { "rewardName": "ProjectPartB" };
    return this.http.post(`${environment.apiEndpoint}rewardspoint/create`, userId)
      .pipe(map(resp => resp));

  }


  checkRewardPoints(checkData: any) {
    return this.http.post(`${environment.apiEndpoint}rewardspoint/checkCount`, checkData)
      .pipe(map(resp => resp));
  }

  updateProfileRewardPoints = (data: any): Observable<any> => {
    const endpoint = environment.apiEndpoint + 'rewardspoint/updateProfileRewardPoints';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  createCreditRewardPoint(checkData: any) {
    return this.http.post(`${environment.apiEndpoint}rewardspoint/addNewRewardPoints`, checkData)
      .pipe(map(resp => resp));
  }

  removeCreditRewardPoint(checkData: any) {
    return this.http.post(`${environment.apiEndpoint}rewardspoint/minusRewardPoints`, checkData)
      .pipe(map(resp => resp));
  }


  getUserRewardPoints(userId: any) {
    return this.http.post(`${environment.apiEndpoint}rewardspoint/userRewardPoints`, userId)
      .pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getPaymentHistory(userId: any) {
    return this.http.post(`${environment.apiEndpoint}paymentHistory/userPaymentHistory`, userId)
      .pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getRewardRedeemedSettingData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'admin/mentor/fetchSingleRewardRedeemedSettingData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  /* End Reward Masters APIs */

  //Dynamic title//

  getTitleData = (): Observable<any> => {
    const apiUrl = environment.apiEndpointNew + 'public/meetOurTeam/getTitle';
    console.log(apiUrl);
    
    return this.http.get(apiUrl).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

}
