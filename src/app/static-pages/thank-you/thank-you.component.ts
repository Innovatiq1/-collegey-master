import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { CareerService } from 'src/app/core/services/career.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css'],
})
export class ThankYouComponent implements OnInit {
  collegeyCareerform: FormGroup;
  inValidFileSize = false;
  completeNameDocumentList = [];
  submitted: boolean = false;

  selectedCountryCode : any = "Select Country Code";

  countryPhoneCode = JSON.parse(
    localStorage.getItem(AppConstants.KEY_COUNTRY_PHONE_CODE)
  );

  constructor(
    private fb: FormBuilder,
    private careerService: CareerService,
    private commonService: CommonService,
    private router: Router,
    private toastrService: ToastrService,
    private staticService :StaticDataService
  ) {
    this.getCountriescode();
  }

  ngOnInit(): void {
    this.collegeyCareerform = this.fb.group({
      name: ['', [Validators.required]],
      emailId: [
        '',
        [Validators.required, Validators.pattern(AppConstants.EMAIL_PATTERN)],
      ],
      city: ['', [Validators.required]],
      countryCode: [this.selectedCountryCode, [Validators.required]],
      // countryCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      cellNumber: [
        '',
        [Validators.required, Validators.pattern(AppConstants.PHONE_PATTERN)],
      ],
      linkedinId: [
        '',
        [Validators.required, Validators.pattern(AppConstants.URL_PATTERN)],
      ],
      expertise: ['', [Validators.required]],
      workTitle: ['', [Validators.required]],
      outcome: ['', [Validators.required]],
      resume: ['', [Validators.required]],
    });

    this.dynamicData();
  }

  // markAllTouched() {
  //   for (const i in this.collegeyCareerform.controls) {
  //     this.collegeyCareerform.controls[i].markAsDirty();
  //     this.collegeyCareerform.controls[i].updateValueAndValidity();
  //   }
  // }

  get f() {
    return this.collegeyCareerform.controls;
  }

  save() {
    this.submitted = true;
    // this.form.value.resume = this.completeNameDocumentList[0];
    this.collegeyCareerform.patchValue({
      resume: this.completeNameDocumentList[0],
    });
    // this.markAllTouched();
    if (this.collegeyCareerform.invalid) {
      return;
    }
    let formData = this.collegeyCareerform.getRawValue();
    this.careerService.createCareerProfile(formData).subscribe(
      (res) => {
        this.submitted = false;
        this.toastrService.success('Data Successfully Saved');
        this.collegeyCareerform.reset();
        this.completeNameDocumentList=[]
        this.router.navigateByUrl('/');
      },
      (err) => {
        console.log('Career Error', err);
        this.toastrService.error('Error' + err);
      }
    );
  }

  onSelectDocument(event) {
    const fileList = [];
    this.inValidFileSize = false;
    // called each time file input changes
    if (event.target.files && event.target.files.length > 0) {
      const input = event.target;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < input.files.length; i++) {
        const filesize = +(input.files[i].size / 1024 / 1024).toFixed(4);
        if (filesize > 5) {
          this.inValidFileSize = true;
          return;
        } else {
          fileList.push(input.files[i]);
        }
        // this.documentList.push(input.files[i].name);
      }
      const formData = new FormData();
      if (fileList.length > 0) {
        fileList.forEach((file) => {
          formData.append('files', file);
        });
      }
      if (fileList.length > 1) {
        formData.append('type', 'array');
      } else {
        formData.append('type', 'single');
      }
      this.uploadDocument(formData);
    }
  }

  uploadDocument(formData) {
    // this.documentList = [];
    this.commonService
      .publicuploadResume(formData, ImageSource.RESUME)
      .subscribe((file) => {
        // this.onFileUploadSuccess.emit(file);
        if (file instanceof Array) {
          file.forEach((document) => {
            this.completeNameDocumentList.push(document);
            this.collegeyCareerform.value.resume =
              this.completeNameDocumentList[0];
          });
        } else {
          this.completeNameDocumentList.push(file);
          this.collegeyCareerform.value.resume =
            this.completeNameDocumentList[0];
        }
      });
  }

  onRemoveDocument(index) {
    this.completeNameDocumentList.splice(index, 1);
  }

  dynamicValue:any={};
 
  dynamicData(){
    this.careerService.getAllData({}).subscribe((res)=>{
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
