import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CareerService {

  private defaultUrl: string = environment['apiEndpoint'];

  constructor(
    private http: HttpClient,
  ) { }

  createCareerProfile(formData): Observable<any> {
    const apiUrl = this.defaultUrl + 'career/create';
    return this.http.post<any>(apiUrl, formData).pipe(map(response => {
      console.log("Career Profile",response.data);
      return response.data;
    }));
  }

  //dynamic
    //dynamic
    getAllData = (data: any): Observable<any> => {
      const apiUrl = environment.apiEndpointNew + 'public/collegeyAtCareer/getAllData';
      return this.http.get(apiUrl, { params: data }).pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
    };

}
