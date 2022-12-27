import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthModalType } from 'src/app/core/enums/login.enum';
import { SocialUsers } from 'src/app/core/models/social-user.model';

@Component({
  selector: 'app-auth-wrapper',
  templateUrl: './auth-wrapper.component.html',
  styleUrls: ['./auth-wrapper.component.css']
})
export class AuthWrapperComponent implements OnInit {
  @Input() isLoginPage: boolean;
  activeAuthModal: AuthModalType;
  authModalType = AuthModalType;
  socialUserInfoRequired: SocialUsers;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.authModal$.subscribe(authModal => {
      if (authModal.type === this.authModalType.REGISTER) {
        this.showSignUp(null);
      } else {
        this.showLogin();
      }
    });
  }

  /**
   * Set Login Form Visible
   */
  showLogin() {
    this.activeAuthModal = AuthModalType.LOGIN;
  }

  /**
   * Set Sign Up Form Visible
   */
  showSignUp(loginResponse?) {
    this.activeAuthModal = AuthModalType.REGISTER;
    this.socialUserInfoRequired = loginResponse ? loginResponse.socialUser : null;
  }

  /**
   * Hide Auth Modal and Set Login Modal as Default
   */
  onCloseModal() {
    this.showLogin();
    this.authService.authModal$.next({
      show: false,
      type: AuthModalType.LOGIN
    });
  }
}
