import { FormGroup, FormControl, FormArray } from '@angular/forms';
// import { AppConstants } from './constants/app.constants';
import { DatePipe } from '@angular/common';
import { AppConstants } from './constants/app.constants';

export class Utils {
  /**
   * Display error message across API end
   * @param  {Object | Error} validationErrors
   * @param  {FormGroup} formGroup
   */
  public static displayServerJsonError(
    validationErrors: Object | Error,
    formGroup: FormGroup
  ) {
    Object.keys(validationErrors).forEach((prop) => {
      const formControl = formGroup.get(prop);
      if (formControl instanceof FormControl) {
        formControl.setErrors({
          serverError: validationErrors[prop],
        });
      }
    });
  }

  /**
   * @param  {name}
   * @returns {slug}
   */
  public static getSafeSlug(name: string) {
    if (name) {
      return name.replace(/[\W_]/g, '-');
    }
  }

  /**
   * @param  {FormControl} c
   * @returns true
   */
  // public static validateEMAIL(c: FormControl) {
  //   const EMAIL_REGEXP = AppConstants.EMAIL_REGEX;
  //   return EMAIL_REGEXP.test(c.value) ? null : { validateEMAIL: true };
  // }

  /**
   * Converts Long date format EE, MMMM d, y to a date obj ''
   * returns undefined if the date is not valid
   */
  // public static transformLongDate(date: Date) {
  //   return new DatePipe(AppConstants.DATE_LOCALE).transform(
  //     date,
  //     AppConstants.FULL_DATE
  //   );
  // }

  /**
   * Converts ISO date format YYYY-MM-DDTHH:mm:ss.SSS to a DATE object.
   * returns undefined if the date is not valid
   */
  // public static transformShortDate(date: Date) {
  //   return new DatePipe(AppConstants.DATE_LOCALE).transform(
  //     date,
  //     AppConstants.LONG_DATE
  //   );
  // }

  public static transformNumericDate(date: Date) {
    return new DatePipe(AppConstants.DATE_LOCALE).transform(date, 'yyyy-MM-dd');
  }

  /**
   * Check Empty Object
   * @param  {object}
   */
  // public static isEmptyObject(obj: Object) {
  //   return obj && Object.keys(obj).length === 0;
  // }

  /**
   * Check Allowed Extension of File
   * @param  {string} uploadedFileExtension
   */
  // public static isValidFileExtension(uploadedFileExtension: string) {
  //   return (
  //     AppConstants.ALLOWED_FILE_UPLOAD_TYPE.indexOf(
  //       uploadedFileExtension.toLowerCase()
  //     ) > -1
  //   );
  // }

  public static isEmpty(obj) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return true;
  }

  public static removeNullFields(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      for (let key = 0; key < obj.length; key++) {
        this.removeNullFields(obj[key]);
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
          if (Object.keys(obj[key]).length === 0){
            obj.splice(key, 1);
            key--;
          }
        }

      }
    }
    else if (Object.prototype.toString.call(obj) === '[object Object]') {
      // tslint:disable-next-line:forin
      for (const key in obj) {
        const value = this.removeNullFields(obj[key]);
        if (value === null || value === '') {
          delete obj[key];
        }
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
          if (Object.keys(obj[key]).length === 0){
            delete obj[key];
          }
        }
        if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
          if (obj[key].length === 0){
            delete obj[key];
          }
        }
      }
    }
    return obj;
  }

  public static typeCastToFormArray(formModel: FormGroup, step: string, formGroup: string) {
    return formModel.get(step).get(formGroup) as FormArray;
  }

  public static getDocumentName(file) {
    const imageList = [];
    if (file) {
      if (file instanceof Array) {
        file.forEach((image) => {
          imageList.push(image.slice(27));
        });
      } else {
        imageList.push(file.slice(27));
      }
    }
    return imageList;
  }

  // remove null entry from form object
//  public static removeNullFields(obj): any {
//     // tslint:disable-next-line:forin
//     for (let key in obj) {
//       // Delete null, undefined, "", " "
//       // If object call function again
//       if (typeof obj[key] === 'object') {
//         this.removeNullFields(obj[key]);
//       }
//       if (
//         obj[key] === null ||
//         obj[key] === undefined ||
//         obj[key] === '' ||
//         obj[key] === ' '
//       ) {
//         delete obj[key];
//       }
//       // Delete empty object
//       // Note : typeof Array is also object
//       if (typeof obj[key] === 'object' && Object.keys(obj[key]).length <= 0) {
//         if(this.isEmpty(obj)){
//           delete obj[key];
//         } else {
//         delete obj[key];
//         }
//       }
//     }
//     return obj;
//   }

  // public static checkFormStatus(obj) {
  //   // tslint:disable-next-line:forin
  //   for (const key in obj) {
  //     if (typeof obj[key] === 'object') {
  //       this.checkFormStatus(obj[key]);
  //     }
  //     if (
  //       obj[key] === null ||
  //       obj[key] === undefined ||
  //       obj[key] === '' ||
  //       obj[key] === ' '
  //     ) {
  //       return false;
  //     }
  //     // Delete empty object
  //     // Note : typeof Array is also object
  //     if (typeof obj[key] === 'object' && Object.keys(obj[key]).length <= 0) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  /**
   * @param  {Object} model
   * @param  {FormData} form
   * @param  {} namespace=''
   * @returns FormData of given Json Object
   */
  public static convertModelToFormData(
    model: Object,
    form: FormData = null,
    namespace = ''
  ): FormData {
    const formData = form || new FormData();

    for (const propertyName in model) {
      if (!model.hasOwnProperty(propertyName) || !model[propertyName]) { continue; }
      const formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;
      if (model[propertyName] instanceof Array) {
        model[propertyName].forEach((element, index) => {
          const tempFormKey = `${formKey}[${index}]`;
          this.convertModelToFormData(element, formData, tempFormKey);
        });
      } else if (
        typeof model[propertyName] === 'object' &&
        !(model[propertyName] instanceof File)
      ) {
        this.convertModelToFormData(model[propertyName], formData, formKey);
 }
      else { formData.append(formKey, model[propertyName].toString()); }
    }
    return formData;
  }
}
