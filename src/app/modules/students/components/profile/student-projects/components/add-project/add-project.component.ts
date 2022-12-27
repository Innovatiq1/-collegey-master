import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,AbstractControl} from '@angular/forms';
import { StudentService } from 'src/app/core/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DescribeProject } from 'src/app/core/models/student-profile.model';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  projectForm: FormGroup;
  public onSubmitProjectEvent: EventEmitter<any> = new EventEmitter();
  addedProjectData: DescribeProject;
  title_error:any
  description_error:any
  project_url_error:any
  

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastrService: ToastrService,
    public bsModalRef: BsModalRef) {}

  onSubmitProjectData() {
    if(this.addedProjectData) {
      this.updateProjectData();
    } else {
      this.saveStudentProject();
    }
  }
  title(event){
    this.title_error=''
  }
  description(event){
    this.description_error=''
  }
  projet(event){
    this.project_url_error=''
  }

  updateProjectData() {
    this.studentService.updateDescribeProject(this.projectForm.getRawValue(), this.addedProjectData._id).subscribe(response => {
      if(response) {
        this.onSubmitProjectEvent.emit(response);
        this.toastrService.success('Project details updated');
      }
      this.bsModalRef.hide();
    }, (error) => {
      this.toastrService.error(error.message || 'Oops something went wrong');
    })
  }


  saveStudentProject() {
    let project =this.projectForm.getRawValue()
    let tittle= project.describe_any_project.title
    if(!tittle){
      this.title_error='Title is Required'
    } else if(!project.describe_any_project.description){
      this.description_error='Description is Required'
    } 
    // else if(!project.describe_any_project.project_url){
    //   this.project_url_error='Project Link is Required'
    // }
    
    // if (this.projectForm.invalid){
    //   this.toastrService.error('Please fill all fields');
    //   return; 
    // }
    else{
    this.studentService.addDescribeProjectSection(this.projectForm.getRawValue()).subscribe(
      (response) => {
        this.onSubmitProjectEvent.emit(response);
        this.toastrService.success('project added successfully');
        this.bsModalRef.hide();
        // window.location.reload();
      },
      (error) => {
        this.toastrService.error(error.message || 'Oops something went wrong');
      }
    );
    }
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      describe_any_project: this.fb.group({
        title: ['',Validators.required],
        description: ['',Validators.required],
        project_url: ['',Validators.required]
      }),
    });

    if(this.addedProjectData) {
      this.setExistingProjectData();
    }
  }

  public hasError = (controlName: string, errorName: string) => { 
    return this.projectForm.controls[controlName].hasError(errorName);
  };

  setExistingProjectData() {
    this.projectForm.patchValue({
      describe_any_project: {
        title: this.addedProjectData.title,
        description: this.addedProjectData.description,
        project_url: this.addedProjectData.project_url,
        _id: this.addedProjectData._id
      }
    });
  }
  
}
