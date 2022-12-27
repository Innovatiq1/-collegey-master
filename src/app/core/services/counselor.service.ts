import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Logger } from './logger.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ApiGenericResponse } from '../models/response.model';
import { Observable } from 'rxjs';
import { CounselorDetail } from '../models/counselor.model';

const Logging = new Logger('CounselorService');

@Injectable({
  providedIn: 'root'
})
export class CounselorService {

  constructor(private http: HttpClient) { }

  onSendInvitation(formData): Observable<any> {
    return this.http
    .post<ApiGenericResponse<any>>(
      `${environment.apiEndpoint}profile/send-invitation`,
      formData
    )
    .pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getCounselorDetails(): Observable<CounselorDetail> {
    return this.http.get<ApiGenericResponse<any>>(`${environment.apiEndpoint}profile/counsellor-dashboard`).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }


}
