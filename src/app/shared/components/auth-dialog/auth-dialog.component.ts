import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { User, Student } from 'src/app/core/models/user.model';
import { AppConstants } from '../../constants/app.constants';
import { UserType } from 'src/app/core/enums/user-type.enum';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css'],
})
export class AuthDialogComponent {
  AUTH_TYPES = AuthType;
  authType: AuthType;
  socialUserInfo: SocialUser;

  constructor(private bsModalRef: BsModalRef, private router: Router) {}

  // decline() {
  //   this.bsModalRef.hide();
  // }

  // accept() {
  //   this.bsModalRef.hide();
  // }

  // openSignUpForm() {
  //   this.authType = AuthType.SIGN_UP;
  // }

  // openLoginForm() {
  //   this.authType = AuthType.LOGIN;
  // }

  // openChangePasswordForm() {
  //   this.authType = AuthType.CHANGE_PASSWORD;
  // }

  onLoginSuccess() {
    const currentUserInfo: Student = JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA));
    //alert(JSON.stringify(currentUserInfo));
    //console.log(currentUserInfo);
    if(currentUserInfo.user.type === UserType.COUNSELOR) {
      this.router.navigate(['/counselor/dashboard'], {
        queryParams: {
          returnUrl: 'counselor-dashboard'
        }
      });
    } else if (currentUserInfo.user.type === UserType.STUDENTS) {
        this.router.navigateByUrl('/student-dashboard/$');
    }else if (currentUserInfo.user.type == 'university') {
      this.router.navigateByUrl('/university-dashboard');
    } else if (currentUserInfo.user.type == 'partner') {
      this.router.navigateByUrl('/impact/dashboard');
    }else if (currentUserInfo.user.type == 'parents') {
      this.router.navigateByUrl('/parents/dashboard');
    }else if (currentUserInfo.user.type == 'school') {
      this.router.navigateByUrl('/hb/hbdashboard');
    }else if (currentUserInfo.user.type == 'university-student') {
      this.router.navigateByUrl('/university-dashboard');
    }else if (currentUserInfo.user.type == 'mentor') {
      this.router.navigateByUrl('/mentors/dashboard');
    }else if (currentUserInfo.user.type == 'alumni') {
      this.router.navigateByUrl('/alumni/dashboard');
    }
  }
}
