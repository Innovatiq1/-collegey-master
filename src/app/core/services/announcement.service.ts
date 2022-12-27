import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject,Subject,throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Logger } from 'src/app/core/services/logger.service';
import { map } from 'rxjs/operators';
import { ApiGenericResponse } from '../models/response.model';
import { AuthService } from './auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('AnnouncementService');

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor(private http: HttpClient) { }

  getAnnouncements(obj) {
    return this.http.post(`${environment.apiEndpoint}announcement/getAnnouncementByUserType`, obj).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }
}
