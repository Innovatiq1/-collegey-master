import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Form, FormArray } from '@angular/forms';
import {
  KnowYouBetter,
  CommonKnowYouBetter,
} from 'src/app/core/models/student-profile.model';
import { Subscription, Observable, of } from 'rxjs';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { map } from 'rxjs/operators';
import { Utils } from 'src/app/shared/Utils';
import { StudentProfileStatus } from 'src/app/core/enums/student-profile-status.enum';
import { StudentService } from 'src/app/core/services/student.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-student-know-you-better',
  templateUrl: './student-know-you-better.component.html',
  styleUrls: ['./student-know-you-better.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentKnowYouBetterComponent implements OnInit, OnDestroy {
  @Input() studentProfileData: any;
  @Input() section;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSubmitKnowYouBetterForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();

  knowYouBetterForm: FormGroup;
  knowYouBetterFormSubscription: Subscription;
  inspirePeopleFormArray: FormArray;
  favouriteBooksFormArray: FormArray;
  favouriteMoviesFormArray: FormArray;
  favouriteWebsitesFormArray: FormArray;
  inspire_error:any
  inspireyou=''
  fav_books_error:any
  fav_movies_error:any

  favMessagingService = AppConstants.FAVOURITE_MESSAGING_SERVICE;

  favWebsitesList = [{"name":"test"}];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private staticDataService: StaticDataService,
    private cdr: ChangeDetectorRef
  ) {}

  initKnowYouBetterForm() {
    let studentJsonData: Observable<FormGroup>;
    if (this.studentProfileData.student_profile.know_you_better && Object.keys(this.studentProfileData).length > 0) {
      studentJsonData = of(this.studentProfileData);
    } else {
      studentJsonData = this.staticDataService.getStudentOnBoardingForm();
    }
    return studentJsonData.pipe(
      map((apiResponse: any) =>
        this.fb.group({
          know_you_better: this.generateKnowYouBatterForm(
            apiResponse.student_profile.know_you_better
          ),
        })
      )
    );
  }

  generateKnowYouBatterForm(knowYouBetter: KnowYouBetter) {
    this.handleKnowYouBatterForm(knowYouBetter);
    return this.fb.group({
      people_who_inspire_you: this.fb.array(
        knowYouBetter.people_who_inspire_you.length > 0
          ? knowYouBetter.people_who_inspire_you.map((item) =>
              this.addKnowYouBetterFromGroup(item)
            )
          : [this.addKnowYouBetterFromGroup(), this.addKnowYouBetterFromGroup()]
      ),

      fav_books: this.fb.array(
        knowYouBetter.fav_books.length > 0
          ? knowYouBetter.fav_books.map((item) =>
              this.addKnowYouBetterFromGroup(item)
            )
          : [this.addKnowYouBetterFromGroup(), this.addKnowYouBetterFromGroup()]
      ),
      fav_movies: this.fb.array(
        knowYouBetter.fav_movies.length > 0
          ? knowYouBetter.fav_movies.map((item) =>
              this.addKnowYouBetterFromGroup(item)
            )
          : [this.addKnowYouBetterFromGroup(), this.addKnowYouBetterFromGroup()]
      ),
      fav_websites: this.fb.array(
        knowYouBetter.fav_websites.length > 0
          ? knowYouBetter.fav_websites.map((item) =>
              this.addKnowYouBetterFromGroup(item)
            )
          : [this.addKnowYouBetterFromGroup()]
      ),
      fav_websites1 : [knowYouBetter ? knowYouBetter.fav_websites1 : null],
      fav_websites2 : [knowYouBetter ? knowYouBetter.fav_websites2 : null],
      fav_websites3 : [knowYouBetter ? knowYouBetter.fav_websites3 : null],
      fav_message_service: [
        knowYouBetter ? knowYouBetter.fav_message_service : null,
      ],
      fav_activity_on_internet: [
        knowYouBetter ? knowYouBetter.fav_activity_on_internet : null,
      ],
      is_completed: [false],
    });
  }
  onChange(event){
    // console.log("==========v")
    this.inspire_error=''
  }
  onChangebooks(event){
    this.fav_books_error=''
  }

  onChangemovies(event){
    this.fav_movies_error=''
  }

  handleKnowYouBatterForm(knowYouBetter: KnowYouBetter) {
    // perform manipulation on form model incase of
    // specific form array length is one
    if (knowYouBetter.people_who_inspire_you.length === 1) {
      knowYouBetter.people_who_inspire_you.push(new CommonKnowYouBetter());
    }
    if (knowYouBetter.fav_books.length === 1) {
      knowYouBetter.fav_books.push(new CommonKnowYouBetter());
    }
    if (knowYouBetter.fav_movies.length === 1) {
      knowYouBetter.fav_movies.push(new CommonKnowYouBetter());
    }
  }

  addKnowYouBetterFromGroup(object?: CommonKnowYouBetter): FormGroup {
    return this.fb.group({
      name: [object ? object.name : null],
    });
  }

  onAddWebsite(): void {
    if (this.favouriteWebsitesFormArray.length > 2) {
      return;
    }
    // console.log(this.favouriteWebsitesFormArray.length)
    this.favouriteWebsitesFormArray.push(this.addKnowYouBetterFromGroup());
    // console.log(this.favouriteWebsitesFormArray)
  }

  onRemoveWebsite(index) {
    this.favouriteWebsitesFormArray.removeAt(index);
  }

  onSubmitForm(exit) {
    // console.log("========",this.knowYouBetterForm.getRawValue())
    let people_who_inspire_you = this.knowYouBetterForm.getRawValue().know_you_better.people_who_inspire_you
    let favbooks = this.knowYouBetterForm.getRawValue().know_you_better.fav_books
    let favMovies = this.knowYouBetterForm.getRawValue().know_you_better.fav_movies
    //let favbooks = this.knowYouBetterForm.getRawValue().know_you_better.fav_books
    this.inspireyou = people_who_inspire_you[0].name
    if(exit){
    if(people_who_inspire_you[0].name===null || people_who_inspire_you[0].name==''){
      this.inspire_error="Please enter people who inspire you"

    } else if(favbooks[0].name===null ||favbooks[0].name===''){
      this.fav_books_error="Please enter favourite books"
    }else if(favMovies[0].name===null ||favMovies[0].name===''){
      this.fav_movies_error="Please enter favourite movies"
    }
    else{
   
      this.studentService.redirectToDashboard(exit); // in case of save and exit button click
      let YouBetterFormData = this.knowYouBetterForm.getRawValue();
      YouBetterFormData.know_you_better.fav_websites = this.favWebsitesList;
      YouBetterFormData.know_you_better.redirectAction = exit;
      this.onSubmitKnowYouBetterForm.emit(YouBetterFormData);
     }
    }else{
   
    this.studentService.redirectToDashboard(exit); // in case of save and exit button click
    let YouBetterFormData = this.knowYouBetterForm.getRawValue();
    YouBetterFormData.know_you_better.fav_websites = this.favWebsitesList;
    YouBetterFormData.know_you_better.redirectAction = exit;
    this.onSubmitKnowYouBetterForm.emit(YouBetterFormData);
   }
  }
  onFormBack(){
    const formData = this.knowYouBetterForm.getRawValue();
    this.onBackForm.emit(formData);
  }

  ngOnInit(): void {
    this.knowYouBetterFormSubscription = this.initKnowYouBetterForm().subscribe(
      (form) => {
        this.knowYouBetterForm = form;
        if (this.knowYouBetterForm) {
          this.inspirePeopleFormArray = Utils.typeCastToFormArray(
            this.knowYouBetterForm,
            StudentProfileStatus.KNOW_YOU_BETTER,
            'people_who_inspire_you'
          );
          this.favouriteBooksFormArray = Utils.typeCastToFormArray(
            this.knowYouBetterForm,
            StudentProfileStatus.KNOW_YOU_BETTER,
            'fav_books'
          );
          this.favouriteMoviesFormArray = Utils.typeCastToFormArray(
            this.knowYouBetterForm,
            StudentProfileStatus.KNOW_YOU_BETTER,
            'fav_movies'
          );
          this.favouriteWebsitesFormArray = Utils.typeCastToFormArray(
            this.knowYouBetterForm,
            StudentProfileStatus.KNOW_YOU_BETTER,
            'fav_websites'
          );
        }
        this.cdr.detectChanges();
      });
    
  }

  ngOnDestroy(): void {
    this.knowYouBetterFormSubscription.unsubscribe();
  }
}
