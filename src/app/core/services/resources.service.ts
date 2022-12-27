import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Logger } from 'src/app/core/services/logger.service';
import { map } from 'rxjs/operators';
import { ApiGenericResponse } from '../models/response.model';
import { Resource, GenericResources, AllResources } from '../models/resources.model';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('StaticDataService');

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    ) {}
  
    getResourcesTitle = (data:any): Observable<any> => {
      const endpoint = environment.apiEndpoint+'profile/resource-title';
      return this.http.post(endpoint, data).pipe(
        catchError((err) => {
          return throwError(err);
        })
      ); 
    };

  // Get Student Resources

  getNewsResourcesData = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/resources/getNewsResourcesData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getNewsArticle = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/resources/getNewsArticle';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };
  
  getStudentCurated = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/resources/getStudentCurated';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getStudentFileData = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/resources/getStudentFileData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  addBlogCommentData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'resources/add-blogComment';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  addCommentReplyData = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'resources/add-reply';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getBlogComment = (data:any): Observable<any> => { 
    const endpoint = environment.apiNewEndpoint+'forget/resources/getBlogComment';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getCommentReply = (data:any): Observable<any> => { 
    const endpoint = environment.apiNewEndpoint+'forget/resources/getCommentReply';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };
  
  getSearchPostData = (data:any): Observable<any> => {
    const endpoint = environment.apiNewEndpoint+'forget/resources/getSearchPostData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getArticles(params?): Observable<ApiGenericResponse<GenericResources>> {
    return this.http
      .get<ApiGenericResponse<GenericResources>>(
        `${environment.apiEndpoint}resources/blogs${this.sanitizeParams(params)}`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response;
        })
      );
  }

  getResources(): Observable<ApiGenericResponse<AllResources>> {
    return this.http
      .get<ApiGenericResponse<AllResources>>(
        `${environment.apiEndpoint}resources/get-all`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response;
        })
      );
  }

  getPrograms(params?): Observable<ApiGenericResponse<GenericResources>> {
    return this.http
      .get<ApiGenericResponse<GenericResources>>(
        `${environment.apiEndpoint}resources/programs${this.sanitizeParams(params)}`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response;
        })
      );
  }

  getProgramDetailsById(id): Observable<Resource> {
    return this.http
      .get<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}resources/programs/${id}`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  getCourses(params?): Observable<ApiGenericResponse<GenericResources>> {
    return this.http
      .get<ApiGenericResponse<GenericResources>>(
        `${environment.apiEndpoint}resources/courses${this.sanitizeParams(params)}`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response;
        })
      );
  }

  getWebinars(params?): Observable<ApiGenericResponse<GenericResources>> {
    return this.http
      .get<ApiGenericResponse<GenericResources>>(
        `${environment.apiEndpoint}resources/webinars${this.sanitizeParams(params)}`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response;
        })
      );
  }

  getConferences(params?): Observable<ApiGenericResponse<GenericResources>> {
    return this.http
      .get<ApiGenericResponse<GenericResources>>(
        `${environment.apiEndpoint}resources/conferences${this.sanitizeParams(params)}`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response;
        })
      );
  }

  getArticleDetails(slug): Observable<Resource> {
    return this.http
      .get<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}resources/blogs/${slug}`
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  navigateToResources(resourceName) {
    this.router.navigate([resourceName], {relativeTo: this.route});
  }

  navigateToBlogDetail(slug) {
    if(this.router.url.includes('/magazine/blog') || this.router.url.includes('/magazine')) {
      this.router.navigateByUrl(`magazine/blog/${slug}`);
    } else if(this.router.url.includes('/blog')) {
      this.router.navigateByUrl(`blog/${slug}`);
    }
    else if(this.router.url.includes('/academy')) {
      this.router.navigateByUrl(`blog/${slug}`);
    }
  }

  sanitizeParams(params: { [key: string]: string | number }) {
    // TODO: Split Me
    if (!params) {
      // when params will be not send then return from here
      return '';
    }
    const newParam = Object.entries(params).map(param => {
      return param.join('=');
    });
    return (
      '?' +
      newParam
        .filter(p => {
          const filterValues = p.split('=')[1];
          return p !== undefined && filterValues;
        })
        .join('&')
    );
  }

  getBlogTagList = (data:any): Observable<any> => { 
    const endpoint = environment.apiEndpoint+'admin/blogs/blogtag';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getTagArticleData = (data:any): Observable<any> => { 
    const endpoint = environment.apiNewEndpoint+'forget/resources/blogtag';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };


}
