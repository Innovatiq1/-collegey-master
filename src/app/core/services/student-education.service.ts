import { Injectable } from '@angular/core';
import { Education, StudentSchoolGrade,StudentCollegeGrade, Profile, StudentProfile } from '../models/student-profile.model';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable, BehaviorSubject,throwError } from 'rxjs';
import { ApiGenericResponse } from '../models/response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Logger } from './logger.service';
import { QualificationType } from 'src/app/modules/students/components/profile/student-history/components/history-form/history-form.component';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('StudentEducationService');


@Injectable({
  providedIn: 'root'
})
export class StudentEducationService {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  private qualificationType = new BehaviorSubject<string>(QualificationType.HIGHT_SCHOOL_STUDENT);
  readonly qualificationType$ = this.qualificationType.asObservable();




  // create formArray of education group by looping on education array
  createEducationFormGroup(education?: Education): FormGroup {
    return this.fb.group({
      type: [education ? education.type : null],
      name: [education ? education.name : null],
      locationCity: [education ? education.locationCity : null],
      locationState: [education ? education.locationState : null],
      locationCountry: [education ? education.locationCountry : null],
      // board: [education ? education.board : null],
      // other_board: [education ? education.other_board : null],
      field_of_study: [education ? education.field_of_study : null],
      degree: [education ? education.degree  : null],
      start_year: [ education ? education.start_year : null],
      end_year: [education ? education.end_year : null],
      // current_class: [education ? education.current_class : null],
      grade_choosen: [education ? education.grade_choosen : null],
      score: [education ? education.score : null],
      grade: this.createGradeFormArray(education ? education.grade : null),

      year_choosen: [education ? education.year_choosen : null],
      collegegrade: this.createCollegGradeFormArray(education ? education.collegegrade : null),
      
      // score: this.createScore-FormArray(education ? education.score : []),
      _id: [education ? education._id : null]
    });
  }

  // createScoreFormArray(score: StudentSchoolScore[]): FormArray {
  //   return this.fb.array((score && score.length > 0) ? score.map(item => this.addStudentScoreFormGroup(item)) :
  //   [this.addStudentScoreFormGroup()]);
  // }

  createGradeFormArray(grade: StudentSchoolGrade[]): FormArray {
    return this.fb.array((grade && grade.length > 0) ? grade.map(item => this.addStudentGradeFormGroup(item)) :
    []);
  }

  createCollegGradeFormArray(collegegrade: StudentCollegeGrade[]): FormArray {
    return this.fb.array((collegegrade && collegegrade.length > 0) ? collegegrade.map(item => this.addStudentCollegeFormGroup(item)) :
    []);
  }

  createGradeChooseFormArray(grade): FormArray {
    return this.fb.array((grade && grade.length > 0) ? grade.map(item => this.addGradeChoosenFormGroup(item)) :
    [this.addGradeChoosenFormGroup(null)]);
  }

  addGradeChoosenFormGroup(grade_choosen ): FormGroup {
    return this.fb.group({
      name: [grade_choosen ? grade_choosen.name : null],
    });
  }
  
  addStudentGradeFormGroup(grade ?: StudentSchoolGrade): FormGroup {
    return this.fb.group({
      name: [grade ? grade.name : null],
      board: [grade ? grade.board : null],
      scoreType: [grade ? grade.scoreType : null],
      tbd: [grade ? grade.tbd : null],
      // transcript: [grade ? grade.transcript : null],
      other_board: [grade ? grade.other_board : null],
      field_of_study: [grade ? grade.field_of_study : null],
      start_year: [grade ? grade.start_year : null] ,
      end_year: [ grade? grade.end_year : null],
      score: [grade ? grade.score : null],
      school_file: [''],  
      school_fileName : [grade ? grade.school_fileName : null],
      _id: [grade ? grade._id : null]
      // class_name: [score ? score.class_name : null ],
      // class_score: [score ? score.class_score : null]
    });
  }

  addStudentCollegeFormGroup(collegegrade ?: StudentCollegeGrade): FormGroup {
    return this.fb.group({
      name: [collegegrade ? collegegrade.name : null],
      field_of_study: [collegegrade ? collegegrade.field_of_study : null],
      score: [collegegrade ? collegegrade.score : null],
      scoreType: [collegegrade ? collegegrade.scoreType : null],
      tbd: [collegegrade ? collegegrade.tbd : null],
      // transcript: [collegegrade ? collegegrade.transcript : null],
      stdyear: [collegegrade ? collegegrade.stdyear : null],
      college_file: [''],
      college_fileName : [collegegrade ? collegegrade.college_fileName : null],
      _id: [collegegrade ? collegegrade._id : null]
    });
  }
  
  saveEducation(data): Observable<Education> {
    return this.http
      .post<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-education`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  updateEducation(data, id): Observable<Education> {
    return this.http
      .put<ApiGenericResponse<any>>(
        `${environment.apiEndpoint}profile/student-education/${id}`,
        data
      )
      .pipe(
        map((response) => {
          Logging.debug(response);
          return response.data;
        })
      );
  }

  getQualificationType(value) {
    this.qualificationType.next(value);
  }

  // deleteEducation(eId): Observable<StudentProfile> {
  //   return this.http.delete<ApiGenericResponse<any>>(`${environment.apiEndpoint}profile/student-education/${eId}`)
  //   .pipe(map(resp => resp.data));
  // }
  
  deleteEducation = (data:any): Observable<any> => {
    const endpoint = environment.apiEndpoint+'profile/RemoveStudentEducation';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  deleteGrade(gId, formData): Observable<any> {
    return this.http.post<ApiGenericResponse<any>>(`${environment.apiEndpoint}profile/student-education-grade/${gId}`, formData)
    .pipe(map(resp => resp.data));
  }


}
