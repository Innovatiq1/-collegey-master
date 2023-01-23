import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  BsModalRef,
} from 'ngx-bootstrap/modal';

import { AuthService as AuthService1} from "angularx-social-login";
import { ToastrService } from 'ngx-toastr';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

import { SocialUsers } from 'src/app/core/models/social-user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { Router, ActivatedRoute } from '@angular/router';
import { UserType } from 'src/app/core/enums/user-type.enum';
import { Subscription, Observable } from 'rxjs';
import { AppConstants } from '../../constants/app.constants';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  @ViewChild('forgotPasswordModal', { static: true })
  email:any;
  remberEmailCheck:any;

  siteCaptchaKey:string; 

  selectUserLoginSubscription: Subscription;

  showErrorMessage = false;

  loginForm: FormGroup;
  
  USER_TYPES = UserType;
  
  @Input() isLoginPage: boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onUserInfoRequired: EventEmitter<{
    registerForm: boolean;
    socialUser: SocialUsers;
  }> = new EventEmitter<{
    registerForm: boolean;
    socialUser: SocialUsers;
  }>();

  @Output() loginSuccessEvent: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  // Login Tab
  StudtabActive: boolean = true;
  MentortabActive: boolean = false;
  loginType: any = 'student';
  screenWidth: number;
  mobileView: boolean;
  submittedLogin: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private bsModalRef: BsModalRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authServiceSocial: AuthService1,
    private toastrService: ToastrService,
  ) {
    this.screenWidth = window.innerWidth;
    //console.log(this.screenWidth);
    if (this.screenWidth < 900) {
      this.mobileView = true;
    }
    if (this.screenWidth >= 900) {
      this.mobileView = false;
    }
    this.buildForm();
    this.siteCaptchaKey = environment?.recaptcha_key;
  }

  ngOnInit(): void {
    this.bsModalRef.setClass('modal-lg');
    this.selectUserLoginSubscription =this.authService.$selectUserLogin.subscribe(user => {
      this.loginForm.patchValue({
        type:  user || UserType.STUDENTS
      });
    });
    let email1= localStorage.getItem("clg-email");
    if(email1){
      this.remberEmailCheck = email1;
      this.email = email1;
      this.loginForm.patchValue({
        remember: true,
      });
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  signInWithGoogle(): void {
    this.authServiceSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then((res) => {
      if (res) {
       
      }else{
        
      }
    });
  }

  signInWithFB(): void { 
    this.authServiceSocial.signIn(FacebookLoginProvider.PROVIDER_ID);
  } 

  selectLoginActionTab(tabAction:any)
  {
    if(tabAction == 'studentlogin')
    {
      this.StudtabActive = true;
      this.MentortabActive = false;
      this.loginType = 'student';
    }
    else
    {
      this.StudtabActive = false;
      this.MentortabActive = true;
      this.loginType = 'mentor';
    }
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          CustomValidators.emailValidator,
        ],
      ],
      password: [null, [Validators.required, Validators.minLength(8)]],
      type: [Validators.required],
      remember: [""],
      recaptcha: ['', Validators.required]
    });

    // setTimeout(() => { 
    //   this.loginForm.patchValue({
    //     email: '',
    //     password: '',
    //   });
    // },500);
  }

  public hasError = (controlName: string, errorName: string) => { 
    return this.loginForm.controls[controlName].hasError(errorName);
  };
  
  showRegisterForm(socialUserInfo?) {
    this.authService.closeAuthDialog();
    const currentPath = this.router.url.split('?')[0];
    if(this.loginForm.get('type').value === UserType.STUDENTS) {
      if(currentPath === '/login') {
        this.activatedRoute.queryParams.subscribe(param => {
          this.router.navigateByUrl(`/sign-up?returnUrl=${param && param.returnUrl}`);
          });
      } else {
        this.authService.openAuthDialog(AuthType.SIGN_UP, null, socialUserInfo);
      }
    } else {
      this.router.navigateByUrl('/counselor-sign-up');  // navigate to counselor register page when userType is counselor
    }
  }

  onLogin() {
    this.submittedLogin = true;
    this.loginForm.markAllAsTouched();
      
    if (this.loginForm.invalid) {
      this.showErrorMessage = true;
      return;
    }

    const loginFromdata   = this.loginForm.getRawValue();
    loginFromdata['logintype'] = this.loginType;

    this.authService.checkloginpassword(loginFromdata).subscribe(
      (response) => {
        if(response?.data?.passwordChange == true)
        {
          this.router.navigateByUrl('/resetPassword/'+response?.data?._id);
        }
        else
        {
          this.authService.login(loginFromdata).subscribe(
            (res) => { 
              localStorage.setItem("fetchcurrentUserRole",res?.data?.user?.type);
              this.onLoginEvent();
            },
            (err) => {
              console.log("err",err);
            },
          );     
        }
      },
      (err) => {
        this.toastrService.error('User not found');
        return;
      },
    ); 

    if(loginFromdata.remember){
      localStorage.setItem("clg-email",loginFromdata.email)
    }else{
      localStorage.removeItem("clg-email")
    }
  }

  onClose() {
    this.bsModalRef.hide();
  }

  // saveId(event){
  //   // const idemail= this.email;
  //  // console.log(event.target.checked);
  //   if(event.target.checked){
  //    localStorage.setItem('email',this.email);
  //   }else{
  //     localStorage.removeItem("email");
  //   }
  //  //  console.log("this is email",this.email);
  // }

  valuechange(event){
    // console.log("here",event);
    this.email = event;
  }

  onLoginEvent(event?) {
    this.onClose();
    this.loginSuccessEvent.emit(true);
  }

  openForgotPasswordModal() {
    this.authService.closeAuthDialog();
    this.authService.openAuthDialog(AuthType.FORGOT_PASSWORD);
  }

  ngOnDestroy(): void {
    this.selectUserLoginSubscription.unsubscribe();
  }
}
