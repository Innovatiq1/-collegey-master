import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.css'],
})
export class ResetPasswordFormComponent implements OnInit {
  @Input() resetPasswordResponse: any;
  resetPasswordForm: FormGroup;
  showErrorMessage = false;

  constructor(
    private route: Router,
    private authService: AuthService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validator: this.checkIfMatchingPasswords('password', 'confirmPassword'),
      }
    );
  }

  resetPassword() {
    const object = Object.assign(this.resetPasswordForm.value, {
      token: this.resetPasswordResponse.reset_password_token,
      id: this.resetPasswordResponse._id,
    });
    this.resetPasswordForm.markAllAsTouched();
    if (this.resetPasswordForm.invalid) {
      this.showErrorMessage = true;
      return;
    }
    this.authService.resetPassword(object).subscribe((res) => {
      this.toastrService.success('Password reset successfully.');
      this.authService.logOut();
      localStorage.removeItem('user_data');
      localStorage.removeItem('static_data');
      this.route.navigate(['/']);
    });
  }

  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }
}
