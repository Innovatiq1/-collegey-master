import { Component, TemplateRef, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, Observable, of } from 'rxjs';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { map } from 'rxjs/operators';
import { Interest } from 'src/app/core/models/student-profile.model';
import { StudentService } from 'src/app/core/services/student.service';
import { Countries, State, Cities } from 'src/app/core/models/static-data.model';


@Component({
  selector: 'app-student-interests',
  templateUrl: './student-interests.component.html',
  styleUrls: ['./student-interests.component.css']
})
export class StudentInterestsComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  @Input() studentProfileData;
  @Input() section;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSubmitInterestForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();

  interestFormSubscription: Subscription;
  interestAreas:any = [];
  projectDashboardProjects:any=[]
  projectDashboardProjects1:any=[]
  AddIntrestForm:FormGroup;
  AddSubjectForm:FormGroup;

  cities: Cities[];
  cityId: any;
  stateId: any;
  cityName: any;


  // interestAreas = AppConstants.STUDENT_INTERESTED_AREAS;
  studentFavoriteSubjects = AppConstants.STUDENT_FAVORITE_SUBJECTS;
  dropdownSettings={};
  dropdownSettingsintrests={};
  interest_error:any
  Interest1=''
  fav_error=''


  studentInterestForm: FormGroup;
  constructor(
    private staticDataService: StaticDataService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {
    this.AddIntrestForm = this.fb.group({
      requestedForName: ['',Validators.required],
    });
    this.AddSubjectForm = this.fb.group({
      requestedForName: ['',Validators.required],
    });
   }

  //  getCity(cityname) {
  //    console.log("City name ===>", cityname)
  //  }

  initInterestFormGroup() {
    let studentJsonData: Observable<FormGroup>;
    if (this.studentProfileData.student_profile.interest && Object.keys(this.studentProfileData).length > 0) {
      studentJsonData = of(this.studentProfileData);
    } else {
      studentJsonData = this.staticDataService.getStudentOnBoardingForm();
    }
    return studentJsonData.pipe(
      map((apiResponse: any) =>
        this.fb.group({
            interest: this.generateInterestForm(apiResponse.student_profile.interest),
        })
      )
    );
  }
  saveFunction(event) {
    this.interest_error=''
  }
  saveFunction1(event){
    this.fav_error=''
  }

  addIntrest(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true})
    );
  }

  getCityList(id) {
    this.staticDataService.getCities(id).subscribe(
      (response) => {
        for (let index = 0; index < response.length; index++) {
          if (response[index].id == this.cityId) {
            this.cityName = response[index].name;
            this.cdr.detectChanges();
          }
          
        }
      },
      (error) => {
       // this.toastrService.error(error.message || 'Oops something went wrong');
      }
    );
  }

  AddIntrest(){
    // console.log("hello")
    let obj = this.AddIntrestForm.value;
    // console.log("hii",obj);
    let data={
      ininterest:obj.requestedForName
    }
    this.studentService.addIntrestsArea(data).subscribe( (response:any) =>{
      // console.log("=======",response)
    if(response){
      // console.log("hellooooooooo")
      this.modalRef.hide();
      this.studentService.addListIntrest(data).subscribe( (response:any) =>{
        let data={
          ininterest:'sssdgggfffgggggggbbbb'
        }
        this.studentService.addListIntrest(data).subscribe( (response:any) =>{
          // console.log("=======",response)
        // this.projectDashboardProjects=response.projectDashboardProjects.interest;
        let listInterests = response.projectDashboardProjects.map((person=>person.interest));
        this.projectDashboardProjects = listInterests.reverse();
        this.AddIntrestForm.reset();
        // console.log(result)
        // console.log("heeeeeeeeeeeeeeeeee",response.projectDashboardProjects.interest)
         });
      })
    }
     });
  }
  saveIntrest(event){
    // console.log("hiiiiiiiii");
  }
  saveSubject(event){
    // console.log("hiiiiiiiii");
  }
  AddSubject(){
    // console.log("hello")
    let obj = this.AddSubjectForm.value;
    // console.log("hii",obj);
    let data={
      subject:obj.requestedForName
    }
    this.studentService.addSubjectsArea(data).subscribe( (response:any) =>{
    if(response){
      this.modalRef.hide();
      let data1={
        subject:'sssdgggfffgggggggbbbb'
      }
      this.studentService.addListSubject(data1).subscribe( (response:any) =>{
        let listSubs = response.projectDashboardProjects.map((person=>person.subject));
      this.projectDashboardProjects1 = listSubs.reverse();
      this.AddSubjectForm.reset();
       });
    }
     });
  }
  addSubject(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true})
    );
  }


  generateInterestForm(interest: Interest): FormGroup {
    return this.fb.group({
      interest_area: [interest.interest_area],
      fav_subjects: [interest.fav_subjects],
      key_problems: [interest.key_problems],
      secondkey_problems: [interest.secondkey_problems],
      is_completed: [false]
    });
  }

  // add tags in dropdown
  addTagFn(name) {
    return { name};
  }

  onSubmitForm(exit: boolean): void {
    let interest =this.studentInterestForm.getRawValue().interest.interest_area
    let favourite= this.studentInterestForm.getRawValue().interest.fav_subjects

    this.Interest1 =interest[0]
    if(exit){
    if(exit){
    if(interest.length===0 ){
      this.interest_error="Please Select Interest Areas"

    }else if(favourite.length===0){
      this.fav_error="Please Select Favourite Subjects"
    }
  else{
      this.studentService.redirectToDashboard(exit);  // exit after save or not
      let InterestFormData = this.studentInterestForm.getRawValue();
      InterestFormData.interest.redirectAction = exit;
      this.onSubmitInterestForm.emit(InterestFormData);
      }
    }else{
    this.studentService.redirectToDashboard(exit);  // exit after save or not
    let InterestFormData = this.studentInterestForm.getRawValue();
    InterestFormData.interest.redirectAction = exit;
    this.onSubmitInterestForm.emit(InterestFormData);
    }
  }
  onFormBack(){
    const formData = this.studentInterestForm.getRawValue();
    this.onBackForm.emit(formData);
  }

  ngOnDestroy(): void {
    this.interestFormSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.studentService.getStudentProfile().subscribe((profileData) => {
      this.cityId = profileData.student_profile.geography.city;
      this.stateId = profileData.student_profile.geography.state;
      this.getCityList(this.stateId);
      this.cdr.detectChanges();
  });

    this.interestFormSubscription = this.initInterestFormGroup().subscribe(form => {
      this.studentInterestForm = form;
    });
    this.dropdownSettingsintrests = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      limitSelection: 4

    };
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      limitSelection: 4
    };
    this.interestAreas = [
    'Sports',
    'Music',
    'Performing',
    'Arts',
    'Visual Arts',
    'Volunteer Activity',
    'Music Writing',
    'Photography',
    'Public Speaking',
    'Environment Related Projects', 'Social Projects', 'Design Projects',
    'Recycling',
    'Tutoring/Coaching',
    'Social Activities',
    'Fundraising',
    'Gardening',
    'Doing Art Projects',
    'Doing Science Projects',
    ];
    let data={
      ininterest:'sssdgggfffgggggggbbbb'
    }
    this.studentService.addListIntrest(data).subscribe( (response:any) =>{
    
    // this.projectDashboardProjects=response.projectDashboardProjects.interest;
    this.projectDashboardProjects = response.projectDashboardProjects.map((person=>person.interest));
    // console.log(result)
    
     });
     let data1={
      subject:'sssdgggfffgggggggbbbb'
    }
    this.studentService.addListSubject(data1).subscribe( (response:any) =>{
      
    this.projectDashboardProjects1=response.projectDashboardProjects.map((person=>person.subject));
     });

  }


}
