import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.css'],
})
export class ForgotPasswordFormComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetLink: boolean;
  showErrorMessage = false;
  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.bsModalRef.setClass("modal-small-width");
  }

  private buildForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, CustomValidators.emailValidator]],
    });
  }

  openLoginModal() {
    this.authService.closeAuthDialog();
    this.authService.openAuthDialog(AuthType.LOGIN);
  }

  onSubmit() {
    this.forgotPasswordForm.markAllAsTouched();
    if (this.forgotPasswordForm.invalid) {
      this.showErrorMessage = true;
      return;
    }
    this.authService
      .forgotPassword(this.forgotPasswordForm.value)
      .subscribe((res) => {
        this.resetLink = true;
        this.toastrService.success(res.message);
      });
  }

}
