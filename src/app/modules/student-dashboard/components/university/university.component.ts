import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { MentorService } from 'src/app/core/services/mentor.service';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InviteeServiceService } from 'src/app/core/services/invitee-service.service';
import { CollegeyFeedService } from 'src/app/core/services/collegey-feed.service';

@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.css']
})
export class UniversityComponent implements OnInit {
  attendingevent = false;
  modalRef: BsModalRef;
  All = false;
  Mentor = true;
  University = false;
  tab: any = 'tab2';
  tab1: any
  tab2: any
  tab3: any
  Clicked: boolean
  dashboard: any;
  MentorData: any;
  mentorList1: any = [];
  userid: any;
  totalGroupItems: any;
  totalGroupItemsMy: any;
  ele: any
  univList: any = [];
  pageSrNo: number = 0;

  inviteFormGroup: FormGroup;
  inviteSubmitted = false;
  userInfo: any;

  //dynamic learning box
  lernBoxCollection:any

  constructor(
    private modalService: BsModalService,
    private studentDashboardService: StudentDashboardService,
    private mentorService: MentorService,
    public commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private inviteeService: InviteeServiceService,
    private collegeyFeedService: CollegeyFeedService,
  ) {
    this.getAllMentorUserData();
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo?.user;
    this.userid = loggedInInfo?.user._id;
  }

  ngOnInit(): void {
    this.Mentor = false;
    this.University = true;
    this.tab = this.tab3;
    this.university(3);
    // this.activatedRoute.queryParams.subscribe(params => {
    this.mentorList2('');
    this.showUnive();
    this.inviteForm();
    this.dynamicLernBox()
  }

