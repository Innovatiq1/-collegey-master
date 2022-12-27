import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { UserType } from 'src/app/core/enums/user-type.enum';

@Component({
  selector: 'app-counselor-signup',
  templateUrl: './counselor-signup.component.html',
  styleUrls: ['./counselor-signup.component.css']
})
export class CounselorSignUpComponent implements OnInit {

  counselorForm: FormGroup;
  showErrorMessage = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initCounselorForm();
  }
  
  initCounselorForm() {
    this.counselorForm = this.fb.group({
      type: ['counsellor'],
      email: [null , [Validators.required, CustomValidators.emailValidator]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null , Validators.required],
      name: [null, Validators.required],
      last_name: [null],
      organization: [null, Validators.required]
    }, {validators: CustomValidators.checkPassword});
  }

  prepareSubmitData(formData) {
    delete formData.confirmPassword; // not need to save in database
    return formData;
  }

  onRegister() {
    this.counselorForm.markAllAsTouched();
    if(this.counselorForm.invalid) {
      this.showErrorMessage = true;
      return;
    }

    let formData = this.counselorForm.getRawValue();
    formData = this.prepareSubmitData(formData);
    this.commonService.onRegisterUser(formData).subscribe(response => {
      if(response) {
        this.router.navigate(['/counselor/dashboard'], {
          queryParams: {
            returnUrl: 'counselor-dashboard'
          }
        });
      }
    });
  }

  openLoginModal() {
    this.authService.$selectUserLogin.next(UserType.COUNSELOR);
    this.authService.openAuthDialog(AuthType.LOGIN);
  }

}
