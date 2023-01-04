import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { UserType } from 'src/app/core/enums/user-type.enum';
import { AuthService } from 'src/app/core/services/auth.service';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import referralCodeGenerator from 'referral-code-generator';
import { InviteeServiceService } from 'src/app/core/services/invitee-service.service';
import { ToastrService } from 'ngx-toastr';

import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-corousal-one',
  templateUrl: './corousal-one.component.html',
  styleUrls: ['./corousal-one.component.css'],
})
export class CorousalOneComponent implements OnInit {
  @Input() screenHeight: number;
  @Input() homepageContent:any;
  
  modalRef: BsModalRef;
  form: FormGroup;
  submitted: boolean = false;
  isChecked: boolean = false;
  screenWidth: number;
  mobileView: boolean;

  constructor(
    private route: Router,
    private authService: AuthService,
    private modalService: BsModalService,
    private route1: ActivatedRoute,
    private fb: FormBuilder,
    private inviteeService: InviteeServiceService,
    private toastrService: ToastrService
  ) {
    this.screenWidth = window.innerWidth;
    //console.log(this.screenWidth);
    if (this.screenWidth < 900) {
      this.mobileView = true;
    }
    if (this.screenWidth >= 900) {
      this.mobileView = false;
    }
  }

  ngOnInit(): void {
    if(this.route1.snapshot.fragment){
    if(this.route1.snapshot.fragment.length>0){
      this.authService.openAuthDialog(AuthType.SIGN_UP, null, null);
    }
  }
   
  }
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
    //this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-sm');
    this.createForm();
  }
  login() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.authService.openAuthDialog(AuthType.LOGIN, UserType.STUDENTS);
  }
  invite() {
    this.route.navigate(['invite']);
  }

  isAuthenticated() {
    return this.authService.getToken();
  }
  
  public hasError = (controlName: string, errorName: string) => { 
    return this.form.controls[controlName].hasError(errorName);
  };

  eventCheck(event){
    if(event.target.checked){
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
}



  createForm() {
    this.form = this.fb.group(
      {
        type: ["", [Validators.required]],
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.pattern(AppConstants.EMAIL_PATTERN)]],
        cellNumber: ["", [Validators.required]],
        shouldAgree: [null, Validators.required],
      },
    );
    // this.coursesFromArray.push(this.fb.group([]));
    // this.form.valueChanges.subscribe(() => {
      
    // });
  }
  continue() {}
  markAllTouched() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
  }
  onClose(){
    this.modalRef.hide();
  }

  onLogOut() {
    this.authService.logOut();
    localStorage.removeItem('user_data');
    localStorage.removeItem('static_data');
   // localStorage.clear();
  }
  
  save() {
    this.submitted = true;
    return new Promise<void>((resolve, reject) => {
      this.markAllTouched();
      if (this.form.valid && this.form.get('shouldAgree').value) {
         // console.log(this.form.value);
          this.form.value.status = 'waitlisted';
          // this.form.value.activation_code = referralCodeGenerator.custom('uppercase', 6, 2, this.form.value.email.split('@')[0]);
          this.form.value.isActive = false;
          this.inviteeService.createInvitee(this.form.value).subscribe(
            (res) => {
              this.modalRef.hide();
              this.toastrService.success(`Join wait list successfully`);
              resolve();
            },
            (err) => {
              reject();
            },
            () => {
              reject();
            }
          );
      }
    });
  }
}
