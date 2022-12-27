import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProjectService } from '../../../../core/services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { StudentService } from 'src/app/core/services/student.service';
import { User } from 'src/app/core/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { environment, timezone } from 'src/environments/environment';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as _ from 'lodash';
import { StudentsModule } from 'src/app/modules/students/students.module';
import { AnnouncementService } from 'src/app/core/services/announcement.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { AnnouncementService } from 'src/app/core/services/announcement.service';

// Load library for pdf
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';


@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {

  stateProject: any
  stateProject1: any
  programesData: any;
  chatpost: any;
  commentForm: any;
  removePostImageFile: Boolean = false;
  isReadMore = false;
  modalRef: BsModalRef;

  deleteFileId: any;
  deleteFileUser: any;
  deleteFileProject: any;
  imageSelect: boolean = false;
  submittedEvent: boolean = false;

  invitePeopleForm: FormGroup;
  submittedInvitePeople: boolean = false;

  submittedOutcome: boolean = false;

  isCharheStudent: number = -1;

  scheduleEventForm: FormGroup;
  addSchedule: boolean = true;
  allProgramEvent: any = [];
  updateData: any;
  timeZoneList: any;
  userListOptions = [];
  dropdownSettings: {};
  dropdownSetting: {};
  EventUserList: any = [];
  eventIndex: any;
  selectedTimeZone: any;
  eventStartDate: any;




  ProgramId: any
  userid: any;
  allchatdetail: any = [];
  projectfile: any = [];
  ///allfile: any = [];
  //announcements
  announcementsArray: any;
  announcementLink: any;
  safeHTML: SafeHtml;
  announcementWithURL: any[] = [];
  allfile: any = [];

  linkArray: any[] = [];
  Chatmsg_danger: boolean = false;

  postForm: FormGroup;
  Postmsg_danger: boolean = false;
  submittedPost: boolean = false;
  allProgramPost: any = [];
  allProjectPost: any = [];
  hyperlinkArray: any = [];
  userList: User[] = [];
  postFeedId: any;
  postIndex: any;

  deletePostId: any;
  postEdit: Boolean = false;
  postIsEdit: Boolean = false;

  PostEditImage: any;


  projectFilterData: any = {
    country: "",
    projectTag: [],
    IndustryOption: "",
    projectTypeArray: "",
  };
  //delete Event
  event_action: any;
  post_index: any;
  event_index: any;
  project: any;
  user: any;
  // Genrate Pdf 
  dafaultGenratepdf: boolean = false;
  pdfData: any = [];

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private authService: AuthService,
    public commonService: CommonService,
    private studentService: StudentService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private announcementService: AnnouncementService,
    private mentorDashboardService: MentorDashboardService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.timeZoneList = timezone;
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user._id;

    if (this.router.getCurrentNavigation().extras.state) {
      this.stateProject = this.router.getCurrentNavigation().extras.state;
    }
    this.postForm = this.fb.group({
      // postText: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      postText: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      post_comment: [''],
      postImageUrl: [''],
    });
    this.invitePeopleForm = this.fb.group({
      requestedForName: ['', Validators.required],
      useremailid: ['', Validators.required],
    });
    this.scheduleEventForm = this.fb.group({
      eventName: ['', Validators.required],
      timezone: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['00:00', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['00:00', Validators.required],
      event_schedule: ['', Validators.required],
      add_guest: ['', Validators.required],
    });
    var myDateSet = new Date();
    var newDateSet = this.datePipe.transform(myDateSet, 'yyyy-MM-dd');



    this.eventStartDate = newDateSet;

  }



  ngOnInit(): void {
    this.stateProject1 = this.stateProject?.projectId;
    this.ProgramId = this.stateProject?.projectId;
    this.getAnnouncement();
    this.getProgramesData();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      limitSelection: 4,
      noDataAvailablePlaceholderText: 'No project members found'
    };
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      limitSelection: 2,
    };
    this.projectService.program_detail(this.stateProject?.projectId).subscribe((res: any) => {
      //this.ProgramId=progrmId.Programs
      this.stateProject1 = res.programDetails

      this.allProgramPost = res.programDetails.programPost
      this.allProgramEvent = res.programDetails.programEvent;

      this.userList = res.programDetails.programMembers;

      this.userList.map(userlist => {
        this.userListOptions.push({ item_id: userlist._id, item_text: userlist.name + " " + userlist.last_name })
      })
      //this.allchatdetail = res.programDetails.programChat;
      this.projectfile = res.programDetails.programFiles;
      // //this.allProjectPost = res.data.projectDetails.projectDetail.projectPost;

      this.allProgramEvent = res.programDetails.programEvent;
      // for (let j = 0; j < this.allProgramPost.length; j++) {
      //   var postCreateAgo = this.allProgramPost[j].createdAt;
      //   this.allProjectPost[j].timeago = this.timeDifference(postCreateAgo);

      //   for (let k = 0; k < this.allProgramPost[j].comment?.length; k++) {
      //     var postCommentAgo = this.allProgramPost[j].comment[k].createdAt;
      //     this.allProgramPost[j].comment[k].timeagoComment = this.timeDifference(postCommentAgo);
      //   }

      // }

      // for (let f = 0; f < this.allfile.length; f++) {
      //   var postFileTimeAgo = this.allfile[f].createdAt;
      //   this.allfile[f].timeago = this.timeDifference(postFileTimeAgo);
      // }

      this.programesListData();
      this.getallchats();
      this.chatsForm();
      this.getPosts();
      this.allfiles();

      ////this.getallchats();
      //this.chatsForm();
      //this.getPosts();
      //this.allfiles();


    });




  }
  getPosts() {

    this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {

      this.allProgramPost = res.programDetails?.programPost;
      console
      this.allProgramEvent = res.programDetails?.programEvent;

      this.userList = res.programDetails?.programMembers;

      this.userList.map(userlist => {
        this.userListOptions.push({ item_id: userlist._id, item_text: userlist.name + " " + userlist.last_name })
      })



    })

  }
  openInvitePeople(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true })
    );
  }


  removePostImage() {
    this.removePostImageFile = true;
    this.postForm.get("postImageUrl").setValue(null)
    this.PostEditImage = null
  }
  programesListData() {
    this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {

      this.allProgramPost = res.programDetails
        .programPost;
      this.allProgramEvent = res.programDetails.programEvent;

      this.userList = res.programDetails.programMembers;

      this.userList.map(userlist => {
        this.userListOptions.push({ item_id: userlist._id, item_text: userlist.name + " " + userlist.last_name })
      })



    })


  }
  programdescp(progrmId, index) {

    this.userListOptions = [];
    this.PostEditImage = '';
    this.postForm.reset();
    this.projectService.program_detail(progrmId._id).subscribe((res: any) => {
      this.ProgramId = progrmId._id
      this.stateProject1 = res.programDetails

      this.allProgramPost = res.programDetails?.programPost
      this.allProgramEvent = res.programDetails?.programEvent;

      this.userList = res.programDetails?.programMembers;

      this.userList.map(userlist => {
        this.userListOptions.push({ item_id: userlist._id, item_text: userlist.name + " " + userlist.last_name })
      })
      //this.allchatdetail = res.programDetails.programChat;
      this.projectfile = res.programDetails?.programFiles;
      // //this.allProjectPost = res.data.projectDetails.projectDetail.projectPost;

      this.allProgramEvent = res.programDetails?.programEvent;
      // for (let j = 0; j < this.allProgramPost.length; j++) {
      //   var postCreateAgo = this.allProgramPost[j].createdAt;
      //   this.allProjectPost[j].timeago = this.timeDifference(postCreateAgo);

      //   for (let k = 0; k < this.allProgramPost[j].comment?.length; k++) {
      //     var postCommentAgo = this.allProgramPost[j].comment[k].createdAt;
      //     this.allProgramPost[j].comment[k].timeagoComment = this.timeDifference(postCommentAgo);
      //   }

      // }

      // for (let f = 0; f < this.allfile.length; f++) {
      //   var postFileTimeAgo = this.allfile[f].createdAt;
      //   this.allfile[f].timeago = this.timeDifference(postFileTimeAgo);
      // }



      this.getallchats();
      this.chatsForm();
      this.getPosts();
      this.allfiles();


    });









  }


  getProgramesData() {

    let obj = { user_id: this.userid };
    this.projectService.pogramesList(obj).subscribe((response: any) => {

      this.programesData = response.program;

      this.cdr.detectChanges();
    });

  }
  addingGuest(userslist) {
    // console.log("Selected userslist",userslist,this.scheduleEventForm);
  }

  editProjectPost(feedData: any, index) {
    this.PostEditImage = null
    this.removePostImageFile = false;
    this.imageSelect = false;
    this.postForm.reset();
    this.postIsEdit = true;
    const updateDate = this.allProgramPost[index];
    this.postFeedId = updateDate?._id;
    this.postIndex = index;

    if (updateDate?.posturl) {
      this.PostEditImage = updateDate?.postImageUrl;
    }
    else {
      this.PostEditImage = updateDate?.postImageUrl;
    }

    this.postForm.patchValue({
      postText: updateDate?.postText,
      post_comment: updateDate?.postData,
    });

    if (updateDate?.posturl == '' && updateDate?.postType == 'image' && updateDate?.postImageUrl != '') {
      this.postForm.patchValue({
        postText: updateDate?.postText,
        post_comment: updateDate?.postData,
        postImageUrl: updateDate?.postImageUrl,
      });
    }
    else {
      this.postForm.patchValue({
        postText: updateDate?.postText,
        post_comment: updateDate?.postData,
      });
    }
    if (updateDate?.posturl != '' && updateDate?.postType == 'image') {
      this.postForm.patchValue({
        postText: updateDate?.postText,
        post_comment: updateDate?.posturl,
        postImageUrl: updateDate?.postImageUrl,
      });
    }
  }

  chatsForm() {
    this.commentForm = this.fb.group({
      text: ['', Validators.required],
      user: [this.userid],
      program: [this.ProgramId],
    });
  }
  CheckPostlike(postlikearray: any) {
    return postlikearray?.includes(this.userid);
  }


  getallchats() {
    this.projectService.allchatProgram(this.ProgramId).subscribe((res: any) => {
      this.allchatdetail = res.data.projectChats;
      //this.allfiles();
    });
  }
  // public hasError = (controlName: string, errorName: string) => {
  //   return this.addProjectForm.controls[controlName].hasError(errorName);
  // };

  public hasErrorPost = (controlName: string, errorName: string) => {
    return this.postForm.controls[controlName].hasError(errorName);
  };


  postchats() {
    let datas = this.commentForm.value;
    if (datas.text == '') {
      this.Chatmsg_danger = true;
      return;
    }
    this.Chatmsg_danger = false;
    let data = {
      text: datas.text,
      user: this.userid,
      program: this.ProgramId,
    };
    this.projectService.postprogramchat(this.ProgramId, data).subscribe((res) => {
      this.chatpost = res;
      this.getallchats();
    });
  }



  linkify(text, index) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    if ((new RegExp(urlRegex)).test(text)) {
      this.announcementWithURL.push(index);
    }

    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank" style="color: white; text-decoration: underline; font: normal normal 500 16px/22px Nunito;">' + url + '</a>';
    });
  }

  getAnnouncement() {
    let obj = {
      forWhom: 'Students',
      type: 'Project'
    }
    this.announcementService.getAnnouncements(obj).subscribe((res) => {
      this.announcementsArray = res;
      for (let index = 0; index < this.announcementsArray.data.length; index++) {
        this.linkArray.splice(index, 0, 'announcement');
        this.announcementLink = this.linkify(this.announcementsArray.data[index].details, index)
        this.safeHTML = this.sanitizer.bypassSecurityTrustHtml(this.announcementLink);
        if (this.announcementWithURL.indexOf(index) != -1) {
          this.linkArray.splice(index, 1, this.safeHTML);
        }
      }
    })
  }
  postProject() {
    this.submittedPost = true;
    this.hyperlinkArray = [];
    let obj = this.postForm.value;
    obj['user'] = this.userid;
    obj['program'] = this.ProgramId;
    if (this.postForm.invalid) {
      return;
    }

    //this.fetchandFindURLs(obj.postText); 
    this.fetchandFindURLs(obj.post_comment);

    if (typeof this.hyperlinkArray != 'undefined' && this.hyperlinkArray.length > 0) {
      obj['post_url'] = this.hyperlinkArray[0];
    }
    console.log("=====this.postIsEdit===", this.postIsEdit)

    if (!this.postIsEdit) {
      this.projectService.addNewProgramPost(obj).subscribe(
        (response) => {
          this.toastrService.success(response.message);
          this.postForm.reset();
          this.submittedPost = false;
          this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {

            this.allProgramPost = res.programDetails
              .programPost;

            for (let j = 0; j < this.allProgramPost.length; j++) {
              this.allProgramPost[j].timeago = 0;
              var postCreateAgo = this.allProgramPost[j].createdAt;
              this.allProgramPost[j].timeago = this.timeDifference(postCreateAgo);

              for (let k = 0; k < this.allProgramPost[j].comment?.length; k++) {
                this.allProgramPost[j].comment[k].timeagoComment = 0;
                var postCommentAgo = this.allProgramPost[j].comment[k].createdAt;
                this.allProgramPost[j].comment[k].timeagoComment = this.timeDifference(postCommentAgo);
              }
            }
          });
        },
        (err) => {
          this.toastrService.error('post not added');
          this.submittedPost = false;
        },
      );
    }
    else {
      obj['postid'] = this.postFeedId;
      obj['postindex'] = this.postIndex;
      if (obj['post_url']) {
        if (!this.imageSelect) {
          if (obj["postImageUrl"] != null) {
            if (obj["postImageUrl"].indexOf("https") == 0) {
              obj["postImageUrl"] = null;
            }
          } else {
            obj["postImageUrl"] = null;
          }

        }
      }
      this.projectService.updateProgramPost(obj).subscribe(
        (response) => {
          this.toastrService.success(response.message);
          this.postForm.reset();
          this.submittedPost = false;
          this.PostEditImage = '';
          this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {
            this.allProgramPost = [];
            this.allProgramPost = res.programDetails
              .programPost;;
            for (let j = 0; j < this.allProgramPost.length; j++) {
              this.allProgramPost[j].timeago = 0;
              var postCreateAgo = this.allProgramPost[j].createdAt;
              this.allProgramPost[j].timeago = this.timeDifference(postCreateAgo);

              for (let k = 0; k < this.allProgramPost[j].comment?.length; k++) {
                this.allProgramPost[j].comment[k].timeagoComment = 0;
                var postCommentAgo = this.allProgramPost[j].comment[k].createdAt;
                this.allProgramPost[j].comment[k].timeagoComment = this.timeDifference(postCommentAgo);
              }
            }
            this.postIsEdit = false;
          });
        },
        (err) => {
          this.toastrService.error('post not updated');
          this.submittedPost = false;
        },
      );
    }
  }
  addToPostLike(post_index: any, like_action: any) {
    let obj = {
      post_index: post_index,
      user: this.userid,
      project: this.ProgramId,
      like_action: like_action
    }
    this.projectService.addNewProjectPostLike(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {
          this.allProjectPost = res.data.projectDetails.projectDetail.projectPost;
        });
      },
      (err) => {
        this.toastrService.error('post not like');
      },
    );
  }
  onpostFileSelect(event) {
    var file = event.target.files;
    if (file[0].type == 'image/jpeg' || file[0].type == 'image/png' || file[0].type == 'image/jpg') {
      if (event.target.files[0].size / 1024 / 1024 > 10) {
        this.toastrService.error('The file is too large. Allowed maximum size is 10 MB.');
        return;
      }
      this.uploadFileApi(event.target.files[0]).then((data) => {
        this.removePostImageFile = false;
        this.postForm.get('postImageUrl').setValue(data);
        this.PostEditImage = data;
        event.target.value = null;
        this.imageSelect = true;
      }).catch((err) => {
        this.toastrService.error('Image upload faild');
        event.target.value = null;
      })
    }
    else {
      this.toastrService.error('Allow only .png, .jpeg, .jpg this file');
      return;
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
  deleteProgramPost(template: TemplateRef<any>, postId: any) {
    this.deletePostId = postId;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  deletePostById() {
    const obj = {
      postId: this.deletePostId,
      programId: this.ProgramId
    };
    this.projectService.deleteProgramPost(obj).subscribe(
      (response) => {
        this.modalRef.hide();
        // this.toastrService.success(response);
        this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {
          console.log("====", res)
          this.allProgramPost = res.programDetails.programPost;
          for (let j = 0; j < this.allProgramPost.length; j++) {
            this.allProgramPost[j].timeago = 0;
            var postCreateAgo = this.allProgramPost[j].createdAt;
            this.allProgramPost[j].timeago = this.timeDifference(postCreateAgo);

            for (let k = 0; k < this.allProgramPost[j].comment?.length; k++) {
              this.allProgramPost[j].comment[k].timeagoComment = 0;
              var postCommentAgo = this.allProgramPost[j].comment[k].createdAt;
              this.allProgramPost[j].comment[k].timeagoComment = this.timeDifference(postCommentAgo);
            }
          }
        });

      },
      (err) => {
        this.modalRef.hide();
        this.toastrService.error('Post not delete');
        // this.getGroupsData();
      },
    );
  }
  bannerUpload(event) {
    let file = event.target.files;
    let obj = {
      "program": this.ProgramId,
      "user_id": this.userid,
    };
    if (file[0].type == 'image/jpeg' || file[0].type == 'image/png' || file[0].type == 'image/jpg' || file[0].type == 'application/vnd.ms-excel' || file[0].type == 'application/pdf' || file[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file[0].type == 'application/vnd.ms-powerpoint' || file[0].type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || file[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      if (file[0].size / 1024 / 1024 > 2) {
        this.toastrService.error('The file is too large. Allowed maximum size is 2 MB.');
        return;
      }
      if (file && file.length > 0) {
        let file_type = file[0].name.split(".").pop();
        const fd = new FormData();
        fd.append('file', file[0]);
        fd.append('type', file_type);
        fd.append('file_name', file[0].name);
        fd.append('program', this.ProgramId);
        fd.append('user_id', this.userid);
        this.projectService.programPostfile(this.ProgramId, fd).subscribe((res) => {
          this.allfiles();
        });
        event.target.value = null;
      }
    }
    else {
      event.target.value = null;
      this.toastrService.error('Allow only .png, .jpeg, .jpg, .pdf, .ppt, .pptx, .docx, .xls, .xlsx, .doc this file');
      return;
    }

  }
  allfiles() {
    this.projectService.getAllProgramFiles(this.ProgramId).subscribe((res: any) => {
      this.allfile = res.data.programFiles;
      this.projectfile = this.allfile;
      this.allfile[0].timeago = 1 + ' seconds ago';
      for (let f = 0; f < this.allfile.length; f++) {
        var postFileTimeAgo = this.allfile[f].createdAt;
        if (f != 0) {
          this.allfile[f].timeago = this.timeDifference(postFileTimeAgo);
        }
      }
    });
  }
  deleteConformationFile(template: TemplateRef<any>, fileId: any, project: any, user: any) {
    this.deleteFileId = fileId;
    this.deleteFileProject = project;
    this.deleteFileUser = user;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  public hasErrorInvitePeople = (controlName: string, errorName: string) => {
    return this.invitePeopleForm.controls[controlName].hasError(errorName);
  };








  timeDifference(previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var preDate = new Date(previous);
    var curDate = new Date();
    var elapsed = curDate.valueOf() - preDate.valueOf();
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + 'm ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + 'h ago';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + 'd ago';
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + 'mth ago';
    } else {
      return Math.round(elapsed / msPerYear) + 'yrs ago';
    }
  }

  fetchandFindURLs(message) {
    if (!message) return;
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    let newhyperLink = [];
    message.replace(urlRegex, function (url) {
      var hyperlink = url;
      if (!hyperlink.match('^https?:\/\/')) {
        hyperlink = 'http://' + hyperlink;
      }
      newhyperLink.push(hyperlink);
    });

    for (let i = 0; i < newhyperLink?.length; i++) {
      this.hyperlinkArray.push(newhyperLink[i]);
    }
  }
  getFileName(url) {
    var fileName = url.split('/').pop();
    return fileName.split('-').pop()
  }

  deleteFile() {
    let id = this.deleteFileId;
    let program = this.deleteFileProject;
    let user = this.deleteFileUser;
    this.projectService.deleteProgramFile({ id, program, user }).subscribe((response: any) => {
      if (response.message) {
        this.toastrService.success(response.message);
        this.allfiles();
        this.modalRef.hide();
      }
    });
  }
  programStatusConformation(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  onChangeProjectStatus() {
    const obj = {
      status_value: 'completed',
      program_id: this.ProgramId,
      user_id: this.userid
    };
    this.projectService.updateMenprogramStatus(obj).subscribe(
      (response) => {
        this.genrateCertificateUserWise();
        if (response.message) {
          this.toastrService.success(response.message);
          this.modalRef.hide();

        }
      },
      (err) => {
        this.toastrService.error('project status not update');
        this.modalRef.hide();
      },
    );
  }
  genrateCertificateUserWise() {
    console.log("+=====this.stateProject1===", this.stateProject1)

    // Logic For Pdf Genrate
    let educationSchoolFormArray = [];
    this.pdfData = [];
    this.dafaultGenratepdf = true;
    if (this.stateProject1?.programMembers?.length > 0) {
      for (let i = 0; i < this.stateProject1?.programMembers?.length; i++) {


        let pdfObj = {
          student_name: this.stateProject1?.programMembers[i]?.name + ' ' + this.stateProject1?.programMembers[i]?.last_name,
          student_projectname: this.stateProject1?.title,
          //project_week: project_week,
          project_completed_date: new Date(),

        }
        this.pdfData.push(pdfObj);
      }

      for (let i = 0; i < this.stateProject1?.programMembers?.length; i++) {
        var convertIdDynamic = 'contentToConvert_' + i;
        this.genratePdf(convertIdDynamic, this.stateProject1?.programMembers[i]?._id, this.stateProject1?._id);
      }
    }
  }
  genratePdf(convertIdDynamic: any, memberId: any, memberProgrmId: any) {
    this.dafaultGenratepdf = true;
    setTimeout(() => {
      const dashboard = document.getElementById(convertIdDynamic);
      const dashboardHeight = dashboard.clientHeight;
      const dashboardWidth = dashboard.clientWidth;


      const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

      domtoimage.toPng(dashboard, options).then((imgData) => {
        const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        //doc.save('Dashboard for hyperpanels.pdf');

        const pdfData = new File([doc.output("blob")], "programCertificate.pdf", {
          type: "application/pdf",
        });

        this.uploadFileApi(pdfData).then((data) => {
          let objpdf = {
            pdfurl: data,
            programId: memberProgrmId,
            userId: memberId,
          };
          this.studentService.updatePdfProgramInUser(objpdf).subscribe(
            (response) => {

            },
            (err) => {

            },
          );
        }).catch((err) => {
          this.toastrService.error('Image upload faild');
        })

      });
      this.dafaultGenratepdf = false;
    }, 1000);
  }
  sendInvitePeopleLink() {
    this.submittedInvitePeople = true;
    let obj = this.invitePeopleForm.value;
    obj['user_id'] = this.userid;
    obj['programId'] = this.ProgramId;

    if (this.invitePeopleForm.invalid) {
      return;
    }
    // return false;
    this.projectService.inviteProgramLink(obj).subscribe(
      (response) => {
        if (response.status == 'success') {
          //this.toastrService.success(response.message);
          this.toastrService.success("Invite link sent successfully");
          this.invitePeopleForm.reset();
          this.submittedInvitePeople = false;
          this.modalRef.hide();
        } else {
          this.toastrService.error(response.message);
          this.submittedInvitePeople = false;
          this.modalRef.hide();
        }

      },
      (err) => {
        // this.toastrService.error(err);
        this.submittedInvitePeople = false;
        this.modalRef.hide();
      },
    );


  }
  openAddEvent(template: TemplateRef<any>) {
    this.scheduleEventForm.reset();
    this.addSchedule = true;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  public hasErrorEvent = (controlName: string, errorName: string) => {
    return this.scheduleEventForm.controls[controlName].hasError(errorName);
  };

  addScheduleEvent() {

    this.submittedEvent = true;
    const formData = this.scheduleEventForm.getRawValue();
    formData.add_guest = formData.add_guest.map(usersList => {
      return usersList.item_id
    })
    let obj = this.scheduleEventForm.value;

    obj['user'] = this.userid;
    obj['add_guest'] = formData.add_guest;
    obj['program'] = this.ProgramId;


    if (this.scheduleEventForm.invalid) {
      return;
    }
    if (this.addSchedule) {
      this.projectService.addNewProgramEvent(obj).subscribe(
        (response) => {
          this.toastrService.success(response.message);
          this.submittedEvent = false;
          this.modalRef.hide();
          this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {
            this.allProgramEvent = res.programDetails.programEvent;

          });
        },
        (err) => {
          this.toastrService.error('Event not added');
          this.submittedEvent = false;
          this.modalRef.hide();
        },
      );
    } else {

      let updateObj = this.scheduleEventForm.value;
      //updateObj['user'] = this.userid;
      //updateObj['add_guest'] = formData.add_guest;
      updateObj['project'] = this.ProgramId;
      updateObj['eventBy'] = this.userid;
      updateObj['_id'] = this.updateData._id;
      updateObj['eventGuest'] = []
      updateObj['eventGuest'] = formData.add_guest;

      if (this.scheduleEventForm.invalid) {
        return;
      }
      this.projectService.editNewProgramEvent(updateObj).subscribe(
        (response) => {
          this.toastrService.success(response.message);
          this.submittedEvent = false;
          this.modalRef.hide();
          this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {
            this.allProgramEvent = res.programDetails.programEvent;

          });
        },
        (err) => {
          this.toastrService.error('Event not updated');
          this.submittedEvent = false;
          this.modalRef.hide();
        },
      );
    }

  }
  openEditEvent(template: TemplateRef<any>, index) {
    this.addSchedule = false;
    const updateDate = this.allProgramEvent[index];
    this.updateData = this.allProgramEvent[index];
    this.scheduleEventForm.controls.eventName.patchValue(updateDate.eventName);
    this.scheduleEventForm.controls.timezone.patchValue(updateDate.timezone);
    this.scheduleEventForm.controls.startTime.patchValue(updateDate.startTime);
    this.scheduleEventForm.controls.endTime.patchValue(updateDate.endTime);
    this.scheduleEventForm.controls.event_schedule.patchValue(updateDate.event_schedule);
    if (updateDate.startTime != null) {
      this.scheduleEventForm.patchValue({
        startDate: moment(updateDate.startDate).format('YYYY-MM-DD')
      });
    }

    if (updateDate.endDate != null) {
      this.scheduleEventForm.patchValue({
        endDate: moment(updateDate.endDate).format('YYYY-MM-DD')
      });
    }
    let eventGuest = [];
    if (updateDate.eventGuest) {
      let eventUsers = updateDate.eventGuest;
      for (let i in eventUsers) {
        let eventUsersObj = _.find(this.userListOptions, { item_id: eventUsers[i]._id });
        if (eventUsersObj)
          eventGuest.push(eventUsersObj);
      }
    }

    this.scheduleEventForm.controls.add_guest.patchValue(eventGuest);

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  openRemoveEventScheduleDialog(template: TemplateRef<any>, event_action: any, post_index: any, event_index: any) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.event_action = event_action;
    this.post_index = post_index;
    this.event_index = event_index;
    this.project = this.ProgramId;
    this.user = this.userid;


  }
  removeEventSchedule() {
    let obj = {
      event_action: this.event_action,
      post_index: this.post_index,
      user_index: this.event_index,
      program: this.ProgramId,
      user: this.userid
    }

    this.projectService.RemoveProgramEvent(obj).subscribe(
      (response) => {
        this.modalRef.hide();
        this.toastrService.success(response.message);
        this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {
          this.allProgramEvent = res.programDetails.projectEvent;
        });
      },
      (err) => {
        this.modalRef.hide();
        this.toastrService.error('Event not deleted');
      },
    );


  }

  removeEventScheduleUser(event_action: any, post_index: any, event_index: any) {
    if (confirm("Are you sure to delete this user")) {
      let obj = {
        event_action: event_action,
        post_index: post_index,
        user_index: event_index,
        project: this.ProgramId,
        user: this.userid,
      }
      this.projectService.RemoveProjectEvent(obj).subscribe(
        (response) => {
          this.toastrService.success(response.message);
          this.projectService.program_detail(this.ProgramId).subscribe((res: any) => {
            this.allProgramEvent = res.data.projectDetails.projectDetail.projectEvent;
          });
        },
        (err) => {
          this.toastrService.error('Event not deleted');
        },
      );
    }
  }
  openEventUserList(template: TemplateRef<any>, event_index: any) {
    this.eventIndex = event_index;
    this.EventUserList = this.allProgramEvent[event_index].eventGuest;
    this.EventUserList.eventBy = this.allProgramEvent[event_index].eventBy;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }














}



