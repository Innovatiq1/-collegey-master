import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Load Services
import { CommonService } from 'src/app/core/services/common.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/models/user.model';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { environment, timezone } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import * as moment_timezone from 'moment-timezone';
import mixpanel from 'mixpanel-browser';

@Component({
  selector: 'app-tab-mentor-hostevent',
  templateUrl: './tab-mentor-hostevent.component.html',
  styleUrls: ['./tab-mentor-hostevent.component.css']
})
export class TabMentorHosteventComponent implements OnInit {
  userInfo: User = new User();
  timeZoneList: any;
  modalRef: BsModalRef;

  // schedule Event Form
  scheduleEventForm: FormGroup;
  submittedEvent: boolean = false;
  eventImage: any;
  mentorHostevent: any;
  EventUserList: any = [];
  EventEditAction: boolean = false;
  event_id: any;
  current_eveneStatus: any;
  event_operationStatus: any = 'Add';

  //delete event
  deleteEventId: any;

  //show word limit
  wordCount: any;
  words: any;
  showWordLimitError: Boolean = false;

  //no event data
  noEventData: boolean = false;
  
  // Filter schedule Event listing
  filter_hostEvent:any = 'all_event';
  userTimezoneData:any;
  selectedTimeZone: any;
  constructor(
    private mentorDashboardService: MentorDashboardService,
    public commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private http: HttpClient
  ) {
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
    this.timeZoneList = timezone;
    this.userTimezoneData = this.userInfo?.mentor_profile;

    this.scheduleEventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      description: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      timezone: ['', Validators.required],
      event_status: ['', Validators.required],
      online_link: [''],
      avenue_address: [''],
      startDate: ['09:00', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['10:00', Validators.required],
      eventFrequency: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.getHostevent();
  }

  public hasErrorEvent = (controlName: string, errorName: string) => {
    return this.scheduleEventForm.controls[controlName].hasError(errorName);
  };

  onChangeEventStatus(event: any) {
    this.current_eveneStatus = event.target.value;
  }

  onChangeEventFilter(event: any) {
    this.filter_hostEvent = event.target.value;
    this.getHostevent();
  }

  deleteConformationEvent(template: TemplateRef<any>, eventId: any) {
    this.deleteEventId = eventId;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  uploadEventImage(event) {
    var file = event.target.files;
    if (file[0].type == 'image/jpeg' || file[0].type == 'image/png' || file[0].type == 'image/jpg') {
      if (event.target.files[0].size / 1024 / 1024 > 10) {
        this.toastrService.error('The file is too large. Allowed maximum size is 10 MB.');
        return;
      }
      this.uploadFileApi(event.target.files[0]).then((data) => {
        this.eventImage = data;
      }).catch((err) => {
        this.toastrService.error('Image upload faild');
      })
    }
    else {
      this.toastrService.error('Allow only .png, .jpeg, .jpg, .pdf, .ppt, .pptx, .docx, .xls, .xlsx, .doc this file');
      return;
    }
  }

  wordCounter(event) {
    if (event.keyCode != 32) {
      this.wordCount = event.target.value ? event.target.value.split(/\s+/) : 0;
      this.words = this.wordCount ? this.wordCount.length : 0;
    }

    if (this.words > 250) {
      this.showWordLimitError = true;
    } else {
      this.showWordLimitError = false;
    }
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



  uploadFileApi(file) {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      formData.append('files', file);
      this.http.post(environment.apiEndpointNew + 'public/uploadFile', formData)
        .subscribe((res: any) => {
          resolve(res.url);
        }, (err => {
          reject(err);
        }))
    })
  }

  removeEventImage() {
    this.eventImage = '';
  }

  openAddEvent(template: TemplateRef<any>, EventEditAction: boolean, event_id: any) {
    this.current_eveneStatus = '';
    this.event_operationStatus = 'Add';
    this.scheduleEventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      description: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      timezone: ['', Validators.required],
      event_status: ['', Validators.required],
      online_link: [''],
      avenue_address: [''],
      startDate: ['', Validators.required],
      startTime: ['09:00', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['10:00', Validators.required],
      eventFrequency: ['', Validators.required],
    });
    this.eventImage = '';
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    if (EventEditAction == true) {
      this.event_operationStatus = 'Edit';
      this.event_id = event_id;
      let obj = { event_id: event_id };
      this.EventEditAction = true;
      this.mentorDashboardService.getMentorHosteventWithid(obj).subscribe(
        (response) => {
          this.scheduleEventForm.patchValue({
            eventName: response?.data?.eventName,
            description: response?.data?.description,
            timezone: response?.data?.timezone,
            event_status: response?.data?.event_status,
            online_link: response?.data?.online_link,
            avenue_address: response?.data?.avenue_address,
            startDate: moment(response?.data?.startDate).format('YYYY-MM-DD'),
            startTime: response?.data?.startTime,
            endDate: moment(response?.data?.endDate).format('YYYY-MM-DD'),
            endTime: response?.data?.endTime,
            eventFrequency: response?.data?.eventFrequency,
          });
          if (response?.data?.event_status == 'online') { this.current_eveneStatus = response?.data?.event_status; }
          if (response?.data?.event_status == 'offline') { this.current_eveneStatus = response?.data?.event_status; }
          this.eventImage = response?.data?.logo;
        },
        (err) => {

        },
      );
    }else{
      this.scheduleEventForm.patchValue({
        online_link: 'https:/www.',
      });
    }
  }

