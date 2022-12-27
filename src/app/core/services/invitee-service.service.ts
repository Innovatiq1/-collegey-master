import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Logger } from 'src/app/core/services/logger.service';
import { map } from 'rxjs/operators';
import { ApiGenericResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class InviteeServiceService {

  private defaultUrl: string = environment['apiEndpoint'];
  constructor(
    private http: HttpClient,
  ) { }

  createInvitee(formData): Observable<any> {
    const apiUrl = this.defaultUrl + 'invitee/';
    return this.http.post<any>(apiUrl, formData).pipe(map(response => {
      console.log("Response",response.data);
      return response.data;
    }));
  }
  
  activateInvitee(formData): Observable<any> {
    const apiUrl = this.defaultUrl + 'invitee/activate';
    return this.http.post<any>(apiUrl, formData).pipe(map(response => {
      console.log("Response",response.data);
      return response.data;
    }));
  }

  fetchRefralData(formData): Observable<any> {
    const apiUrl = environment.apiNewEndpoint + 'forget/invitee/fetchrefral';
    return this.http.post<any>(apiUrl, formData).pipe(map(response => {
      return response;
    }));
  }

}
