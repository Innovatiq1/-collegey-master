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
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { map } from 'rxjs/operators';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import {
  WaysToBeInTouch,
  ParentDetails,
  PhoneNumber,
} from 'src/app/core/models/student-profile.model';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { Utils } from 'src/app/shared/Utils';
import { StudentProfileStatus } from 'src/app/core/enums/student-profile-status.enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { User } from 'src/app/core/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/core/services/student.service';
import { ConfirmedValidator } from 'src/app/shared/validators/confirmed.validator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-personal-details',
  templateUrl: './student-personal-details.component.html',
  styleUrls: ['./student-personal-details.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentPersonalDetailsComponent implements OnInit, OnDestroy {
  selectParentData: any;
  changePwd: FormGroup;
  @Input() studentProfileData;
  modalRef: BsModalRef;
  bannerImage: String;
  @Input() section;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSubmitPersonalDetailsForm = new EventEmitter();
  @Output() onBackForm = new EventEmitter();
  userId;
  url: any = [];
  name_error: any
  email_error: any
  phone_error: any
  phone_error1: any


  socialMediaChannels = AppConstants.SOCIAL_MEDIA_CHANNEL;
  personalDetailsForm: FormGroup;
  personalDetailsSubscription: Subscription;
  parentsDetailsFormArray: FormArray;
  counselorDetailsFormArray: FormArray;
  socialMedialFormArray: FormArray;
  user: User = JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA)).user;
  countryPhoneCode = JSON.parse(
    localStorage.getItem(AppConstants.KEY_COUNTRY_PHONE_CODE)
  );

  @ViewChild('channelLink') channelLink;

  SOCIAL_MEDIA_HANDLE = [
    {
      name: 'Facebook',
      base_url: 'https://www.facebook.com/',
    },
    {
      name: 'Instagram',
      base_url: 'https://www.instagram.com/',
    },
    {
      name: 'Twitter',
      base_url: 'https://twitter.com/',
    },
    {
      name: 'Youtube',
      base_url: 'https://www.youtube.com/channel/'
    },
    {
      name: 'Snapchat',
      base_url: 'https://story.snapchat.com/s/'
    },
    {
      name: 'LinkedIn',
      base_url: 'https://www.linkedin.com/in/'
    },
    {
      name: 'Pinterest',
      base_url: 'https://in.pinterest.com/'
    },
    {
      name: 'Blog',
      base_url: 'https://'
    },
    {
      name: 'Video link',
      base_url: 'https://video.link/'
    },
    {
      name: 'Tumblr',
      base_url: 'https://www.tumblr.com/'
    },
    {
      name: 'Twitch',
      base_url: 'https://www.twitch.tv/'
    },
    {
      name: 'Spotify',
      base_url: 'https://open.spotify.com/'
    },
    {
      name: 'Reddit',
      base_url: 'https://www.reddit.com/'
    },
    {
      name: 'Periscope',
      base_url: 'https://www.periscope.com/'
    },
    {
      name: 'GroupMe',
      base_url: 'https://groupme.com/en-GB/'
    },
    {
      name: 'Discord',
      base_url: ' https://discord.com/'
    },
    {
      name: 'Tik Tok',
      base_url: 'https://www.tiktok.com/en/'
    },
    {
      name: 'Houseparty',
      base_url: 'https://housepartygame.com/'
    },
    {
      name: 'Monkey',
      base_url: 'https://monkeyrun.fun/'
    }
  ];

  constructor(
    private staticDataService: StaticDataService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef, private modalService: BsModalService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private studentService: StudentService,
    private datePipe: DatePipe
  ) {
    this.changePwd = fb.group({
      'oldPwd': ['', Validators.required],
      'newPwd': ['', Validators.required],
      'confirmPwd': ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('newPwd', 'confirmPwd')
    });

  }

  get f() {
    return this.changePwd.controls;
  }

  bannerUpload(files) {
    if (files && files.length > 0) {
      const fd = new FormData();
      fd.append('files', files[0]);
      fd.append('type', 'single');
      this.commonService
        .uploadImage(fd, ImageSource.BANNER_IMAGE)
        .subscribe((res) => {
          this.bannerImage = res;
          // console.log("Banner Image", this.bannerImage, res)
          this.updateProfile();
        });
    }
  }
  updateProfile() {
    this.commonService
      .uploadProfile({ bannerImage: this.bannerImage })
      .subscribe((res) => {
        if (res) {
          this.commonService.$isBannerImageChanged.next(true);
          this.cdr.detectChanges()
          this.toastrService.success('Profile Banner Uploaded');
        }
      });
  }

  initPersonalDetailForm() {
    let studentJsonData: Observable<FormGroup>;
    if (this.studentProfileData.student_profile.ways_to_be_in_touch && Object.keys(this.studentProfileData).length > 0) {
      studentJsonData = of(this.studentProfileData);
    } else {
      studentJsonData = this.staticDataService.getStudentOnBoardingForm();
    }

    return studentJsonData.pipe(
      map((apiResponse: any) =>
        this.fb.group({
          ways_to_be_in_touch: this.createWaysToBeTouchForm(
            apiResponse.student_profile.ways_to_be_in_touch
          ),
        })
      )
    );
  }

  // create personal details form model by looping on each form control
  createWaysToBeTouchForm(waysToBeTouch: WaysToBeInTouch) {
    return this.fb.group({
      dob: [waysToBeTouch ? (waysToBeTouch.dob ? this.datePipe.transform(new Date(waysToBeTouch.dob), 'yyyy-MM-dd') : null) : null],
      age: [waysToBeTouch ? waysToBeTouch.age : null],


      phone_number: this.createPhoneFormGroup(waysToBeTouch ? waysToBeTouch.phone_number : null),
      parents_details: this.addParentDetailFormGroup(waysToBeTouch ? waysToBeTouch.parents_details : null),
      school_counselor: this.fb.array(
        // set value in school counselor form Array
        waysToBeTouch.school_counselor.length > 0
          ? waysToBeTouch.school_counselor.map((counselor) =>
            this.addSchoolCounselorFormGroup(counselor)
          )
          : [this.addSchoolCounselorFormGroup()]
      ),
      social_media: this.fb.array(
        // set value in social media form Array
        waysToBeTouch.social_media && waysToBeTouch.social_media.length > 0
          ? waysToBeTouch.social_media.map((item) =>
            this.addSocialMediaFormGroup(item)
          )
          : [this.addSocialMediaFormGroup()]
      ),
      is_completed: [
        waysToBeTouch.is_completed ? waysToBeTouch.is_completed : false,
      ],
    });
  }

  createPhoneFormGroup(phoneNumber: PhoneNumber): FormGroup {
    return this.fb.group({
      // set value in phone_number formGroup
      extension: [phoneNumber ? phoneNumber.extension : null],
      number: [
        phoneNumber ? phoneNumber.number : null,
        [CustomValidators.phoneValidator],
      ],
    });
  }

  // add school counselor formGroup
  addSchoolCounselorFormGroup(counselor?): FormGroup {
    return this.fb.group({
      name: [counselor ? counselor.name : null],
      privacy: [counselor ? counselor.privacy : null],

      email: [
        counselor ? counselor.email : null,
        [CustomValidators.emailValidator],
      ],
    });
  }

  // add parent details formGroup
  addParentDetailFormGroup(parentDetail: ParentDetails = null): FormGroup {
    this.selectParentData = parentDetail;
    return this.fb.group({
      name: [parentDetail ? parentDetail.name : null],
      email: [
        parentDetail ? parentDetail.email : null,
        [CustomValidators.emailValidator],
      ],
      relation: [parentDetail ? parentDetail.relation : 'father'],
      privacy: [parentDetail ? parentDetail.privacy : null],

      relation_with_guardian: [parentDetail ? parentDetail.relation_with_guardian : null],
      phone_number: parentDetail ? this.createPhoneFormGroup(parentDetail.phone_number) :
        this.createPhoneFormGroup(null)
    });
  }

  // social Media FormGroup
  addSocialMediaFormGroup(socialMedia?): FormGroup {
    return this.fb.group({
      channel_name: [socialMedia ? socialMedia.channel_name : null],
      channel_link: [
        socialMedia ? socialMedia.channel_link : null,
        [CustomValidators.urlValidator],
      ],
    });
  }

  // remove social media form group
  onRemoveSocialMedia(index) {
    this.socialMedialFormArray.removeAt(index);
  }

  onClickAddSocialMedial() {
    this.socialMedialFormArray.push(this.addSocialMediaFormGroup());
  }
  email(event) {
    this.email_error = ''

  }
  name(event) {
    this.name_error = ''

  }


  onSubmitForm(exit) {
    // submit form
    // console.log("Personal Form",this.personalDetailsForm.invalid,this.personalDetailsForm.dirty,this.personalDetailsForm.errors)
    if (this.personalDetailsForm.invalid && this.personalDetailsForm.dirty) {
      // return;
    }
    const formData = this.personalDetailsForm.getRawValue();
    // console.log("Personal Details", formData);
    let number = formData.ways_to_be_in_touch
    let name1 = formData.ways_to_be_in_touch.parents_details
    // console.log("========", name1.phone_number)
    //let test1 ='name' in test
    //console.log("=================",test1)
    //  if (number.phone_number.number ===null|| number.phone_number.number ==='') {
    //   this.phone_error1="Your cell number is Required"

    // }
    if(exit){
    if (name1.name === null) {
      this.name_error = "Full Name is Required"

    } else if (name1.email === null) {
      this.email_error = "Email is Required"

    }
    // else if (name1.phone_number.number ===null|| name1.phone_number.number ==='') {
    //   this.phone_error="Your cell number is Required"
    // }
    else {
      this.studentService.redirectToDashboard(exit);
      let persoanlFormData = this.personalDetailsForm.getRawValue();
      persoanlFormData.ways_to_be_in_touch.redirectAction = exit;
      // console.log('persoanlFormData===>', persoanlFormData);
      
      this.onSubmitPersonalDetailsForm.emit(persoanlFormData);
    }
  }else {
      this.studentService.redirectToDashboard(exit);
      let persoanlFormData = this.personalDetailsForm.getRawValue();
      persoanlFormData.ways_to_be_in_touch.redirectAction = exit;
      // console.log('persoanlFormData===>', persoanlFormData);
      
      this.onSubmitPersonalDetailsForm.emit(persoanlFormData);
    }
  }
  number(event) {
    this.phone_error = ''
  }
  number1(event) {
    this.phone_error1 = ''
  }


  onFormBack() {
    const formData = this.personalDetailsForm.getRawValue();
    this.onBackForm.emit(formData);
  }
  onSelectSocialMediaHandle(channel, index) {
    // console.log("======channel===", channel.target.value)
    //let url = '';
    const avengers = this.SOCIAL_MEDIA_HANDLE.filter(character => character.name === channel.target.value);
    // console.log("========",avengers[0].base_url)
    //let url1 = avengers[0].base_url
    //this.url.push(avengers[0].base_url)
    // console.log(this.url)
    // this.SOCIAL_MEDIA_HANDLE.filter(handle => 

    //   // if(handle.name === channel) {
    //   //   console.log("dddddddddddddd",handle.base_url)


    // this.SOCIAL_MEDIA_HANDLE.forEach(handle => {
    //   if(handle.name === channel) {
    //     this.url = handle.base_url;

    //   }
    // });
    // console.log("hi",this.url);

    this.socialMedialFormArray.at(index).patchValue({
      channel_link: avengers[0].base_url
    });
    this.moveCursorToEnd(this.channelLink);

  }

  moveCursorToEnd(el) {
    el.nativeElement.focus();
    if (typeof el.nativeElement.selectionStart == "number") {
      el.selectionStart = el.nativeElement.selectionEnd = el.nativeElement.value.length;
    } else if (typeof el.nativeElement.createTextRange != "undefined") {
      const range = el.nativeElement.createTextRange();
      range.collapse(false);
      range.select();
    }
  }

  ngOnInit() {
    this.commonService.getUserDetails().subscribe((resp) => {
      this.userId = resp._id;
    });

    this.countryPhoneCode.sort(function (a, b) {
      return a.value - b.value;
    });

    
    this.personalDetailsSubscription = this.initPersonalDetailForm().subscribe(
      (form) => {
        this.personalDetailsForm = form;
        this.counselorDetailsFormArray = Utils.typeCastToFormArray(
          this.personalDetailsForm,
          StudentProfileStatus.WAYS_TO_BE_IN_TOUCH,
          'school_counselor'
        );
        this.socialMedialFormArray = Utils.typeCastToFormArray(
          this.personalDetailsForm,
          StudentProfileStatus.WAYS_TO_BE_IN_TOUCH,
          'social_media'
        );
        this.cdr.detectChanges();
      }
    );

    this.personalDetailsForm?.get('ways_to_be_in_touch')?.get('parents_details')?.get('relation').valueChanges.subscribe(value => {
      if (value) {
        if (this.selectParentData.relation != value) {
          this.personalDetailsForm.patchValue({
            ways_to_be_in_touch: {
              // phone_number: {
              //   number: null,
              //   extension: null
              // },
              parents_details: {
                name: null,
                email: null,
                phone_number: {
                  number: null,
                  extension: null
                }
              }
            }
          });
        } else {
          this.personalDetailsForm.patchValue({
            ways_to_be_in_touch: {
              // phone_number: {
              //   number: this.selectParentData.phone_number.number,
              //   extension: this.selectParentData.phone_number.extension
              // },
              parents_details: {
                name: this.selectParentData.name,
                email: this.selectParentData.email,
                phone_number: {
                  number: this.selectParentData.phone_number.number,
                  extension: this.selectParentData.phone_number.extension
                }
              }
            }
          });
        }
      }
    });
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  changePswd(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true }));
  }

  onSubmitPsd() {
    let data = {
      "id": this.userId,
      "oldPassword": this.changePwd.value.oldPwd,
      "newPassword": this.changePwd.value.newPwd,
    }
    // console.log('id')
    this.studentService.changePassword(data).subscribe(result => {
      this.toastrService.success('Password Changed Successfully')
      this.modalRef.hide();
    })
  }

  ngOnDestroy(): void {
    this.personalDetailsSubscription.unsubscribe();
  }
}
