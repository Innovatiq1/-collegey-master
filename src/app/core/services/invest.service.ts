import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class InvestService {

  private defaultUrl: string = environment['apiEndpoint'];

  constructor(
    private http: HttpClient,
  ) { }

  createInvestProfile(formData): Observable<any> {
    const apiUrl = this.defaultUrl + 'invest/create';
    return this.http.post<any>(apiUrl, formData).pipe(map(response => {
      console.log("Invest",response.data);
      return response.data;
    }));
  }

  createCollegyPartner(formData): Observable<any> {
    const apiUrl = this.defaultUrl + 'collegeyPartner/create';
    return this.http.post<any>(apiUrl, formData).pipe(map(response => {
      console.log("Invest",response.data);
      return response.data;
    }));
  }

  createCollegeyFund(formData): Observable<any> {
    const apiUrl = this.defaultUrl + 'collegefund/create';
    return this.http.post<any>(apiUrl, formData).pipe(map(response => {
      console.log("Invest",response.data);
      return response.data;
    }));
  }

  //dynamic

  getAllData = (data: any): Observable<any> => {
    const apiUrl = environment.apiEndpointNew + 'public/collegeyInInvest/getAllData';
    return this.http.get(apiUrl, { params: data }).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getFundAllData = (data: any): Observable<any> => {
    const apiUrl = environment.apiEndpointNew + 'public/collegeyInFund/getAllData';
    return this.http.get(apiUrl, { params: data }).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getParnerAllData = (data: any): Observable<any> => {
    const apiUrl = environment.apiEndpointNew + 'public/collegeyWithPartner/getAllData';
    return this.http.get(apiUrl, { params: data }).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

}

