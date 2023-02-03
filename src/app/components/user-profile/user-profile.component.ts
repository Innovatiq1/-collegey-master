import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/core/models/user.model';
import { SocialUsers } from 'src/app/core/models/social-user.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { UserType } from 'src/app/core/enums/user-type.enum';
import { ConfigService } from 'src/app/core/services/config.service';
import { QualificationType } from 'src/app/modules/students/components/profile/student-history/components/history-form/history-form.component';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
// Load Services
import { InviteeServiceService } from 'src/app/core/services/invitee-service.service';
import mixpanel from 'mixpanel-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  showBox1 = true;
  showBox2 = false;
  studentForm: FormGroup;
  showErrorMessage = false;

  showOtherErrorMessage = false;
  qualificationType = QualificationType;

  @Input() socialUserInfo: SocialUsers;
  @Input() authType: AuthType;
  @Output() onRegisterSuccess: EventEmitter<Student> = new EventEmitter<
    Student
  >();

  @Output() loginSuccessEvent: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();
  emailErrorMessage: any;
  User_type:any = localStorage.getItem('user_type');

  refralId:any;
  isEdit = this.activatedRoute.snapshot.data.title === 'edit' ? true : false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    public bsModalRef: BsModalRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private inviteeService: InviteeServiceService,
  )
  {
    this.refralId = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.User_type == 'mentor')
    {
      this.showBox1 = false;
      this.showBox2 = true;
    }
    if(this.isEdit)
    {
      this.showBox1 = false;
      this.showBox2 = true;
      this.User_type = 'mentor';
      this.patchingProfiledata(this.refralId);
    } 
  }

  initStudentRegistration() {
    const counselorSource = localStorage.getItem(AppConstants.KEY_COUNSELOR_SOURCE);
    // this.studentForm = this.fb.group({
    //   type: ['student'],
    //   email: [
    //     this.socialUserInfo ? this.socialUserInfo.email : null,
    //     [Validators.required, CustomValidators.emailValidator],
    //   ],
    //   password: ['', [Validators.required, Validators.minLength(8)]],
    //   confirmPassword: ['', [Validators.required]],
    //   name: [this.socialUserInfo ? this.socialUserInfo.firstName : null, Validators.required],
    //   last_name: [this.socialUserInfo ? this.socialUserInfo.lastName : null],
    //   qualification: [null, Validators.required],
    //   other: [''],
    //   shouldAgree: [null, Validators.required],
    //   source: [counselorSource ? counselorSource : null ]
    // }, {validators: CustomValidators.checkPassword});

    if(this.User_type == 'mentor')
    { 
      this.studentForm = this.fb.group({
        type: ['mentor'],
        email: [
          this.socialUserInfo ? this.socialUserInfo.email : null,
          [Validators.required, CustomValidators.emailValidator],
        ],
        name: [this.socialUserInfo ? this.socialUserInfo.firstName : null, Validators.required],
        last_name: [this.socialUserInfo ? this.socialUserInfo.lastName : null],
        qualification: [''],
        cellNumber: [null, Validators.required],
        linkedIn: ['https://www.linkedin.com/',Validators.required],
        other: [''],
        shouldAgree: [null, Validators.required],
        source: [counselorSource ? counselorSource : null ]
      });
    }
    else
    { 
      this.studentForm = this.fb.group({
        type: ['student'],
        email: [
          this.socialUserInfo ? this.socialUserInfo.email : null,
          [Validators.required, CustomValidators.emailValidator],
        ],
        name: [this.socialUserInfo ? this.socialUserInfo.firstName : null, Validators.required],
        last_name: [this.socialUserInfo ? this.socialUserInfo.lastName : null],
        qualification: [null, Validators.required],
        cellNumber: [null, Validators.required],
        other: [''],
        shouldAgree: [null, Validators.required],
        source: [counselorSource ? counselorSource : null ]
      });
    }
  }

  ngOnInit(): void {
    this.initStudentRegistration();
    this.bsModalRef.setClass('modal-lg');
  }

  patchingProfiledata(id:any) { 
    let obj = {id:id};
    this.inviteeService.fetchRefralData(obj).subscribe(
      (response) => {
        if(response){
          localStorage.setItem("referemail",response?.userdata?.email);
          localStorage.setItem("user_type",'mentor');
          this.studentForm.patchValue({ 
            name: response?.data?.name,
            email: response?.data?.email,
          });
        } 
      },
      (err) => {
      },
    );
  }
  

  changeForm() {
    this.showOtherErrorMessage = true;
    if (this.getValue('qualification')) {
      this.showBox1 = !this.showBox1;
      this.showBox2 = !this.showBox2;
    }
  }

  getValue(key: string) {
    return this.studentForm.get(key).value;
  }

  preparedSubmitData(formData) {
    if (this.socialUserInfo) {
      formData['social_type'] = this.socialUserInfo.provider;
      formData['social_id'] = this.socialUserInfo.id;
    }
    delete formData?.confirmPassword; // not need to save in database
    return formData;
  }

  onSubmit() {
    this.studentForm.markAllAsTouched();
    if (this.studentForm.invalid || !this.studentForm.get('shouldAgree').value) {
      this.showErrorMessage = true;
      return;
    }
    let  formData = this.studentForm.getRawValue();
    formData.type = localStorage.getItem('user_type');
    formData = this.preparedSubmitData(formData);
    formData['referemail'] = localStorage.getItem("referemail");
    formData['status']     = 'invite join';
    formData['isActive']   = false;
    this.inviteeService.createInvitee(formData).subscribe(
      (response) => {
        if(response){
          if(this.User_type == 'mentor')
          { 
            mixpanel.init('089a065ddf055461542dbc6154555107', {debug: true, ignore_dnt: true}); 
            mixpanel.track('Mentor Sign Up', {
              "Firstname": response.firstName,
              "Lastname": response.lastName,
              "Email": response.email,
            });
            this.toastrService.success(`Your mentor request is submitted`, null, {timeOut: 80000});
          }
          else
          { 
            mixpanel.init('089a065ddf055461542dbc6154555107', {debug: true, ignore_dnt: true}); 
            mixpanel.track('Student Sign Up', {
              "Firstname": response.firstName,
              "Lastname": response.lastName,
              "Email": response.email,
            });
            this.toastrService.success(`Invite Successfully`);
          }
          this.router.navigateByUrl(`/`);
          localStorage.removeItem('referemail');
          localStorage.removeItem('user_type');
        } 
      },
      (err) => {
      },
    );
    // this.commonService.onRegisterUser(formData).subscribe((res) => {
    //   this.toatrService.success(
    //     res.message || 'Student registered successfully'
    //   );
    //   this.router.navigateByUrl('/student-profile');
    //   this.onLoginEvent();
    // }, error => this.emailErrorMessage =  error.error.errors[0].email) ;
  }

  onClose() {
    this.bsModalRef.hide();
  }

  openLoginForm(socialUserInfo?) {
    this.authService.$selectUserLogin.next(UserType.STUDENTS);
    this.authService.closeAuthDialog();
    const currentPath = this.router.url.split('?')[0];
    if (currentPath === '/sign-up') {
      this.activatedRoute.queryParams.subscribe(param => {
      this.router.navigateByUrl(`/login?returnUrl=${param && param.returnUrl}`);
      });
    } else {
      this.authService.openAuthDialog(AuthType.LOGIN,null, socialUserInfo);
    }
  }

  onLoginEvent() {
    /** TODO*/
    this.onClose();
    this.loginSuccessEvent.emit(true);
  }

  handleChange(isOther) {
    if (isOther) {
      this.studentForm.controls['qualification'].setValue(null);
    } else {
      this.studentForm.controls['other'].setValue(null);
    }
  }

  isAuthenticated() {
    return this.authService.getToken();
  }

  redirect(){
    this.router.navigate(['/collegey-programs']);
  }
}