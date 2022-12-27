import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StudentEducationService } from 'src/app/core/services/student-education.service';
import { Education } from 'src/app/core/models/student-profile.model';
import { Utils } from 'src/app/shared/Utils';

// Load Component
import { StudentHistoryComponent } from '../../student-history.component';

@Component({
  selector: 'app-add-history',
  templateUrl: './add-history.component.html',
  styleUrls: ['./add-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  })
export class AddHistoryComponent implements OnInit {

  @ViewChild('historyChildData') historyChildData: StudentHistoryComponent;

  educationForm: FormGroup;
  addedEducation: Education = null;
  error:any
  start_year_error:any
  end_year_error:any
  board_error:any
  scoreType_error:any
  tbd_error:any
  // transcript_error:any
  subject_error:any
  score_error:any
  school_error:any
  locationCity_error:any
  locationState_error:any
  locationCountry_error:any
  degree_error:any
  year_error:any
  

  onSubmitEducation: EventEmitter<any> = new EventEmitter();
  showErrorMessage: boolean;

  constructor(
    private studentEducationService: StudentEducationService,
    private toastrService: ToastrService,
    public bsModalRef: BsModalRef
  ) {}

  initEducationForm(education) {
    this.educationForm = this.studentEducationService.createEducationFormGroup(
      education
    );
    // console.log(this.educationForm);
  }
  parameterValidation = () => {
    let flag = true;
    let Validation = this.educationForm.getRawValue().grade.filter(r => (r.start_year===null || r.start_year == ''  ));
    if (Validation.length == 0) {
      flag = true;
      this.start_year_error=''
    } else {
      flag = false;
    }
    return flag;
}
endYearValidation = () => {
  let flag = true;
  let Validation = this.educationForm.getRawValue().grade.filter(r => (r.end_year===null || r.end_year == ''  ));
  if (Validation.length == 0) {
    flag = true;
    this.end_year_error=''
  } else {
    flag = false;
  }
  return flag;
}

getFormType(event) {
  // console.log("event===>", event)
}

boardValidation = () => {
  let flag = true;
  let Validation = this.educationForm.getRawValue().grade.filter(r => (r.board===null || r.board == ''  ));
  if (Validation.length == 0) {
    flag = true;
    this.board_error=''
  } else {
    flag = false;
  }
  return flag;
}

scoreTypeValidation = () => {
  let flag = true;
  let Validation = this.educationForm.getRawValue().grade.filter(r => (r.scoreType===null || r.scoreType == ''  ));
  if (Validation.length == 0) {
    flag = true;
    this.scoreType_error=''
  } else {
    flag = false;
  }
  return flag;
}

// transcriptValidation = () => {
//   let flag = true;
//   let Validation = this.educationForm.getRawValue().grade.filter(r => (r.transcript===null || r.transcript == ''  ));
//   if (Validation.length == 0) {
//     flag = true;
//     this.transcript_error=''
//   } else {
//     flag = false;
//   }
//   return flag;
// }
studyValidation = () => {
  let flag = true;
  let Validation = this.educationForm.getRawValue().grade.filter(r => (r.field_of_study === null || r.field_of_study== '' ));
  if (Validation.length == 0) {
    flag = true;
    this.subject_error=''
  } else {
    flag = false;
  }
  return flag;
}
scoreValidation = () => {
  let flag = true;
  let Validation = this.educationForm.getRawValue().grade.filter(r => (r.score===null || r.score == ''  ));
  if (Validation.length == 0) {
    flag = true;
    this.score_error=''
  } else {
    flag = false;
  }
  return flag;
}
collegeestudyValidation = () => {
  let flag = true;
  let Validation = this.educationForm.getRawValue().collegegrade.filter(r => (r.field_of_study===null   ));
  if (Validation.length == 0) {
    flag = true;
    this.subject_error=''
  } else {
    flag = false;
  }
  return flag;
}
collegescoreValidation = () => {
  let flag = true;
  let Validation = this.educationForm.getRawValue().collegegrade.filter(r => (r.score===null || r.score == ''  ));
  if (Validation.length == 0) {
    flag = true;
    this.score_error=''
  } else {
    flag = false;
  }
  return flag;
}

  onSubmitForm() {
    // console.log("==========",this.educationForm.getRawValue())
    //console.log("==========",this.educationForm.getRawValue().grade[0].field_of_study)
  if(this.educationForm.getRawValue().type =='School'){
    if(this.educationForm.getRawValue().grade.length === 0){
      this.error ='Please Select Grade Level';
      return;
    }else if(this.parameterValidation() == false){
      this.start_year_error ='Please Select Start Year';
      return;
    } else if(this.endYearValidation() == false){
      this.end_year_error ='Please Select End Year';
      return;
    }else if(this.boardValidation() == false ){
      this.board_error ='Please Select Board';
      return;
    }else if(this.studyValidation() == false){
      this.subject_error ='Please Select Subject';
      return;
    }else if(this.scoreValidation() == false){
      this.score_error ='Please Enter Score';
      return;
    }else if(this.scoreTypeValidation() == false ){
      this.scoreType_error ='Please Select Score Type';
      return;
    }else if(this.educationForm.getRawValue().name===null || this.educationForm.getRawValue().name===''){
      this.school_error ='Please Enter School Name';
      return;
    }else if(this.educationForm.getRawValue().locationCity ===null || this.educationForm.getRawValue().locationCity ===''){
      this.locationCity_error ='Please Enter City Name';
      return;
    }else if(this.educationForm.getRawValue().locationState ===null || this.educationForm.getRawValue().locationState ===''){
      this.locationState_error ='Please Enter State Name';
      return;
    }else if(this.educationForm.getRawValue().locationCountry ===null || this.educationForm.getRawValue().locationCountry ===''){
      this.locationCountry_error ='Please Enter Country Name';
      return;
    }
  }else if(this.educationForm.getRawValue().type =='College'){
    if(this.educationForm.getRawValue().start_year===null || this.educationForm.getRawValue().start_year==='' ){
      this.start_year_error ='Please Select Start Year';
      return;
    }else if(this.educationForm.getRawValue().end_year===null || this.educationForm.getRawValue().end_year==='' ){
      this.end_year_error ='Please Select End Year';
      return;
    }else if(this.educationForm.getRawValue().degree===null || this.educationForm.getRawValue().degree==='' ){
      this.degree_error ='Please Select degree';
      return;
    }else if(this.educationForm.getRawValue().year_choosen  === null){
      this.year_error ='Please Select Year';
      return;
    }else if(this.collegeestudyValidation() == false){
      this.subject_error ='Please Select subject';
      return;
    }
    else if(this.collegescoreValidation() == false){
      this.score_error ='Please Enter score';
      return;
    }else if(this.educationForm.getRawValue().name===null || this.educationForm.getRawValue().name===''){
      this.school_error ='Please Enter School Name';
      return;
    }else if(this.educationForm.getRawValue().locationCity ===null || this.educationForm.getRawValue().locationCity ===''){
      this.locationCity_error ='Please Enter City';
      return;
    }else if(this.educationForm.getRawValue().locationState ===null || this.educationForm.getRawValue().locationState ===''){
      this.locationState_error ='Please Enter State';
      return;
    } else if(this.educationForm.getRawValue().locationCountry ===null || this.educationForm.getRawValue().locationCountry ===''){
      this.locationCountry_error ='Please Enter Country';
      return;
    }

  }
    const formData: any = {};
    formData.education = Object.assign({}, this.educationForm.getRawValue());
    if(formData.education.start_year?.getFullYear) {
      formData.education.start_year = new Date(
        formData.education.start_year
      ).getFullYear();
    }

    if (formData.education.end_year?.getFullYear) {
      formData.education.end_year = new Date(
        formData.education.end_year
      ).getFullYear();
    }

    // const education = formData.history_updated.education;
    for (let j = 0; j < formData.education.grade.length; j++) {
      if(formData.education.grade[j].start_year?.getFullYear) {
        formData.education.grade[j].start_year = new Date(
          formData.education.grade[j].start_year
        ).getFullYear();
      }
      if(formData.education.grade[j].end_year?.getFullYear) {
        formData.education.grade[j].end_year = new Date(
          formData.education.grade[j].end_year
        ).getFullYear();
      }
    }

    this.studentEducationService.qualificationType$.subscribe(qualification => {
      formData.education.type = qualification;
    })

    if (this.addedEducation) {
      this.updateEducation(formData);
    } else {
      this.saveEducation(formData);
    }
  }

  updateEducation(formData) {
    formData = Utils.removeNullFields(formData);
    
    this.studentEducationService
      .updateEducation(formData, this.addedEducation._id)
      .subscribe(
        (education) => {
          if (education) {
            this.onSubmitEducation.emit(education);
            this.toastrService.success(
              'Education Details Updated Successfully'
            );
          }
          this.bsModalRef.hide();
          localStorage.setItem('step', 'education');
          window.location.reload();
        },
        (error) => {
          this.toastrService.error(
            error.message || 'Oops something went wrong'
          );
        }
      );
  }

  saveEducation(formData) {
    formData = Utils.removeNullFields(formData);
    this.studentEducationService.saveEducation(formData).subscribe(
      (response) => {
        // console.log("re11111111111111",response);
        this.onSubmitEducation.emit(response);
        this.toastrService.success('Education details added');
        this.bsModalRef.hide();
        //this.historyChildData.Custinitialize(response);
        localStorage.setItem('step', 'education');
        window.location.reload();
      },
      (error) => {
        this.toastrService.error(error.message || 'Oops something went wrong');
      }
    );
  }

  ngOnInit() {
    this.initEducationForm(this.addedEducation);

  }
}
