import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  TemplateRef,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as moment_timezone from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import mixpanel from 'mixpanel-browser';
import { environment, timezone } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { defineLocale, updateLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { InviteeServiceService } from 'src/app/core/services/invitee-service.service';
import { CollegeyFeedService } from 'src/app/core/services/collegey-feed.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  @ViewChild('cal') cal: ElementRef;
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  attendingevent = false;
  submitted = false;
  createdEvents: any;
  allEvents: any = [];
  showErrorMessage = false;
  timeZoneList: any;
  selectedTimeZone: any;

  selectedMonth: any;
  eventsByMonth: any[] = [];
  eventsByUser: any[] = [];
  monthSort: Boolean = false;
  filterSubmitted: Boolean = false;

  current_eveneStatus: any;

  noEventData: Boolean = false;

  inviteFormGroup: FormGroup;
  inviteSubmitted = false;
  userInfo: any;

  dashboard: any;
  form: FormGroup;
  filterForm: FormGroup;
  banner: any;
  logo: any;
  userid: any;
  userName: any;
  fullname: any;
  userEmail: any;
  userTimezone: any;
  alleventlists: boolean = true;
  selectedEventDetails: any;
  // onlineEventCheckbox: any;

  width: 50;
  height: 50;

  eventCreationDate: any;

  modelDate = '';

  //feed pagination
  feedSize: any = 5;
  allFeeds: any;
  feedPage: any = 1;
  skipFeed: any = 0;
  loadMoreStatus: boolean = true;
  loadMoreStatusByMonths: boolean = true;
  loadMoreStatusByUser: boolean = true;

  // EventEditAction
  EventEditAction: boolean = false;
  event_id: any;
  siteurl: any;

  selectedYear: any;
  years: any[] = [];

  wordCount: any;
  words: any;

  //show word limit
  showWordLimitError: Boolean = false;

  //Event Month

  eventMonths = [
    {
      name: 'JAN',
      value: '01',
    },
    {
      name: 'FEB',
      value: '02',
    },
    {
      name: 'MAR',
      value: '03',
    },
    {
      name: 'APR',
      value: '04',
    },
    {
      name: 'MAY',
      value: '05',
    },
    {
      name: 'JUN',
      value: '06',
    },
    {
      name: 'JUL',
      value: '07',
    },
    {
      name: 'AUG',
      value: '08',
    },
    {
      name: 'SEP',
      value: '09',
    },
    {
      name: 'OCT',
      value: '10',
    },
    {
      name: 'NOV',
      value: '11',
    },
    {
      name: 'DEC',
      value: '12',
    },
  ];

  fetchcurrentImageheight: any;
  fetchcurrentImagewight: any;
  lernBoxCollection:any;

  // Feeds Questions
  collegyFeedsQuestions:any;
  constructor(
    private modalService: BsModalService,
    private studentDashboardService: StudentDashboardService,
    private mentorDashboardService: MentorDashboardService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private inviteeService: InviteeServiceService,
    private localeService: BsLocaleService,
    private collegeyFeedService:CollegeyFeedService
  ) {
    this.timeZoneList = timezone;
    enGbLocale.invalidDate = 'Filter Events';
    defineLocale('collegey', enGbLocale);
    this.localeService.use('collegey');

    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo?.user;
    this.userid = loggedInInfo?.user._id;
    this.getCurrentUserData();
  }

  ngOnInit(): void {
    this.siteurl = environment.frontEndUrl;
    this.formbuilder();
    this.inviteForm();
    setTimeout(() => {
      this.createdEvent();
    }, 2000);
    this.dynamicLernBox();
    this.fetchSidebarQuetion();
  }

  fetchSidebarQuetion() {
    const obj = {
      userid: this.userInfo?._id,
    };
    this.studentDashboardService.fetchSidebarQuetion(obj).subscribe(
      (response) => {
        this.collegyFeedsQuestions = response?.data;
      },
      (err) => {

      },
    );
  }

  wordCounter(event) {
    if (event.keyCode != 32) {
      this.wordCount = event.target.value ? event.target.value.split(/\s+/) : 0;
      this.words = this.wordCount ? this.wordCount.length : 0;
    }

    if (this.words > 100) {
      this.showWordLimitError = true;
    } else {
      this.showWordLimitError = false;
    }
  }

  inviteForm() {
    this.inviteFormGroup = this.formBuilder.group({
      inviteName: [
        '',
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
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
    };

    this.inviteeService.createInvitee(data).subscribe(
      (response) => {
        this.inviteSubmitted = false;
        this.inviteFormGroup.reset();
        this.toastrService.success('Invite Sent Successfully');
      },
      (err) => {}
    );
  }
  public hasErrorInviteForm = (controlName: string, errorName: string) => {
    return this.inviteFormGroup.controls[controlName].hasError(errorName);
  };

  onChangeEventStatus(event: any) {
    this.current_eveneStatus = event.target.value;
    if (this.current_eveneStatus == 'online') {
      this.form.get('avenue_address').setErrors(null);
      this.form.get('feeStatus').setErrors(null);
    } else {
      this.form.get('online_link').setErrors(null);
    }
  }

  modalClose(){
    this.modalRef.hide()
    this.current_eveneStatus ='';
  }

  opentravelModal(
    template: TemplateRef<any>,
    EventEditAction: boolean,
    event_index: any
  ) {
    this.EventEditAction = EventEditAction;
    this.form.reset();
    this.showWordLimitError = false;
    this.banner = '';
    this.logo = '';
    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg',
      ignoreBackdropClick: true,
    });
    this.modalRef.setClass('modal-width');
    if (EventEditAction == true) {
      // this.event_operationStatus = 'Edit';
      this.event_id = this.allEvents[event_index]._id;
      // let obj = { event_id: event_id };
      this.form.patchValue({
        eventName: this.allEvents[event_index].eventName,
        startDate: moment(this.allEvents[event_index].startDate).format(
          'YYYY-MM-DD'
        ),
        startTime: this.convertTime12to24(
          this.allEvents[event_index].startTime
        ),
        endDate: moment(this.allEvents[event_index].endDate).format(
          'YYYY-MM-DD'
        ),
        endTime: this.convertTime12to24(this.allEvents[event_index].endTime),
        description: this.allEvents[event_index].description,
        event_status: this.allEvents[event_index].event_status,
        eventVisibility: this.allEvents[event_index].eventVisibility,
      });
      if (this.allEvents[event_index].timezone) {
        this.selectedTimeZone = this.allEvents[event_index].timezone;
      }
      if (this.allEvents[event_index].event_status == 'online') {
        this.form.patchValue({
          online_link: this.allEvents[event_index].online_link,
        });
        this.form.get('avenue_address').clearValidators();
        this.form.get('feeStatus').clearValidators();
        this.current_eveneStatus = this.allEvents[event_index].event_status;
      }
      if (this.allEvents[event_index].event_status == 'offline') {
        this.form.get('online_link').clearValidators();
        this.form.patchValue({
          avenue_address: this.allEvents[event_index].avenue_address,
          feeStatus: this.allEvents[event_index].feeStatus,
        });
        this.current_eveneStatus = this.allEvents[event_index].event_status;
      }
      this.logo = this.allEvents[event_index].logo;
      this.banner = this.allEvents[event_index].banner;
    }else{
      this.form.patchValue({
        online_link: 'https://www.',
      });
    }
  }
  convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  }

  clearFilter() {
    this.cal.nativeElement.value = '';
    this.getAllEvents();
    this.monthSort = false;
  }

  openDetailsModal(template: TemplateRef<any>, eventDetails) {    
    this.selectedEventDetails = eventDetails;
    this.eventCreationDate = new Date(
      this.selectedEventDetails.createdAt
    ).toDateString();
    this.modalRef1 = this.modalService.show(template, {
      class: 'gray modal-lg',
      ignoreBackdropClick: true,
    });
    this.modalRef1.setClass('modal-width');
  }

  getDashboradDetails() {
    this.studentDashboardService.getDashboardDetail().subscribe((res) => {
      this.dashboard = res;
    });
  }

  getCurrentUserData() {
    const obj = {
      userid: this.userid,
    };
    this.mentorDashboardService.getCurrentUserData(obj).subscribe(
      (response) => {
        this.userEmail = response.data.email;
        this.userName = response.data.name;
        this.fullname = response.data.name + ' ' + response.data.last_name;

        this.userTimezone = response?.data.student_profile?.geography.timezone;
      },
      (err) => {}
    );
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event));
      this.selectedMonth = event.date.getMonth();
      this.selectedYear = event.date.getFullYear();
      this.filterByMonth();
    };
    container.setViewMode('month');
  }

  formbuilder() {
    this.form = this.formBuilder.group({
      eventName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      timezone: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      description: [
        '',
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
      event_status: ['', Validators.required],
      online_link: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      avenue_address: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      feeStatus: ['', Validators.required],
      eventVisibility: ['', Validators.required],
      // onlineEvent: [''],
      registrationOrBroadcastLink: [''],
    });

    this.filterForm = this.formBuilder.group({
      month: ['', Validators.required],
      year: ['', Validators.required],
    });
  }

  myFunction(event) {
    if (event.target.value == '') {
      this.getAllEvents();
      this.monthSort = false;
    }
  }

  filterByMonth() {
    this.filterSubmitted = true;

    this.monthSort = true;
    this.eventsByMonth = [];
    this.feedSize = this.feedSize * this.feedPage;
    this.feedPage = 1;
    this.skipFeed = 0;
    this.loadMoreStatusByMonths = true;

    let obj = {
      startingMonth: this.selectedMonth + 1,
      startingYear: this.selectedYear,
      docLimit: this.feedSize,
      feedPage: this.feedPage,
      skipFeed: this.skipFeed,
    };

    this.studentDashboardService
      .getAllStudentEventsByMonth(obj)
      .subscribe((response) => {
        // this.eventsByMonth = response.data.data;

        if (this.feedPage * this.feedSize > this.eventsByMonth.length) {
          for (let i = 0; i < response.data.data.length; i++) {
            const singleEvent = response.data.data[i];
            this.eventsByMonth.push(singleEvent);
          }
        }

        if (this.eventsByMonth.length > 0) {
          this.noEventData = false;
        } else {
          this.noEventData = true;
        }

        if (
          this.eventsByMonth.length >= response.results ||
          response.results == undefined
        ) {
          this.loadMoreStatusByMonths = false;
        }

        for (let f = 0; f < this.eventsByMonth.length; f++) {
          var cust_start = moment(this.eventsByMonth[f]?.startDate).format(
            'YYYY-MM-DD'
          );
          var set_startDate =
            cust_start + ' ' + this.eventsByMonth[f]?.startTime;
          if (this.userTimezone === undefined) {
            this.eventsByMonth[f].startEvent = set_startDate;
          } else {
            var fetchNewdate = moment_timezone(set_startDate)
              .tz(this.userTimezone)
              .format('MMMM D YYYY HH:mm');
            this.eventsByMonth[f].startEvent = fetchNewdate;
          }
        }

        this.cdr.detectChanges();
      });
  }

  wordCounts(text, limit) {
    this.wordCount = text ? text.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
    if (this.words > limit) {
      return true;
    } else {
      return false;
    }
  }

  saveEvent() {
    const descriptionlimit = this.wordCounts(this.form.value.description, 100);

    this.submitted = true;
    // if (this.form.invalid) return;
    // console.log("==========",this.form.value.endTime)
    // let a = moment(this.form.value.startTime, ['h:mm A']).format('HH:mm');
    let a = moment(this.form.value.startTime, ['h:mm A']).format('hh:mm A');
    //  let a =  moment(this.form.value.endTime).hours();
    // console.log('a:', a);
    //  let b = moment(this.form.value.endTime, ['h:mm A']).format('HH:mm');
    let b = moment(this.form.value.endTime, ['h:mm A']).format('hh:mm A');
    // console.log('b:', b);
    let data = {
      eventName: this.form.value.eventName,
      timezone: this.form.value.timezone,
      startDate: this.form.value.startDate,
      currentMonth: this.form.value.currentMonth,
      startTime: a,
      endDate: this.form.value.endDate,
      endTime: b,
      description: this.form.value.description,
      online_link: this.form.value.online_link,
      avenue_address: this.form.value.avenue_address,
      feeStatus: this.form.value.feeStatus,
      event_status: this.form.value.event_status,
      eventVisibility: this.form.value.eventVisibility,
      // onlineEvent: this.onlineEventCheckbox,

      registrationOrBroadcastLink: this.form.value.registrationOrBroadcastLink,
      logo: this.logo,
      banner: this.banner,
    };

    // if(data.event_status == 'online'){
    //   this.form.get('avenue_address').clearValidators();

    //   this.form.get('feeStatus').clearValidators();

    // }
    // if(data.event_status == 'offline'){
    //   this.form.get('online_link').clearValidators();

    // }

    if (this.form.invalid || descriptionlimit) {
      const invalid = [];
      const controls = this.form.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      return;
    }
    // if (this.form.invalid){
    //     const invalid = [];
    //     const controls = this.form.controls;
    //     for (const name in controls) {
    //         if (controls[name].invalid) {
    //             invalid.push(name);
    //         }
    //     }

    //     if (data.event_status == 'online') {
    //       let onlineErrorArray = ['avenue_address', 'feeStatus'];
    //       if (this.isEqual(invalid, onlineErrorArray)) {
    //         this.studentDashboardService.saveStudentEvent(data).subscribe((res) => {
    //           this.createdEvents = res;
    //           if (res) {
    //             mixpanel.init('089a065ddf055461542dbc6154555107', {debug: true, ignore_dnt: true});
    //             mixpanel.track('Create Student Event', {
    //               "eventName": res.data.eventName,
    //               "Host Email": this.userEmail,
    //               "Host Name": this.userName,
    //               "timezone": res.data.timezone,
    //               "startDate": res.data.startDate,
    //               "startTime": res.data.startTime,
    //               "endDate": res.data.endDate,
    //               "endTime": res.data.endTime,
    //             });
    //             this.form.reset();
    //             this.current_eveneStatus = '';
    //             this.modalRef.hide();
    //             this.getAllEvents();
    //             // window.location.reload();
    //           }
    //         });
    //       } else {
    //         return;
    //       }
    //     } else
    //     if (data.event_status == 'offline') {
    //       let offlineErrorArray = ['online_link'];
    //       if (this.isEqual(invalid, offlineErrorArray)) {
    //         this.studentDashboardService.saveStudentEvent(data).subscribe((res) => {
    //           this.createdEvents = res;
    //           if (res) {
    //             mixpanel.init('089a065ddf055461542dbc6154555107', {debug: true, ignore_dnt: true});
    //             mixpanel.track('Create Student Event', {
    //               "eventName": res.data.eventName,
    //               "Host Email": this.userEmail,
    //               "Host Name": this.userName,
    //               "timezone": res.data.timezone,
    //               "startDate": res.data.startDate,
    //               "startTime": res.data.startTime,
    //               "endDate": res.data.endDate,
    //               "endTime": res.data.endTime,
    //             });

    //             this.current_eveneStatus = '';
    //             this.modalRef.hide();

    //             this.getAllEvents();
    //             this.form.reset();
    //             // window.location.reload();
    //           }
    //         });
    //       } else {
    //         return
    //       }
    //     } else {
    //       return
    //     }
    // };
    if (this.EventEditAction == true) {
      data['event_id'] = this.event_id;
      this.studentDashboardService.updateStudentEvent(data).subscribe((res) => {
        this.createdEvents = res;
        if (res) {
          // mixpanel.init('089a065ddf055461542dbc6154555107', {
          //   debug: true,
          //   ignore_dnt: true,
          // });
          this.toastrService.success('Event  Update Successfully!');
          // mixpanel.track('Create Student Event', {
          //   eventName: res.data.eventName,
          //   'Host Email': this.userEmail,
          //   'Host Name': this.userName,
          //   timezone: res.data.timezone,
          //   startDate: res.data.startDate,
          //   startTime: res.data.startTime,
          //   endDate: res.data.endDate,
          //   endTime: res.data.endTime,
          // });
          this.submitted = false;
          this.allEvents = [];
          this.form.reset();
          this.current_eveneStatus = '';
          this.modalRef.hide();
          this.cdr.detectChanges();
          this.getAllEvents();
          //window.location.reload();
        }
      });
    } else {
      data['organizer'] = this.userInfo?._id;
      this.studentDashboardService.saveStudentEvent(data).subscribe((res) => {
        this.createdEvents = res;
        if (res) {
          mixpanel.init('089a065ddf055461542dbc6154555107', {
            debug: true,
            ignore_dnt: true,
          });
          mixpanel.track('Create Student Event', {
            eventName: res.data.eventName,
            'Host Email': this.userEmail,
            'Host Name': this.userName,
            timezone: res.data.timezone,
            startDate: res.data.startDate,
            startTime: res.data.startTime,
            endDate: res.data.endDate,
            endTime: res.data.endTime,
          });
          this.submitted = false;
          this.form.reset();
          this.current_eveneStatus = '';
          this.modalRef.hide();
          this.getAllEvents();
          window.location.reload();
        }
      });
    }
  }

  isEqual(a, b) {
    return a.join() == b.join();
  }

  CheckAtteptUser(Atteptarray: any) {
    let userId = this.userid;
    let filtered = Atteptarray.filter(function (element) {
      return element.user == userId;
    });
    for (var i = 0; i < Atteptarray.length; i++) {
      if (Atteptarray[i].user == userId) {
        return true;
      }
    }
    return false;
  }

  saveAttend(id: any) {
    const obj = {
      userid: this.userid,
      id: id,
    };

    this.studentDashboardService.saveAttendEvent(obj).subscribe((res) => {
      if (res.results == 'user Id AllreadyExist') {
        this.toastrService.success(`This User Already Attend`);
        this.getAllEvents();
      } else if (res.status == 'success') {
        this.toastrService.success(`User Attend Sucessfully`);

        this.feedSize = this.feedSize * this.feedPage;
        this.feedPage = 1;
        this.skipFeed = 0;
        this.allEvents = [];
        this.getAllEvents();
        this.cdr.detectChanges();
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
  // this.user = localStorage.getItem("user_data");
  // console.log("dddddddddddd",obj)

  loadMoreFeeds() {
    this.feedPage++;
    this.skipFeed += 5;
    this.getAllEvents();
    this.cdr.detectChanges();
  }
  loadMoreFeedsByMonths() {
    this.feedPage++;
    this.skipFeed += 5;
    this.filterByMonth();
    this.cdr.detectChanges();
  }
  loadMoreFeedsbyUser() {
    this.feedPage++;
    this.skipFeed += 5;
    this.getAllAttendingEvents();
    this.cdr.detectChanges();
  }

  getAllEvents() {    
    //feed pagination
    let obj = {
      docLimit: this.feedSize,
      feedPage: this.feedPage,
      skipFeed: this.skipFeed,
    };
    this.studentDashboardService
      .getAllStudentEvents(obj)
      .subscribe((response) => {
        // this.allEvents = res.data.data.reverse();
        if (this.feedPage * this.feedSize > this.allEvents.length) {
          for (let i = 0; i < response.data.data.length; i++) {
            const singleEvent = response.data.data[i];
            this.allEvents.push(singleEvent);
          }
        }

        if (
          this.allEvents.length >= response.results ||
          response.results == undefined
        ) {
          this.loadMoreStatus = false;
        }

        for (let f = 0; f < this.allEvents.length; f++) {
          var cust_start = moment(this.allEvents[f]?.startDate).format(
            'YYYY-MM-DD'
          );
          var set_startDate = cust_start + ' ' + this.allEvents[f]?.startTime;
          if (this.userTimezone === undefined) {
            this.allEvents[f].startEvent = set_startDate;
          } else {
            var fetchNewdate = moment_timezone(set_startDate)
              .tz(this.userTimezone)
              .format('MMMM D YYYY HH:mm');
            this.allEvents[f].startEvent = fetchNewdate;
          }
        }
        this.cdr.detectChanges();
      });
  }
  createdEvent() {
    this.getAllEvents();
  }

  // add images

  uploadFileApi(file) {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      formData.append('files', file);
      this.http
        .post(environment.apiEndpointNew + 'public/uploadFile', formData)
        .subscribe(
          (res: any) => {
            resolve(res.url);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  // uploadFileApi(file) {
  //   return new Promise((resolve, reject) => {
  //     let formData = new FormData();
  //     formData.append('files', file);
  //     this.http.post('http://beta.api.collegey.com/x-api/v1/public/uploadFile', formData)
  //       .subscribe((res: any) => {
  //         resolve(res.url);
  //       }, (err => {
  //         reject(err);
  //       }))
  //   })
  // }

  getAllAttendingEvents() {
    this.eventsByUser = [];
    this.feedSize = this.feedSize * this.feedPage;
    this.feedPage = 1;
    this.skipFeed = 0;
    this.loadMoreStatusByUser = true;

    let obj = {
      userId: this.userid,
      docLimit: this.feedSize,
      feedPage: this.feedPage,
      skipFeed: this.skipFeed,
    };

    this.studentDashboardService
      .getAllEventsByUser(obj)
      .subscribe((response) => {
        if (this.feedPage * this.feedSize > this.eventsByUser.length) {
          for (let i = 0; i < response.data.data.length; i++) {
            const singleEvent = response.data.data[i];
            this.eventsByUser.push(singleEvent);
          }
        }

        if (
          this.eventsByUser.length >= response.results ||
          response.results == undefined
        ) {
          this.loadMoreStatusByUser = false;
        }

        for (let f = 0; f < this.eventsByUser.length; f++) {
          var cust_start = moment(this.eventsByUser[f]?.startDate).format(
            'YYYY-MM-DD'
          );
          var set_startDate =
            cust_start + ' ' + this.eventsByUser[f]?.startTime;
          if (this.userTimezone === undefined) {
            this.eventsByUser[f].startEvent = set_startDate;
          } else {
            var fetchNewdate = moment_timezone(set_startDate)
              .tz(this.userTimezone)
              .format('MMMM D YYYY HH:mm');
            this.eventsByUser[f].startEvent = fetchNewdate;
          }
        }

        this.cdr.detectChanges();
      });
  }

  uploadImage(event, type) {
    var _URL = window.URL || window.webkitURL;
    var fileMatch, imgesData;

    if ((fileMatch = event.target.files[0])) {
      imgesData = new Image();
      var objectUrl = _URL.createObjectURL(fileMatch);
      imgesData.onload = function () {
        var currentWidth = this.width;
        var currentHeight = this.height;
        window.localStorage.setItem('currentImageheight', currentHeight);
        window.localStorage.setItem('currentImagewight', currentWidth);
        _URL.revokeObjectURL(objectUrl);
      };
      imgesData.src = objectUrl;
    }

    setTimeout(() => {
      this.fetchcurrentImageheight = localStorage.getItem('currentImageheight');
      this.fetchcurrentImagewight = localStorage.getItem('currentImagewight');

      if (
        type == 'banner' &&
        this.fetchcurrentImagewight <= 730 &&
        this.fetchcurrentImageheight <= 190
      ) {
        this.uploadFileApi(event.target.files[0])
          .then((data) => {
            if (type == 'banner') {
              this.banner = data;
            } else {
              this.logo = data;
            }
          })
          .catch((err) => {
            // console.log(err, "Image Not Uploaded");
          });
      } else if (
        type == 'logo' &&
        this.fetchcurrentImagewight <= 50 &&
        this.fetchcurrentImageheight <= 50
      ) {
        this.uploadFileApi(event.target.files[0])
          .then((data) => {
            if (type == 'banner') {
              this.banner = data;
            } else {
              this.logo = data;
            }
          })
          .catch((err) => {
            // console.log(err, "Image Not Uploaded");
          });
      } else {
        if (type == 'banner') {
          this.toastrService.error('The maximum size for the 730*190');
        } else {
          this.toastrService.error('The maximum size for the 50*50');
        }
        localStorage.removeItem('currentImageheight');
        localStorage.removeItem('currentImagewight');
        return;
      }
    }, 1000);
  }

  changeTab(evt) {
    if (evt == 'all') {
      // window.location.reload();
      this.alleventlists = true;
      this.attendingevent = false;
    } else {
      this.monthSort = false;
      this.getAllAttendingEvents();
      this.alleventlists = false;
      this.attendingevent = true;
    }
  }

  public hasErrorEvent = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };

  public hasErrorEvent1 = (controlName: string, errorName: string) => {
    return this.filterForm.controls[controlName].hasError(errorName);
  };

  // updateEventType(evt){
  //   if(evt.target.checked){
  //     this.onlineEventCheckbox = true;
  //   }else{
  //     this.onlineEventCheckbox = false;
  //   }
  // }

  dynamicLernBox(){
    this.collegeyFeedService.getAcademicBoxData('').subscribe((res)=>{
      this.lernBoxCollection=res.data[0].collegeyAcademy[0]
    })
  }
}
