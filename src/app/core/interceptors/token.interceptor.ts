import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private AUTH_HEADER = 'JWT ';

  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);

    if (authService.getToken()) {
      request = request.clone({
        headers: request.headers.set(
          'Authorization',
          this.AUTH_HEADER + authService.getToken()
        ),
      });
    }
    return next.handle(request);
  }
}
