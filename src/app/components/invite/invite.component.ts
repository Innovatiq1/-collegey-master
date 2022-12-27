import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InviteeServiceService } from 'src/app/core/services/invitee-service.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css'],
})
export class InviteComponent implements OnInit {

  form: FormGroup;
  constructor(private router: Router,private fb: FormBuilder,private inviteeService:InviteeServiceService) {}
  inviteEmail: boolean = false;
  showErrorMessage = false;

  ngOnInit(): void {
    this.createForm()
  }
  markAllTouched() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
  }
  continue() { 
    this.inviteEmail = true;   
    return new Promise<void>((resolve, reject) => {
      this.markAllTouched();
      if (this.form.valid) {
          localStorage.setItem("referemail",this.form.value.email);
          this.router.navigateByUrl('/user-selection');
          // this.inviteeService.activateInvitee(this.form.value).subscribe(
          //   (res) => { 
          //     resolve();
          //     if(res){
          //       this.router.navigateByUrl('/user-selection');
          //     }
          //   },
          //   (err) => {
          //     debugger;
          //     reject();
          //   },
          //   () => {
          //     reject();
          //   }
          // );
      } else {
        this.showErrorMessage = true;
      }
    });
  } 
  createForm() {
    this.form = this.fb.group(
      {
        //activation_code: ["", [Validators.required]],
        email: ["", [Validators.required, CustomValidators.emailValidator]],
      },
    );
    // this.coursesFromArray.push(this.fb.group([]));
    this.form.valueChanges.subscribe(() => {
      
    });
  }

  public hasError = (controlName: string, errorName: string) => { 
    return this.form.controls[controlName].hasError(errorName);
  };
  
}
