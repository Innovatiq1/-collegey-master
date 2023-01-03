import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestService } from 'src/app/core/services/invest.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import {DomSanitizer,SafeHtml,} from '@angular/platform-browser';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { StaticDataService } from 'src/app/core/services/static-data.service';


@Component({
  selector: 'app-collegey-fund',
  templateUrl: './collegey-fund.component.html',
  styleUrls: ['./collegey-fund.component.css']
})
export class CollegeyFundComponent implements OnInit {

  fundForm: FormGroup;
  submitted:boolean = false;
  countryPhoneCode:any=[];

  selectedCountryCode : any = "Select Country Code";

  constructor(
    private fb: FormBuilder,
    private investService : InvestService,
    private router : Router,
    private toastrService: ToastrService,
    private domSanitizer :DomSanitizer,
    private staticService :StaticDataService
  ){ 
    this.getCountriescode();
  }

  ngOnInit(): void {
    this.fundForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(AppConstants.EMAIL_PATTERN)]],
      mobile: ["", [Validators.required]],
      city: ["", [Validators.required]],
      countryCode:[this.selectedCountryCode,[Validators.required]],
      // countryCode:["",[Validators.required]],
      country: ["", [Validators.required]],
      fundAmount: ["", [Validators.required]],
    });

    this.dynamicData();
  } 
  
  createForm() {
    
  }


  markAllTouched() {
    for (const i in this.fundForm.controls) {
      this.fundForm.controls[i].markAsDirty();
      this.fundForm.controls[i].updateValueAndValidity();
    }
  } 

  get f(){return this.fundForm.controls}

  save() {
    this.submitted = true;
    let obj = this.fundForm.value;
    if (this.fundForm.invalid) {
      return;
    }
    this.investService.createCollegeyFund(obj).subscribe(
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
    this.investService.getFundAllData({}).subscribe((res)=>{
      this.dynamicValue = res.data[0];
    })
  }

  getCountriescode(){
    this.staticService.publicgetCountries().subscribe((res:any)=>{
      const phoneCodeArray = res
      .map((item) => {
        return {
          label: `${item.phone_code} ${item.name}`,
          value: item.phone_code
        };
      });
    localStorage.setItem(
      AppConstants.KEY_COUNTRY_PHONE_CODE,
      JSON.stringify(phoneCodeArray)
    );    
    })
    setTimeout(() => {
      this.countryPhoneCode = JSON.parse(
        localStorage.getItem(AppConstants.KEY_COUNTRY_PHONE_CODE)
      )
    }, 1000);
      
  }
  
}
