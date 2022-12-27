import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Logger } from '../services/logger.service';

const log = new Logger('AuthPageGuard');

@Injectable({ providedIn: 'root' })
export class AuthPageGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.getToken()) {
      this.router.navigate(['/']);
      log.debug(
        'already logged in. If you want to login from another account, please logout and login again'
      );
      return false;
    } else {
      return true;
    }
  }
}
