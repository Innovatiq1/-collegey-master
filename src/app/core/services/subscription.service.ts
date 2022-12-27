import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private defaultUrl: string = environment['apiEndpoint'];

  constructor(
    private http: HttpClient,
  ) { }

  newsLetter(formData): Observable<any> {
    const apiUrl = this.defaultUrl + 'subscription/newsLetter';
    return this.http.post<any>(apiUrl, formData).pipe(map(response => {
      console.log("Subscribe",response);
      return response;
    }));
  }
}
