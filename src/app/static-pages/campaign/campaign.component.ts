import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestService } from 'src/app/core/services/invest.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';

import { CustomValidators } from 'src/app/shared/validators/custom-validators';


@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit {

  campingForm: FormGroup;
  submitted:boolean = false;
  constructor(
    private fb: FormBuilder,
    private investService : InvestService,
    private router : Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.campingForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(AppConstants.EMAIL_PATTERN)]],
      city: ["", [Validators.required]],
      country: ["", [Validators.required]],
      organisation: ["", [Validators.required]],
    });
    this.dynamicData()
  }

  get f(){return this.campingForm.controls}

  save() {
    this.submitted = true;
    let obj = this.campingForm.value;
    if (this.campingForm.invalid) {
      return;
    }
    this.investService.createInvestProfile(obj).subscribe(
      (response) => {
        this.toastrService.success("Thank you. We will follow up soon");
        this.router.navigateByUrl('/');
      },
      (err) => {
        this.toastrService.error("Error" + err);
      },
    );
    
  }
  dynamicValue:any={};
  dynamicData(){
    this.investService.getAllData({}).subscribe((res)=>{
      this.dynamicValue = res.data[0];      
    })
  }
}
