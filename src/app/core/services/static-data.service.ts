import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Logger } from 'src/app/core/services/logger.service';
import { map } from 'rxjs/operators';
import { AppConstants } from 'src/app/shared/constants/app.constants';
// import { Countries, Cities, State } from '../models/staticData.model';
import { FormGroup } from '@angular/forms';
import { ApiGenericResponse } from '../models/response.model';
import { Cities, State, Countries } from '../models/static-data.model';
import { Question } from '../models/common.model';

const Logging = new Logger('StaticDataService');

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  defaultUrl = environment.apiEndpoint;
  publicUrl = environment.apiEndpointNew;
  constructor(private http: HttpClient) {}

  _getStaticDataList(): Observable<any> {
    const endPointUrl = this.defaultUrl + 'master/get-static-data-list';
    return this.http.get<ApiGenericResponse<any>>(endPointUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getCountries(): Observable<Countries[]> {
    const endPointUrl = this.defaultUrl + 'master/country';
    return this.http.get<ApiGenericResponse<any>>(endPointUrl).pipe(
      map((response) => {
        this.getCountryPhoneCode(response.data);
        Logging.debug(response);
        return response.data;
      })
    );
  }

  publicgetCountries(): Observable<Countries[]> {
    const endPointUrl = this.publicUrl + 'public/country';
    return this.http.get<ApiGenericResponse<any>>(endPointUrl).pipe(
      map((response) => {
        this.getCountryPhoneCode(response.data);
        Logging.debug(response);
        return response.data;
      })
    );
  }

  getCountryPhoneCode(countryData) {
    const phoneCodeArray = countryData
      .map((item) => {
        return {
          label: `${item.phone_code} ${item.name}`,
          value: item.phone_code
        };
      });
    localStorage.setItem(
      AppConstants.KEY_COUNTRY_PHONE_CODE,
      JSON.stringify(phoneCodeArray)
    );
  }

  getStates(countryId): Observable<State[]> {
    const endPointUrl = this.defaultUrl + 'master/state/' + countryId;
    let headers = new HttpHeaders();
    headers = headers.set('no-auth', 'true');
    return this.http
      .get<ApiGenericResponse<any>>(endPointUrl, { headers })
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  getAllStates(): Observable<State[]> {
    const endPointUrl = this.defaultUrl + 'master/states';
    return this.http
      .get<ApiGenericResponse<any>>(endPointUrl)
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  getCities(stateId): Observable<Cities[]> {
    const endPointUrl = this.defaultUrl + 'master/city/' + stateId;
    let headers = new HttpHeaders();
    headers = headers.set('no-auth', 'true');
    return this.http
      .get<ApiGenericResponse<any>>(endPointUrl, { headers })
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }
  getCity(stateId): Observable<Cities[]> {
    const endPointUrl = this.defaultUrl + 'master/cities/' + stateId;
    let headers = new HttpHeaders();
    headers = headers.set('no-auth', 'true');
    return this.http
      .get<ApiGenericResponse<any>>(endPointUrl, { headers })
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  saveCountries(countries) {
    localStorage.setItem(
      AppConstants.KEY_COUNTRIES_DATA,
      JSON.stringify(countries)
    );
  }
  _saveStaticDataList(data) {
    localStorage.setItem(AppConstants.KEY_STATIC_DATA, JSON.stringify(data));
  }

  getStudentOnBoardingForm() {
    return this.http.get<FormGroup>('/assets/form/student-onboarding.json');
  }

  getStudentDashboardQuestions(): Observable<ApiGenericResponse<Question[]>> {
    return this.http.get<ApiGenericResponse<Question[]>>(
      '/assets/form/student-dashboard.questions.json'
    );
  }

//   uploadImage(data): Observable<any> {
//     const endPointUrl = this.defaultUrl + 'master/upload-files';
//     return this.http.post<any>(endPointUrl, data)
//         .pipe(map(response => {
//             Logging.debug(response.files);
//             return response.files;
//         }));
// }

}
