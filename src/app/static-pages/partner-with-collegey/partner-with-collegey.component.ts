import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestService } from 'src/app/core/services/invest.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';


@Component({
  selector: 'app-partner-with-collegey',
  templateUrl: './partner-with-collegey.component.html',
  styleUrls: ['./partner-with-collegey.component.css']
})
export class PartnerWithCollegeyComponent implements OnInit {

  collegeyPartnerForm: FormGroup;
  submitted:boolean = false;
  constructor(
    private fb: FormBuilder,
    private investService : InvestService,
    private router : Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.collegeyPartnerForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(AppConstants.EMAIL_PATTERN)]],
      city: ["", [Validators.required]],
      country: ["", [Validators.required]],
      organisation: ["", [Validators.required]],
      bestText: [""],
    });
    this.dynamicData()
  }
  
  get f(){return this.collegeyPartnerForm.controls}

  save() {
    this.submitted = true;
    let obj = this.collegeyPartnerForm.value;
    console.log("obj",obj);
    return;
    if (this.collegeyPartnerForm.invalid) {
      return;
    }    
    this.investService.createCollegyPartner(obj).subscribe(
      (response) => {
        this.toastrService.success("Thank you. We will follow up soon");
        // this.router.navigateByUrl('/');
      },
      (err) => {
        this.toastrService.error("Error" + err);
      },
    );
    
  }

  dynamicValue:any={};
 
  dynamicData(){
    this.investService.getParnerAllData({}).subscribe((res)=>{
      this.dynamicValue = res.data[0];
    })
  }

}
