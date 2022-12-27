import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Logger } from 'src/app/core/services/logger.service';
import { map } from 'rxjs/operators';
import { ApiGenericResponse } from '../models/response.model';
import { PublicProfile } from '../models/student-dashboard.model';

const Logging = new Logger('ProfileService');

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getPublicProfile(
    studentSlug
  ): Observable<ApiGenericResponse<PublicProfile>> {
    return this.http
      .get<ApiGenericResponse<PublicProfile>>(
        `${environment.apiEndpoint}profile/student-profile/${studentSlug}`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response;
        })
      );
  }
}
