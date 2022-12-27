import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  NavigationStart
} from '@angular/router';

import { Logger } from '../services/logger.service';
import { AuthService } from '../services/auth.service';

const log = new Logger('AuthGuard');

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.getToken()) {
      return true;
    }

    log.debug('Not authenticated, redirecting and adding redirect url...');
    this.router.navigate(['/sign-up'], {
      queryParams: { returnUrl: state.url },
      replaceUrl: true
    });
    return false;
  }
}
