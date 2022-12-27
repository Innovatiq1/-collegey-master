import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    public toasterService: ToastrService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();
    return next.handle(req).pipe(
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          if (evt.body || evt.body.status === 'success') {
            // this.toasterService.success(evt.body, evt.body.message);
            this.spinner.hide();
          }
        }
      }),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          try {
            if (error.status === 401) {
              this.authService.clearLocalStorage();
              this.spinner.hide();
            } else {
              const { errors, message } = error.error;
              if (errors) {
                errors.forEach((error) => {
                  const errKeys = Object.keys(error);
                  errKeys.forEach((key) => {
                    this.toasterService.error(error[key]);
                  });
                });
              } else {
                this.toasterService.error(message);
              }
              this.spinner.hide();
            }
          } catch (e) {
            this.toasterService.error(
              'An error occurred',
              'Something went Wrong'
            );
          }
        }
        throw error;
      })
    );
  }
}
