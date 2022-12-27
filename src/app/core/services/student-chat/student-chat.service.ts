import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentChatService {

  constructor(private http: HttpClient) { }

  getAllUserDeta = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'studentChat/userListletes';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  addChatnewmsg = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'studentChat/addChatnewmsg';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  fetchChatnewmsg = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'studentChat/fetchChatnewmsg';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

}
