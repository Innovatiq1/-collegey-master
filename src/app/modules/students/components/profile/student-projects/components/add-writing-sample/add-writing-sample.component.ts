import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,AbstractControl} from '@angular/forms';
import { StudentService } from 'src/app/core/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { WritingSample } from 'src/app/core/models/student-profile.model';

@Component({
  selector: 'app-add-writing-sample',
  templateUrl: './add-writing-sample.component.html',
  styleUrls: ['./add-writing-sample.component.css']
})
export class AddWritingSampleComponent implements OnInit {

  writingSampleForm: FormGroup;
  documentList: any;

  addedWritingSampleData: WritingSample;

  onSubmitWritingSample: EventEmitter<any> = new EventEmitter();

  title_error:any
  description_error:any
  file_error:any
  sample_error:any

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastrService: ToastrService,

  ) { 
    this.documentList = [];
  }

  onFileUpload(list){
    // console.log(list);
    this.writingSampleForm.patchValue({
      writing_sample: {
        file: list
      }
    });
    this.file_error=''
  }

  onSubmitForm() {
    if(this.addedWritingSampleData) {
      this.updateWritingSample();
    } else {
      this.saveWritingSample();
    }
  }
  valuechange3(event){
    this.sample_error=''
  }

  updateWritingSample() {
    let sample = this.writingSampleForm.getRawValue()
    if(sample.writing_sample.answer ===null|| sample.writing_sample.answer ==''){
      this.sample_error='please select writing samples'
      return;
    }
    if(sample.writing_sample.answer =='Yes'){
      if(sample.writing_sample.title===null|| sample.writing_sample.title==''){
       this.title_error='Title is Required'
       return;
     }else if(sample.writing_sample.description ===null|| sample.writing_sample.description ==''){
       this.description_error='Description is Required' 
       return;
 
     }
   } else if(sample.writing_sample.answer =='No'){
     if(sample.writing_sample.description ===null|| sample.writing_sample.description ==''){
       this.description_error='Description is Required' 
       return;
 
     }
     
   }else if(sample.writing_sample.answer =='I am thinking about it'){
    if(sample.writing_sample.title ===null|| sample.writing_sample.title ==''){
      this.title_error='Title is Required' 
      return;

    }

  }
    this.studentService.updateWritingSample(this.writingSampleForm.getRawValue(), this.addedWritingSampleData._id).subscribe(sample => {
      if(sample) {
        this.onSubmitWritingSample.emit(sample);
        this.toastrService.success('Writing Sample Details Updated');
      }
      this.bsModalRef.hide();
    });
  }

  saveWritingSample() {
    let sample = this.writingSampleForm.getRawValue()
    if(sample.writing_sample.answer ===null|| sample.writing_sample.answer ==''){
      this.sample_error='please select writing samples'
      return;
    }
    if(sample.writing_sample.answer =='Yes'){
     if(sample.writing_sample.title===null|| sample.writing_sample.title==''){
      this.title_error='Title is Required'
      return;
    }else if(sample.writing_sample.description ===null|| sample.writing_sample.description ==''){
      this.description_error='Description is Required' 
      return;
    } 
  } else if(sample.writing_sample.answer =='No'){
    if(sample.writing_sample.description ===null|| sample.writing_sample.description ==''){
      this.description_error='Description is Required' 
      return;

    }
    
  } else if(sample.writing_sample.answer =='I am thinking about it'){
    if(sample.writing_sample.title ===null|| sample.writing_sample.title ==''){
      this.title_error='Topic description is required'  
      return;

    }

  }
    // else if(sample.writing_sample.file ===null|| sample.writing_sample.description ==''){
    //   this.file_error='File is Required' 
    //   return;

    // }
    // if (this.writingSampleForm.invalid){
    //   this.toastrService.error('Please fill all fields');
    //   return; 
    // }
    this.studentService.addWritingSample(this.writingSampleForm.getRawValue()).subscribe(response => {
      this.onSubmitWritingSample.emit(response);
      this.toastrService.success('Writing Sample Successfully Added');
      this.bsModalRef.hide();
      window.location.reload();
  },
  (error) => {
    this.toastrService.error(error.message || 'Oops something went wrong');
  });
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
  setExistingWritingSample() {
    this.writingSampleForm.patchValue({
      writing_sample: {
        title: this.addedWritingSampleData.title,
        description: this.addedWritingSampleData.description,
        file: this.addedWritingSampleData.file,
        answer: this.addedWritingSampleData.answer
      }
    });

    if(this.addedWritingSampleData.file){
      if(this.addedWritingSampleData.file.length > 0) {
        this.addedWritingSampleData.file.forEach(image => {
          this.documentList.push(image);
        });
      }
    }
  }

  onSelectEducationType(event) {
      this.writingSampleForm.patchValue({
        writing_sample : {
            title : null,
            description: null,
            file: null
          }
        });
      this.documentList = [];
  }

  ngOnInit(): void {
    this.writingSampleForm = this.fb.group({
      writing_sample: this.fb.group({
        answer: ['',Validators.required],
        title: ['',Validators.required],
        description: ['',Validators.required],
        file: ['',Validators.required]
      })
    });
    if(this.addedWritingSampleData) {
      this.setExistingWritingSample();
    }
  }

}
