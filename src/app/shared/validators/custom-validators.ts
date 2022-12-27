import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from '../constants/app.constants';
import { QualificationType } from 'src/app/modules/students/components/profile/student-history/components/history-form/history-form.component';

export class CustomValidators {
  static emailValidator(control: AbstractControl) {
    if (
      !control.value ||
      (control.value &&
        control.value.match(AppConstants.EMAIL_PATTERN))
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static phoneValidator(control: AbstractControl) {
    if (
      !control.value ||
      (control.value &&
        control.value.toString().match(AppConstants.PHONE_PATTERN))
    ) {
      return null;
    } else {
      return { invalidPhone: true };
    }
  } 

  static checkPassword(group: FormGroup) { // here we have the 'passwords' group
  const password = group.get('password').value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { notEquivalent: true };
}

  static urlValidator(control: AbstractControl) {
    if (
      !control.value ||
      (control.value &&
        control.value.match(AppConstants.URL_PATTERN))
    ) {
      return null;
    } else {
      return { invalidUrl: true };
    }
  }
}
