import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/core/models/user.model';
import { SocialUsers } from 'src/app/core/models/social-user.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { CustomValidators } from '../../validators/custom-validators';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { UserType } from 'src/app/core/enums/user-type.enum';
import { ConfigService } from 'src/app/core/services/config.service';
import { AppConstants } from '../../constants/app.constants';
import { QualificationType } from 'src/app/modules/students/components/profile/student-history/components/history-form/history-form.component';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toatrService: ToastrService,
    public bsModalRef: BsModalRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {}
    
  initStudentRegistration() {
    const counselorSource = localStorage.getItem(AppConstants.KEY_COUNSELOR_SOURCE);
    this.studentForm = this.fb.group({
      type: ['student'],
      email: [
        this.socialUserInfo ? this.socialUserInfo.email : null,
        [Validators.required, CustomValidators.emailValidator],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      name: [this.socialUserInfo ? this.socialUserInfo.firstName : null, Validators.required],
      last_name: [this.socialUserInfo ? this.socialUserInfo.lastName : null],
      qualification: [null, Validators.required],
      other: [''],
      shouldAgree: [null, Validators.required],
      source: [counselorSource ? counselorSource : null ]
    }, {validators: CustomValidators.checkPassword});
  }

  ngOnInit(): void {
    this.initStudentRegistration();
    this.bsModalRef.setClass('modal-lg');
    console.log(this.socialUserInfo);
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
    if(formData.qualification == 'mentor' && formData.qualification != null)
    {
      formData.type = 'mentor';
    } 
    else
    {
      formData.type = 'student';
    }
    //console.log("formData",formData); 
    formData = this.preparedSubmitData(formData);
    this.commonService.onRegisterUser(formData).subscribe((res) => {
      this.toatrService.success(
        res.message || 'Student registered successfully'
      );
      localStorage.setItem("fetchcurrentUserRole",res?.data?.user?.type);
      this.onLoginEvent();
    }, error => this.emailErrorMessage =  error.error.errors[0].email) ;
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
}