  inviteForm() {
    this.inviteFormGroup = this.formBuilder.group({
      inviteName: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      email: ["", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      mobile_number: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
  }
  save() {
    this.inviteSubmitted = true;
    if (this.inviteFormGroup.invalid) {
      return;
    }

    let data = {
      name: this.inviteFormGroup.value.inviteName,
      last_name: '',
      email: this.inviteFormGroup.value.email,
      cellNumber: this.inviteFormGroup.value.mobile_number,
      type: 'student',
      referemail: this.userInfo?.email,
      status: 'invite join',
      isActive: false,
    }

    this.inviteeService.createInvitee(data).subscribe(
      (response) => {
        this.inviteSubmitted = false;
        this.inviteFormGroup.reset();
        this.toastrService.success('Invite Sent Successfully');
      },
      (err) => {
        this.toastrService.error('Invite Sent Failed');
      },
    );

  }
  public hasErrorInviteForm = (controlName: string, errorName: string) => {
    return this.inviteFormGroup.controls[controlName].hasError(errorName);
  };

  searchByMentor(event: any) {
    var filterName = event.currentTarget.value;
    this.mentorList2(filterName);
  }

  mentorList2(filterName: any) {

    this.mentorService.getMentorList(filterName).subscribe((response: any) => {
      this.mentorList1 = response.response
      this.totalGroupItems = response.response
      this.totalGroupItemsMy = response.response.length;
      // console.log(" totalGroupItems : ",this.totalGroupItems);
      this.mentorList1 = this.totalGroupItems.slice(0, 10);

      //   if(response.totalDocs - (+filters.limit) < -11) {
      //     this._showSnackbar("No more data found")
      //   }
      // }, error => {
      //   this.isLoading = false;
      //   this.snackbar.open(error.message, null , {duration: 3000});
    });
  }

  CheckMentorFollow(Followarray: any) {
    let userId = this.userid;
    let filtered = Followarray.filter(function (element) {
      return element.user == userId;
    });
    for (var i = 0; i < Followarray.length; i++) {
      if (Followarray[i].user == userId) {
        return true;
      }
    }
    return false;
  }

  openPeopleInfo(template: TemplateRef<any>, ele) {
    // console.log("======", ele)
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
    this.ele = ele
  }

  mentorid(ele) {
    // console.log("heeeeeeeeeee", ele.id)
    localStorage.setItem("mentorid", ele.id);
  }

  saveFollwer(id: any) {
    //console.log("====ssssssssssssssssss",id)
    const obj = {
      userid: this.userid,
      id: id
    };
    this.studentDashboardService.saveFollower(obj).subscribe((res) => {
      //console.log("dddddddddddddd",res)
      if (res.results == 'user Id AllreadyExist') {
        // this.showErrorMessage = false;
        this.toastrService.success(`This User Already Follow`);
        this.mentorList2('');
        // console.log("dddddUsrs")
      } else if (res.status == 'success') {
        this.toastrService.success(`User Follow Sucessfully`);
        this.mentorList2('');
      }
      // if (res) {
      //   this.getAllEvents()
      //   // mixpanel.init('089a065ddf055461542dbc6154555107', {debug: true, ignore_dnt: true}); 
      //   // mixpanel.track('Create Student Event', {
      //   //   "eventName": res.data.eventName,
      //   //   "Host Email": this.userEmail,
      //   //   "Host Name": this.userName,
      //   //   "timezone": res.data.timezone,
      //   //   "startDate": res.data.startDate,
      //   //   "startTime": res.data.startTime,
      //   //   "endDate": res.data.endDate,
      //   //   "endTime": res.data.endTime,
      //   // });
      //   // console.log(res, 'Dashboard Details');
      //   // this.form.reset();
      //   // this.modalRef.hide();
      //   // this.getAllEvents();

      // } else if(res.results==='user Id AllreadyExist'){
      //   console.log("======AllreadyHave a User====",)

      // }
      // console.log(res, 'Dashboard Details');
    });
  }

  saveUnFollwer(id: any) {
    const obj = {
      userid: this.userid,
      id: id
    };
    this.studentDashboardService.saveunFollower(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.mentorList2('');
      },
      (err) => {
        this.toastrService.error('not updated');
      },
    );
  }

  saveUniverCityFollwer(id: any) {
    // console.log("====ssssssssssssssssss", id)
    const obj = {
      userid: this.userid,
      id: id
    };
    this.studentDashboardService.saveUniverCityFollower(obj).subscribe((res) => {
      //console.log("dddddddddddddd",res)
      if (res.results == 'user Id AllreadyExist') {
        // this.showErrorMessage = false;
        this.toastrService.success(`This User Already Follow`);
        this.showUnive()



        // console.log("dddddUsrs")

      } else if (res.status == 'success') {
        this.toastrService.success(`User Follow Sucessfully`);
        this.showUnive()


      }


    });
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.mentorList1 = this.totalGroupItems.slice(startItem, endItem);
  }

  // pagination for groups
  pageChangedMy(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pageSrNo = startItem;
    this.mentorList1 = this.totalGroupItemsMy.slice(startItem, endItem);
    // console.log(" myQuestionsAndAnswer pageChangedMy : ",this.myQuestionsAndAnswer);
  }

  showMentor() {
    this.mentorService.getMentor().subscribe((res: any) => {
      this.mentorList1 = res.response;
      // console.log('list', this.mentorList1);
    });
  }

  showUnive() {
    this.mentorService.getUniv().subscribe((res: any) => {
      this.univList = res.response;
      // console.log('list', this.univList);
    });
  }

  getAllMentorUserData() {
    const obj = {};
    this.studentDashboardService.getAllMentorUserData(obj).subscribe(
      (response) => {
        this.MentorData = response?.data;
      },
      (err) => {

      },
    );
  }

  opentravelModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true }));
    this.modalRef.setClass("modal-width");
  }
  attendevent() {
    // console.log("hii")
    this.attendingevent = true
  }
  university(check) {
    if (check == 3) {
      this.tab = 'tab3';
    }
    this.All = false;
    this.University = true;
    this.Mentor = false;

  }
  all(check) {
    if (check == 1) {
      this.tab = 'tab1';
    }
    this.All = true;
    this.University = false;
    this.Mentor = false;
  }
  mentor(check) {
    if (check == 2) {
      this.tab = 'tab2';
    }
    this.All = false;
    this.University = false;
    this.Mentor = true;
  }
  getDashboradDetails() {
    this.studentDashboardService.getDashboardDetail().subscribe((res) => {
      this.dashboard = res;
      // console.log(res, "Dashboard Details");
    })
  }

  dynamicLernBox(){
    this.collegeyFeedService.getAcademicBoxData('').subscribe((res)=>{
      this.lernBoxCollection=res.data[0].collegeyAcademy[0]
    })
  }
}
