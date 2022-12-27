import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,AbstractControl} from '@angular/forms';
import { StudentService } from 'src/app/core/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { Award } from 'src/app/core/models/student-profile.model';
import { Utils } from 'src/app/shared/Utils';

@Component({
  selector: 'app-add-awards',
  templateUrl: './add-awards.component.html',
  styleUrls: ['./add-awards.component.css'],
})
export class AddAwardsComponent implements OnInit {
  awardsForm: FormGroup;
  documentList = [];
  studentDocuments = AppConstants.STUDENT_DOCUMENT;

  onSubmitAwards: EventEmitter<any> = new EventEmitter();
  addedAwardsData: Award;
  title_error:any
  description_error:any
  file_error:any
  type_error:any
  role_error:any
  duration_error:any

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastrService: ToastrService
  ) {}

  onFileUpload(list) {
    this.awardsForm.patchValue({
      award: {
        file: list,
      },
    });
  }
  valuechange(event){
    this.type_error=''
  }
  valuechange1(event){
    this.title_error=''
  }
  valuechange2(event){
    this.role_error=''
  }
  valuechange3(event){
    this.duration_error=''
  }
  valuechange4(event){
    this.description_error=''
  }

  onSubmitForm() {
    if (this.addedAwardsData) {
      this.updateAward();
    } else {
      this.saveAward();
    }
  }

  updateAward() {
    const formData  = this.awardsForm.getRawValue();
    // if(formData.duration) {
    //   formData.duration = Utils.transformNumericDate(formData.duration);
    // }
    this.studentService.updateAward(formData, this.addedAwardsData._id).subscribe(response => {
      if(response) {
        this.onSubmitAwards.emit(response);
        this.toastrService.success('Award details updated');
        // window.location.reload();
      }
      this.bsModalRef.hide();
    },
    (error) => {
      this.toastrService.error(error.message || 'Oops something went wrong');
    })
  }

  saveAward() {
    // if (this.awardsForm.invalid){
    //   this.toastrService.error('Please fill all fields');
    //   return; 
    // }
    const formData = this.awardsForm.getRawValue();
    // console.log("======",formData)

    // if(formData.duration) {
    //   formData.duration = Utils.transformNumericDate(formData.duration);
    // }
    if(formData.award.type ===null|| formData.award.type ==''){
      this.type_error='Type is Required'
      return;
    } else if(formData.award.title===null|| formData.award.title==''){
      this.title_error='Title is Required'
      return;
    } else if(formData.award.role ===null|| formData.award.role==''){
      this.role_error='Role is Required'
      return;
    } else if(formData.award.duration===null|| formData.award.duration==''){
      this.duration_error='Duration is Required'
      return;
    }
    else if(formData.award.description ===null|| formData.award.description ==''){
      this.description_error='Description is Required' 
      return;

    }
    // else if(formData.award.file.length ===0){
    //   this.file_error='File is Required' 
    //   return;
    // }
    this.studentService.addAwards(formData).subscribe(
      (response) => {
        this.onSubmitAwards.emit(response);
        this.toastrService.success('Award details added');
        this.bsModalRef.hide();
        // window.location.reload();

      },
      (error) => {
        this.toastrService.error(error.message || 'Oops something went wrong');
      }
    );
  }

  setExistingAward() {
    this.awardsForm.patchValue({
      award: {
        type: this.addedAwardsData.type,
        title: this.addedAwardsData.title,
        description: this.addedAwardsData.description,
        duration: this.addedAwardsData.duration ?
          this.addedAwardsData.duration.map(duration => new Date(duration)) : null,
        file: this.addedAwardsData.file,
        role: this.addedAwardsData.role,
        issuing_organisation: this.addedAwardsData.issuing_organisation
      }
    });

    if(this.addedAwardsData.file){
      if(this.addedAwardsData.file.length > 0) {
        this.addedAwardsData.file.forEach(image => {
          this.documentList.push(image);
        });
      }
    }

  }

  ngOnInit(): void {  
    this.awardsForm = this.fb.group({
      award: this.fb.group({ 
        type: ['',Validators.required],
        title: ['',Validators.required],
        issuing_organisation: [''],
        role: [''],
        duration: ['',Validators.required],
        description: ['',Validators.required],
        file: ['',Validators.required],
      }),
    });

    if(this.addedAwardsData) {
      this.setExistingAward();
    }

    this.awardsForm.get('award').get('type').valueChanges.subscribe(value =>{
      this.awardsForm.patchValue({
        award: {
          title: null,
          description: null,
          duration: null,
          file: null,
          role: null,
          issuing_organisation: null
        }
      });
    })

  }
}