  addScheduleEvent() {
    this.submittedEvent = true;
    let obj = this.scheduleEventForm.value;
    obj['user'] = this.userInfo?._id;
    obj['event_image'] = this.eventImage;

    const descriptionCount = this.wordCounts(this.scheduleEventForm.value.description, 250);

    if (this.scheduleEventForm.invalid || descriptionCount) {
      return;
    }

    if (this.EventEditAction == true) {
      obj['event_id'] = this.event_id;
      this.mentorDashboardService.updateHostEventData(obj).subscribe(
        (response) => {
          this.toastrService.success(response.message);
          this.scheduleEventForm.reset();
          this.submittedEvent = false;
          this.modalRef.hide();
          this.getHostevent();
        },
        (err) => {
          this.toastrService.error('Event not updated');
          this.submittedEvent = false;
          this.modalRef.hide();
        },
      );
    }
    else {
      this.mentorDashboardService.addNewHostEvent(obj).subscribe(
        (response) => {

          mixpanel.init('089a065ddf055461542dbc6154555107', { debug: true, ignore_dnt: true });
          mixpanel.track('Create Mentor Event', {
            "eventName": response.data.eventName,
            "Host Email": this.userInfo.email,
            "Host Name": this.userInfo.name,
            "timezone": response.data.timezone,
            "startDate": response.data.startDate,
            "startTime": response.data.startTime,
            "endDate": response.data.endDate,
            "endTime": response.data.endTime,
          });

          this.toastrService.success(response.message);
          this.scheduleEventForm.reset();
          this.submittedEvent = false;
          this.modalRef.hide();
          this.getHostevent();
        },
        (err) => {
          this.toastrService.error('Event not added');
          this.submittedEvent = false;
          this.modalRef.hide();
        },
      );
    }
  }

  deleteEvent() {
    let obj = { event_id: this.deleteEventId };
    this.mentorDashboardService.deleteMentorHosteventWithid(obj).subscribe(
      (response) => {
        this.getHostevent();
        this.modalRef.hide();
      });
  }

  getHostevent() {
    var getUserTimeZone = this.userTimezoneData?.profile.timezone;
    let obj = { user: this.userInfo?._id, filter_hostEvent: this.filter_hostEvent };
    this.mentorDashboardService.getMentorHostevent(obj).subscribe(
      (response) => {
        this.mentorHostevent = response.data;

        if (this.mentorHostevent.length == 0) {
          this.noEventData = true;
        } else {
          this.noEventData = false;
        }

        for (let f = 0; f < this.mentorHostevent.length; f++) {
          var cust_start = moment(this.mentorHostevent[f]?.startDate).format('YYYY-MM-DD');
          var set_startDate = cust_start + ' ' + this.mentorHostevent[f]?.startTime;
          if (this.filter_hostEvent == 'my_event') {
            this.mentorHostevent[f].startEvent = set_startDate;
          }
          else {
            if (getUserTimeZone != '' && getUserTimeZone != null) {
              var fetchNewdate = moment_timezone(set_startDate).tz(getUserTimeZone).format('MMMM D YYYY HH:mm');
              this.mentorHostevent[f].startEvent = fetchNewdate;
            }
            else {
              this.mentorHostevent[f].startEvent = set_startDate;
            }
          }
        }
      },
      (err) => {

      },
    );
  }

  openEventUserList(template: TemplateRef<any>, event_index: any) {
    this.EventUserList = this.mentorHostevent[event_index].userdata;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

}
