import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,AbstractControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/core/services/student.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Recommendation } from 'src/app/core/models/student-profile.model';
import {
  KnowYouBetter,
  CommonKnowYouBetter,
} from 'src/app/core/models/student-profile.model';
import {
  Headed,
  ExpectedYearToStart,
  WishToStudy,
  TestInfo,
} from 'src/app/core/models/student-profile.model';

@Component({
  selector: 'app-about-work',
  templateUrl: './about-work.component.html',
  styleUrls: ['./about-work.component.css']
})
export class AboutWorkComponent implements OnInit {
  aboutWorkForm: FormGroup;
  documentList: any;
  public onSubmitRecommendationEvent: EventEmitter<any> = new EventEmitter();
  addedRecommendData : Recommendation;
  adddocument: FormArray;
  testInfoArray: FormArray;
  title_error:any
  description_error:any
  file_error:any
  //sample_error:any

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private studentService: StudentService,
    public bsModalRef: BsModalRef,
  ) {
    this.documentList = [];
   }

  onSubmitData() {
    if(this.addedRecommendData) {
      this.updateRecommendation();
    } else {
      this.saveRecommendation();
    }
  }
 

  updateRecommendation() {
    this.studentService.updateStudentWork(this.aboutWorkForm.getRawValue(), this.addedRecommendData._id).subscribe(response => {
      if(response) {
        this.onSubmitRecommendationEvent.emit(response);
        this.toastrService.success('Recommendation Details Updated');
      }
      this.bsModalRef.hide();
    }, (error) => {
      this.toastrService.error(error.message || 'Oops something went wrong');
    })
  }
  valuechange(event){
    this.title_error=''
  }
  valuechange1(event){
    this.description_error=''
  }
  valuechange2(event){
    this.file_error=''
  }
  

  onFileUpload(list){
    this.aboutWorkForm.patchValue({
      someone_said_something_or_recommendation: {
        file: list
      }
    });
    this.file_error=''
  }

  saveRecommendation() {
    //console.log("=========",this.aboutWorkForm.getRawValue())
    let sample = this.aboutWorkForm.getRawValue()
    // if (this.aboutWorkForm.invalid){
    //   this.toastrService.error('Please fill all fields');
    //   return; 
    // }
    if(sample.someone_said_something_or_recommendation.title===null|| sample.someone_said_something_or_recommendation.title==''){
      this.title_error='Title is Required'
      return;
    }else if(sample.someone_said_something_or_recommendation.description ===null|| sample.someone_said_something_or_recommendation.description ==''){
      this.description_error='Description is Required' 
      return;

    }
    // else if(sample.someone_said_something_or_recommendation.file.length ===0){
    //   this.file_error='File is Required' 
    //   return;

    // }
    this.studentService.addStudentWork(this.aboutWorkForm.getRawValue()).subscribe(response => {
      this.onSubmitRecommendationEvent.emit(response);
      this.toastrService.success('Recommendation added successfully');
      this.bsModalRef.hide();
      window.location.reload();
    },
    (error) => {
      this.toastrService.error(error.message || 'Oops something went wrong');
    });
  }

  setExistingRecommendation() {
    this.aboutWorkForm.patchValue({
      someone_said_something_or_recommendation: {
        title: this.addedRecommendData.title,
        description: this.addedRecommendData.description,
        file: this.addedRecommendData.file
      }
    })
    if(this.addedRecommendData.file){
      if(this.addedRecommendData.file.length > 0) {
        this.addedRecommendData.file.forEach(image => {
          this.documentList.push(image);
        });
      }
    }
  }
  ngOnInit(): void {
    this.aboutWorkForm = this.fb.group({
      someone_said_something_or_recommendation: this.fb.group({
        title: ['',Validators.required],
        description: ['',Validators.required],
        file: ['',Validators.required]
      })
    });
    if(this.addedRecommendData) {
      this.setExistingRecommendation()
    }
  }

}
function index(index: any, arg1: number) {
  throw new Error('Function not implemented.');
}

