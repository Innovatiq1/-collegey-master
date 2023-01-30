import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SocialLoginType } from 'src/app/core/enums/social-login.enum';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  AuthService as AngularSocialService,
} from 'angularx-social-login';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuthType } from 'src/app/core/enums/auth-type.enum';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css'],
})
export class SocialLoginComponent implements OnInit {
  socialLoginType = SocialLoginType;
  @Input() authType: AuthType;
  AUTH_TYPES = AuthType;
  @Output() onSuccess = new EventEmitter<boolean>();

  constructor(
    private OAuth: AngularSocialService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private http: HttpClient
  ) {}
  
  // Linkdin Login
  
  private linkedInCredentials = {
    response_type: "code",
    clientId: "77u10423gsm7cx",
    redirectUrl: "http://localhost:4200/linkedInLogin",
    state: 23101992,
    scope: "r_liteprofile%20r_emailaddress%20w_member_social",
  };

  ngOnInit(): void {
    console.log(this.authType);
  }

  public socialSignIn(socialProvider) {
    let socialPlatformProvider;
    if(socialProvider == 'facebookLogin')
    {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }
    if(socialProvider == 'googleLogin')
    {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    
    this.OAuth.signIn(socialPlatformProvider).then((socialUsers) => {
      console.log("socialUsers",socialUsers);
      this._socialLogin({ socialUsers, socialProvider });
    });
  }

  loginWithlinkedin()
  { 
    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
      this.linkedInCredentials.clientId
    }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;
  } 
  
  _socialLogin({ socialUsers, socialProvider: social_type }) {
    const { email, id: social_id } = socialUsers;
    this.authService.socialLogin({ email, social_type, social_id }).subscribe(
      (res: any) => { 
        localStorage.setItem("fetchcurrentUserRole",res?.data?.user?.type);
        this.authService.setReward( res?.data?.user?._id);
        
        // this.toastrService.success(res.message);
        if (res.message === 'user not found!') {
          this.showRegisterForm(socialUsers);
        } else {
          localStorage.setItem("fetchcurrentUserRole",res?.data?.user?.type);
          this.onSuccess.emit(true);
        }
      },
      (error) => {
        console.log(error);
        this.toastrService.error(
          error.message || 'Unable to proceed. Please try after some time'
        );
      }
    );
  }

  showRegisterForm(socialUserInfo?) {
    this.authService.closeAuthDialog();
    this.authService.openAuthDialog(AuthType.SIGN_UP,  null, socialUserInfo);
  }
}
