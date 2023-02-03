import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { DEFAULT_CONFIG } from 'src/configs/default';

@Component({
  selector: 'app-linkedin-login-response',
  templateUrl: './linkedin-login-response.component.html',
  styleUrls: ['./linkedin-login-response.component.css']
})
export class LinkedinLoginResponseComponent implements OnInit {
  linkedInTokenCode = "";
  @Input() authType: AuthType;
  AUTH_TYPES = AuthType;
  @Output() onSuccess = new EventEmitter<boolean>();
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ){ }

  ngOnInit(): void {
    this.linkedInTokenCode = this.route.snapshot.queryParams["code"];
    this.getLinkedinAccessToken();
  }

  getLinkedinAccessToken(){ 
    let obj = {
      grant_type: 'authorization_code',
      code: this.linkedInTokenCode,
      client_id: '77u10423gsm7cx',
      client_secret: 'neoGgtcYWNGZiu8k',
      redirect_uri: `${DEFAULT_CONFIG.frontEndUrl}linkedInLogin`,
    };
    this.authService.getLinkedinAccessToken(obj).subscribe(
      (response) => {
        this.getLinkedinDetailsFetch(response?.token);
      },
      (err) => {
       
      },
    ); 
  }

  getLinkedinDetailsFetch(accessToken:any)
  {
    let obj = {
      accessToken:accessToken
    }
    this.authService.getLinkedinDetailsFetch(obj).subscribe(
      (response) => {
        let elementsData = response?.result?.elements[0];
        let socialUsers  = elementsData["handle~"].emailAddress;
        this.linkedInProfile(obj,socialUsers);
      },
      (err) => {
       
      },
    ); 
  }

  _socialLogin( socialUsers:any, socialProvider: any) {
    var email = socialUsers.email;
    var social_id = 'linked122';
    this.authService.socialLogin({ email, socialProvider, social_id }).subscribe(
      (res: any) => {
        console.log(';res',res);
        
        
        // this.toastrService.success(res.message);
        if (res.message === 'user not found!') {
          this.showRegisterForm(socialUsers);
        } else {
          this.onSuccess.emit(true);
          if(res?.data?.user?.type == 'student')
          {
            this.router.navigateByUrl('/student-dashboard/$');
            localStorage.setItem("fetchcurrentUserRole",res?.data?.user?.type);
            this.authService.setReward( res?.data?.user?._id);
          }
          else
          {
            this.router.navigateByUrl('/mentors/dashboard');
            localStorage.setItem("fetchcurrentUserRole",res?.data?.user?.type);
          }
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

  linkedInProfile(obj:any,socialUsers:any){
    this.authService.getLinkedinDetailsFetch1(obj).subscribe((res)=>{
      var linkedInObj:any = {
        firstName:res?.result?.localizedFirstName,
        lastName:res?.result?.localizedLastName,
        email:socialUsers
      }      
      var socialProvider = 'linkedin';
      this._socialLogin( linkedInObj, socialProvider );
    })
  }

}
