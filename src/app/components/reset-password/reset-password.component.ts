import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { ConfirmedValidator } from 'src/app/shared/validators/confirmed.validator';
import { StudentService } from 'src/app/core/services/student.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  changePwd: FormGroup;
  submitted: boolean = false;
  id:any;
  siteKey:string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastrService: ToastrService
  )
  { 
    this.id = this.route.snapshot.paramMap.get('id');
    this.siteKey = environment.recaptcha_key; 
    this.changePwd = fb.group({
      'oldPwd': ['',Validators.required],
      'newPwd': ['', [Validators.required, Validators.minLength(8)]],
      'confirmPwd': ['', Validators.required],
      'recaptcha': ['', Validators.required],
    }, { 
      validator: ConfirmedValidator('newPwd', 'confirmPwd')
    });
  }

  ngOnInit(): void {
  }

  public hasError = (controlName: string, errorName: string) => { 
    return this.changePwd.controls[controlName].hasError(errorName);
  };

  onSubmitPsd(){
    this.submitted = true;
    if (this.changePwd.invalid) {
      return;
    }
    let obj = this.changePwd.value;
    obj['user_id'] = this.id;
    this.studentService.resetNewPassword(obj).subscribe(
      (response) => {
        if(response){
          this.toastrService.success(`Password Update Successfully`);
          this.router.navigateByUrl(`/`);
        }
      },
      (err) => {
      },
    );
    
  }

}
