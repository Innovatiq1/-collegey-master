import { Component, OnInit, TemplateRef, ChangeDetectorRef, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';
import { StudentService } from 'src/app/core/services/student.service';
import { User } from 'src/app/core/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CollegeyFeedService } from 'src/app/core/services/collegey-feed.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown'; 
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AnnouncementService } from 'src/app/core/services/announcement.service';

// Load Services
import { InviteeServiceService } from 'src/app/core/services/invitee-service.service';

// Load Pagination
import { PaginationComponent } from '../../../../pagination/pagination.component';

@Component({
  selector: 'app-collegey-feed',
  templateUrl: './collegey-feed.component.html',
  styleUrls: ['./collegey-feed.component.css'],
})
export class CollegeyFeedComponent implements OnInit,OnDestroy {

  @ViewChild("pagination1") pagination1: PaginationComponent;

  submitUpdateComment: boolean = false;

  response: any[] = [];
  submitted = false;
  inviteFormGroup: FormGroup;

  // Edit Comment Form
  editFeedCommentForm: FormGroup;
  modalRefEditComment: BsModalRef;
  editFeedId: any;
  editCommentIndex: any;
  editCommentText: any;

  // Delete Feed Comment
  modalFeedCommentDelete: BsModalRef;
  deleteCommentFeedtId: any;
  deleteCommentFeedIndex: any;

  inviteSubmitted: boolean = false;

  form2: FormGroup;
  form1: FormGroup;
  groupResponse: any;
  isReadMore = false;
  isAlreadyFollow = false;
  userInfo: User = new User();
  dashboard: any;
  commentForm: any;
  userList: User[] = [];
  modalRefCollegeFeed: BsModalRef;
  collegeyFeedTemplate = true;
  groupFeedTemplate = false;
  descriptionFeed: any;
  modalRefShareCollegeFeed: BsModalRef;
  currentData: any;
  shareForm: FormGroup;
  userId: string;
  groupForm: FormGroup;
  selectedItems: { _id: number; name: string; }[];
  dropdownSettings: any;
  dropdownList;
  selectedItemsMap: number[];
  query;
  selectedGroup;
  groupFeed: boolean = false;
  responseGroup: any;
  noFeedData: Boolean = false;
  noFeedPostData: Boolean = false;
  size: any = 5;
  pageNo: any = 1;
  allGroupResponse: any;
  groupInfo: any;
  groupTemplate;
  returnedArray: any;
  totalGroupItems: any;
  groupImage: any;
  addEditGroupAction: boolean = true;
  editGroupId: any;
  editgroupImage: any;
  feedEdit: any;
  imageSelect: boolean = false;

  deleteFeedId: any;


  // Group Submit
  submittedGroup: boolean = false;

  //future seld  Submit
  submittedFutureSelf: boolean = false;

  //feed pagination
  feedSize: any = 5;
  allFeeds: any;
  feedPage: any = 1;
  skipFeed: any = 0;
  loadMoreStatus: boolean = false;
  groupLoadMoreStatus: boolean = true;

  // Post Submited
  postForm: FormGroup;
  submittedPost: boolean = false;

  hyperlinkArray: any = [];
  totalGroupItemsLength: any;
  showPaginationCondition: boolean = true;
  feedFormGroup: FormGroup;

  // Post Update
  postIsEdit: boolean = false;
  PostEditImage: any;
  postFeedId: any;

  //announcement
  announcementsArray: any;
  announcementLink: any;
  safeHTML: SafeHtml;
  announcementWithURL: any[] = [];
  linkArray: any[] = [];

  //show word limit
  wordCount: any;
  words: any;
  showWordLimitError: Boolean = false;
  showWordLimitRulesError: Boolean = false;
  showWordLimitTitleError: Boolean = false;

  fetchcurrentImageheight: any;
  fetchcurrentImagewight: any;
  removeImageFile: boolean = false;

  // Group pagination
  currentPage: number = 1;
  initialized: boolean = false;
  currentLimit: number = environment.page_limit;
  totalRecord: number = 0;

  //dynamic rightside
  lernBoxCollection:any
  meetBox = true;
  meetBoxCollectionQuestion:any=[];
  questionIndex=0;


  // Group Filter
  searchBygroupName: any = '';

  // Feeds Questions
  collegyFeedsQuestions:any;
  constructor(
    private modalService: BsModalService,
    private studentService: StudentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private studentDashboardService: StudentDashboardService,
    private collegeyFeedService: CollegeyFeedService,
    public commonService: CommonService,
    private toaster: ToastrService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public modalRef: BsModalRef,
    private announcementService: AnnouncementService,
    private inviteeService: InviteeServiceService,
    private sanitizer: DomSanitizer
  ) {
    this.postForm = this.fb.group({
      postText: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      postData: [''],
      postImageUrl: [''],
    });
    this.feedFormGroup = this.fb.group({
      postText: ['', Validators.required],
      postData: [''],
      postImageUrl: [''],
      id: [''],
    });
  }

  ngOnInit(): void {
    this.getDashboradDetails();
    this.getUserInfo();
    this.getFeedData();
    this.getUserList();
    // initialization of forms
    this.chatsForm();
    this.groupsInitForm();
    this.inviteForm();
    this.recommendForm();
    this.recommendForm1();
    this.shareInit();

    //get comment edit form initialized
    this.commentEditFormInit();

    //get Announcements
    this.getAnnouncement();
    this.dynamicLernBox();
    this.dynamicMeetbox();
    this.fetchSidebarQuetion();
  }

  public hasErrorEvent = (controlName: string, errorName: string) => {
    return this.postForm.controls[controlName].hasError(errorName);
  };

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

  chatsForm() {
    this.commentForm = this.fb.group({
      text: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      user: [this.userInfo._id],
      feedAssociated: [null],
    });
  }

  shareInit() {
    this.shareForm = this.fb.group({
      descriptionFeed: [null],
    });
  }

  commentEditFormInit() {
    this.editFeedCommentForm = this.fb.group({
      text: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    });
  }

  linkify(text, index) {
    var urlRegex = /(\b(https?|ftp|file|http):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    if ((new RegExp(urlRegex)).test(text)) {
      this.announcementWithURL.push(index);
    }

    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank" style="color: white; text-decoration: underline; font: normal normal 500 16px/22px Nunito;">' + url + '</a>';
    });
  }

  // postInitForm(){
  //   this.postForm = this.fb.group({
  //     postImageUrl: [''],
  //     postText:[''],
  //     postData:[''],
  //     post_url: [''],
  //     post_comment: [''], 
  //   });
  // }

  groupsInitForm() {
    this.groupForm = this.fb.group({
      groupName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      description: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      groupType: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      groupIcon: [],
      rules: ['']
      // userList:[]
    });
  }

  public hasErrorGroup = (controlName: string, errorName: string) => {
    return this.groupForm.controls[controlName].hasError(errorName);
  };

  editComment(template: TemplateRef<any>, commentIndex, postIndex) {
    this.editFeedId = this.response[postIndex]?._id;
    this.editCommentIndex = commentIndex;

    this.modalRefEditComment = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    //this.modalRefEditComment.setClass('modal-width');
    this.editFeedCommentForm.patchValue({
      text: this.response[postIndex]?.comment[commentIndex]?.text
    })

  }

  editFeedCommentData() {
    this.submitUpdateComment = true;
    if (this.editFeedCommentForm.invalid) {
      return;
    }
    let obj = {
      feed_id: this.editFeedId,
      cmtindex: this.editCommentIndex,
      cmtvalue: this.editFeedCommentForm.value.text
    }
    this.collegeyFeedService.editFeedPostComment(obj).subscribe((res) => {
      this.submitUpdateComment = false;
      this.modalRefEditComment.hide();
      this.response = [];
      this.getFeedData();
      this.cdr.detectChanges();
    })
  }

  deleteFeedComment(template: TemplateRef<any>, commentIndex, postId) {
    this.deleteCommentFeedIndex = commentIndex;
    this.deleteCommentFeedtId = postId;
    this.modalFeedCommentDelete = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    //this.modalFeedCommentDelete.setClass('modal-width');
  }

  deleteFeedCommentData() {
    let obj = {
      cmtindex: this.deleteCommentFeedIndex,
      feed_id: this.deleteCommentFeedtId
    }
    this.collegeyFeedService.deleteFeedPostComment(obj).subscribe((res) => {
      this.modalFeedCommentDelete.hide();
      this.response = [];
      this.getFeedData();
      this.cdr.detectChanges();
    })
  }

  getAnnouncement() {
    let obj = {
      forWhom: 'Students',
      type: 'Feed'
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

  // getFollowUserData(id: string) {
  //   if (this.isAlreadyFollow) {
  //     this.studentService.getUnFollowUser(id).subscribe(
  //       (data) => {
  //         this.isAlreadyFollow = false;
  //       },
  //       (err) => {
  //         this.isAlreadyFollow = true;
  //       }
  //     );
  //   } else {
  //     this.studentService.getFollowUser(id).subscribe(
  //       (data) => {
  //         this.isAlreadyFollow = true;
  //       },
  //       (err) => {
  //         this.isAlreadyFollow = true;
  //       }
  //     );
  //   }
  // }
  // getEmbedYoutubeUrl(url: string) {
  //   // let baseUrl = url.split("?")[0];
  //   // console.log(baseUrl,"BaseUrl");
  //   // let queryParameter = url.split("?")[1];
  //   // console.log(queryParameter,"kkkkkkkk")
  //   // let queryParametrValue = queryParameter!= undefined ? queryParameter.split("&")[0] : "";
  //   // let videoUrl = queryParametrValue != undefined ? queryParametrValue.split("=")[1] : "";
  //   // let ipAddress = baseUrl.split("/")[2] ;
  //   // let https = baseUrl.split("/")[0] + "//";
  //   // console.log(ipAddress,"IPPPPP");
  //   // let urls = https + ipAddress + "/embed/" + videoUrl;
  //   // console.log(urls,"hshdghsgd");
  //   // return urls;
  //   if (url != undefined || url != '') {
  //     var regExp =
  //       /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  //     var match = url.match(regExp);
  //     if (match && match[2].length == 11) {
  //       // Do anything for being valid
  //       // if need to change the url to embed url then use below line
  //       let urls = 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0';
  //      //  console.log(urls, 'Urllllllllll');
  //       return urls;
  //     }
  //   }
  // }


  // getGroupsData() {
  //   // this.studentService.getGroups().subscribe((data) => {
  //   //   this.groupResponse = data.data;
  //   //   console.log(this.groupResponse, 'GROUP DATA');
  //   // });
  //   this.commonService.getGroupListBasedonUserId().subscribe((data:any)=>{
  //     this.groupResponse = data;

  //     for (let j = 0; j < this.groupResponse.length; j++) {
  //       var postCreateAgo = this.groupResponse[j].createdAt;
  //       this.groupResponse[j].timeago = this.timeDifference(postCreateAgo);
  //     }

  //   })
  //   // this.studentService.getGroupsByPagination(this.pageNo, this.size).subscribe((data) => {
  //   //   this.groupResponse = data.data;
  //   //  //  console.log(this.groupResponse, 'GROUP DATA');
  //   // });
  // }



  //    if (url != undefined || url != '') {
  //        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  //        var match = url.match(regExp);
  //        if (match && match[2].length == 11) {
  //            // Do anything for being valid
  //            // if need to change the url to embed url then use below line
  //            let urls = "https://www.youtube.com/embed/" + match[2] + "?autoplay=0";
  //            console.log(urls,"Urllllllllll");
  //            return urls;
  //        }

  //    }

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

  wordCounterRules(event) {
    if (event.keyCode != 32) {
      this.wordCount = event.target.value ? event.target.value.split(/\s+/) : 0;
      this.words = this.wordCount ? this.wordCount.length : 0;
    }

    if (this.words > 250) {
      this.showWordLimitRulesError = true;
    } else {
      this.showWordLimitRulesError = false;
    }
  }

  wordCounterPostTitle(event) {
    if (event.keyCode != 32) {
      this.wordCount = event.target.value ? event.target.value.split(/\s+/) : 0;
      this.words = this.wordCount ? this.wordCount.length : 0;
    }

    if (this.words > 250) {
      this.showWordLimitTitleError = true;
    } else {
      this.showWordLimitTitleError = false;
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

  inviteForm() {
    this.inviteFormGroup = this.fb.group({
      inviteName: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      email: ["", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      mobile_number: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
  }
  recommendForm() {
    this.form2 = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      email_id: ["", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }
  recommendForm1() {
    this.form1 = this.fb.group({
      answer: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      Question: [''],
    });
  }
  // dashboard data
  getDashboradDetails() {
    this.studentDashboardService.getDashboardDetail().subscribe((res) => {
      this.dashboard = res;
    });
  }
  // user info
  getUserInfo() {
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
    this.userId = loggedInInfo.user._id;
    // this.commonService.getUserDetails().subscribe((resp) => {
    //   this.userId = resp._id;      
    // });
  }
  //getUserListComments
  getUserList() {
    this.commonService.getCommentUsers().subscribe((res: any) => {
      this.userList = res;
    });

  }
  //Click collegey feed tab
  collegeyFeedTab() {
    this.collegeyFeedTemplate = true;
    this.groupFeedTemplate = !this.collegeyFeedTemplate;
    this.groupTemplate = !this.collegeyFeedTemplate;
    this.response = [];
    //feed pagination
    let obj = {
      docLimit: 5,
      feedPage: 1,
      skipFeed: 0
    }
    this.collegeyFeedService.getFeedById(obj).subscribe((response) => {
      response.data.data.forEach(element => {
        element.likes.forEach(like => {
          if (like.user_id == this.userInfo._id) {
            element.lkedbyCurrentUser = true;
            element.likeId = like;
          }
        });
      });

      if (this.feedPage * this.feedSize > this.response.length) {
        for (let i = 0; i < response.data.data.length; i++) {
          const singleFeed = response.data.data[i];
          this.response.push(singleFeed)
        }
      }

      if (this.response.length == response.results || response.results == undefined) {
        this.loadMoreStatus = false;
      } else {
        this.loadMoreStatus = true;
      }

      if (this.response.length > 0) {
        this.noFeedPostData = false;
      } else {
        this.noFeedPostData = true;
      }

      for (let j = 0; j < this.response.length; j++) {
        var postCreateAgo = this.response[j].createdAt;
        this.response[j].timeago = this.timeDifference(postCreateAgo);

        for (let k = 0; k < this.response[j].comment?.length; k++) {
          var postCommentAgo = this.response[j].comment[k].createdAt;
          this.response[j].comment[k].timeagoComment = this.timeDifference(postCommentAgo);
        }

      }

    });
    this.cdr.detectChanges();
    // window.location.reload();
  }

  // Get collegey FeedData
  getFeedData() {
    //feed pagination
    let obj = {
      docLimit: this.feedSize,
      feedPage: this.feedPage,
      skipFeed: this.skipFeed
    }

    this.collegeyFeedService.getFeedById(obj).subscribe((response) => {      
      response.data.data.forEach(element => {
        element.likes.forEach(like => {
          if (like.user_id == this.userInfo._id) {
            element.lkedbyCurrentUser = true;
            element.likeId = like;
          }
        });
      });

      if (this.feedPage * this.feedSize > this.response.length) {
        for (let i = 0; i < response.data.data.length; i++) {
          const singleFeed = response.data.data[i];
          this.response.push(singleFeed)
        }
      }

      if (this.response.length == response.results || response.results == undefined) {
        this.loadMoreStatus = false;
      } else {
        this.loadMoreStatus = true;
      }

      if (this.response.length > 0) {
        this.noFeedPostData = false;
      } else {
        this.noFeedPostData = true;
      }

      for (let j = 0; j < this.response.length; j++) {
        var postCreateAgo = this.response[j].createdAt;
        this.response[j].timeago = this.timeDifference(postCreateAgo);

        for (let k = 0; k < this.response[j].comment?.length; k++) {
          var postCommentAgo = this.response[j].comment[k].createdAt;
          this.response[j].comment[k].timeagoComment = this.timeDifference(postCommentAgo);
        }

      }

    });
  }

  // calculating time for post
  timeDifference(previous) {
    // console.log('test')
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

  //Click Groups  tab
  groupsTab() {
    this.groupFeedTemplate = true;
    this.collegeyFeedTemplate = !this.groupFeedTemplate;
    this.groupTemplate = this.groupFeedTemplate;
    this.getGroupsData(true);
  }

  loadMoreFeeds() {
    this.feedPage++;
    this.skipFeed += 5;
    this.getFeedData();
    this.cdr.detectChanges();
  }

  searchGroupName(event: any) {
    var filterName = event.currentTarget.value;
    this.searchBygroupName = filterName;
    if (event.currentTarget.value != '') {
      this.showPaginationCondition = false;
    }
    else {
      this.showPaginationCondition = true;
    }
    this.getGroupsData();
  }

  // get groups data
  getGroupsData(bool: boolean = false) {    
    const obj = {
      limit: this.currentLimit,
      page: bool ? 1 : this.currentPage,
      user_id: this.userInfo._id,
      searchByname: this.searchBygroupName,
    };
    this.currentPage = obj.page
    this.collegeyFeedService.getGroups(obj).subscribe(
      (response) => {
        if (response.data != null && response.data != '') {
          this.allGroupResponse = response.data;
          this.totalRecord = response?.totalrecord;
          if (bool) {
            if (this.pagination1) {
              this.pagination1.count = this.totalRecord;
              this.pagination1.setPage(1, true);
            }
          }
          for (let f = 0; f < this.allGroupResponse.length; f++) {
            var groupTimeAgo = this.allGroupResponse[f].createdAt;
            this.allGroupResponse[f].timeago = this.timeDifference(groupTimeAgo);
          }
        }
        else {
          this.pagination1.count = response?.totalrecord;
        }
      },
    );

    //get groups by userid
    this.collegeyFeedService.getGroupListBasedonUserId(this.searchBygroupName).subscribe((data: any) => {
      this.groupResponse = data;
    });
  }

  onListChangePage(event: any) {
    this.currentPage = event;
    this.getGroupsData();
  }

  removeImage() {
    this.removeImageFile = true;
    this.postForm.get("postImageUrl").setValue(null)
    this.PostEditImage = null

  }

  // pagination for groups
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.allGroupResponse = this.totalGroupItems.slice(startItem, endItem);
  }
  // open feed modal
  openCollegeFeedPostModal(template: TemplateRef<any>) {
    // console.log("openCollegeFeedPostModal");
    this.showWordLimitTitleError = false;
    this.submittedPost = false;
    this.postForm.reset();
    this.PostEditImage = null;
    this.postIsEdit = false;
    this.imageSelect = false;
    this.modalRefCollegeFeed = this.modalService.show(template);
    this.modalRefCollegeFeed.setClass('modal-width');
    this.postForm.patchValue({
      postData: '',
    })
  }
  openCollegeFeedPostModal1(template: TemplateRef<any>, feed) {
    this.feedEdit = feed;
    // console.log("openCollegeFeedPostModal", feed);
    this.modalRefCollegeFeed = this.modalService.show(template);
    this.modalRefCollegeFeed.setClass('modal-width');
    // console.log("feededit", this.feedEdit.postText)
    // console.log("feededitttt", this.feedEdit)
    this.feedFormGroup.patchValue({
      postText: this.feedEdit?.postText,
      postImageUrl: this.feedEdit?.postImageUrl,
      postData: this.feedEdit?.postData,
      id: this.feedEdit?._id
    });
  }

  // imageSelection in collegey feed

  onFileSelect(event) {

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

      if (this.fetchcurrentImagewight <= 2000 && this.fetchcurrentImageheight <= 2000) {
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          const fd = new FormData();
          fd.append('files', file);
          fd.append('type', 'single');
          this.commonService.uploadImage(fd, ImageSource.COLLEGYFEED).subscribe((res) => {
            this.removeImageFile = false;
            this.postForm.get('postImageUrl').setValue(res);
            this.PostEditImage = this.commonService.imagePathS3(res);
            this.imageSelect = true;
          });
        }
      }
      else {
        this.toaster.error('The maximum size for the 2000 X 2000');
        localStorage.removeItem('currentImageheight');
        localStorage.removeItem('currentImagewight');
        return;
      }
    }, 1000);

  }

  // Create Post

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

  createUserPostData() {
    this.submittedPost = true;
    this.hyperlinkArray = [];
    let obj = this.postForm.value;

    const postTextCount = this.wordCounts(this.postForm.value.postText, 250);

    if (this.postForm.invalid || postTextCount) {
      return;
    }

    //this.fetchandFindURLs(obj.postText); 
    this.fetchandFindURLs(obj.postData);
    obj['user'] = this.userInfo._id;   
    
    if (typeof this.hyperlinkArray != 'undefined' && this.hyperlinkArray.length > 0) {
      obj['post_url'] = this.hyperlinkArray[0];
    }

    if (!this.postIsEdit) {
      // console.log("obj==>", obj);
      this.collegeyFeedService.addNewFeedPost(obj).subscribe(
        (response) => {
          this.toaster.success(response.message);
          this.postForm.reset();
          this.submittedPost = false;
          this.modalRefCollegeFeed.hide();

          this.response = [];
          this.feedSize = 5;
          this.feedPage = 1;
          this.skipFeed = 0;
          this.getFeedData();
          this.cdr.detectChanges();
        },
        (err) => {
          this.toaster.error('post not added');
          this.submittedPost = false;
        },
      );
    }
    else {
      obj['feedid'] = this.postFeedId;
      // console.log("obj['post_url']", obj['post_url']);

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
      // console.log("obj===>", obj);

      this.collegeyFeedService.updateFeedPost(obj).subscribe(
        (response) => {
          this.toaster.success(response.message);
          this.postForm.reset();
          this.submittedPost = false;
          this.modalRefCollegeFeed.hide();

          this.response = [];
          this.feedSize = 5;
          this.feedPage = 1;
          this.skipFeed = 0;
          this.getFeedData();
          this.cdr.detectChanges();
        },
        (err) => {
          this.toaster.error('post not update');
          this.submittedPost = false;
        },
      );
    }
  }

  openCollegeFeedEdit(template: TemplateRef<any>, index) {
    this.showWordLimitTitleError = false;
    this.submittedPost = false;
    this.PostEditImage = null
    this.removeImageFile = false;
    this.postIsEdit = true;
    this.imageSelect = false;;
    const updateDate = this.response[index];
    this.postFeedId = updateDate?._id;


    if (updateDate?.postType == "image") {
      if (updateDate?.postImageUrl.includes('http')) {
        this.PostEditImage = updateDate?.postImageUrl;
      }
      else {
        this.PostEditImage = this.commonService.imagePathS3(updateDate?.postImageUrl);
      }
    }

    this.postForm.patchValue({
      postText: updateDate?.postText,
      postData: updateDate?.posturl,
      postImageUrl: updateDate?.postImageUrl,
    });

    this.modalRefCollegeFeed = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  // Create Post
  postFeedData(data) {
    this.collegeyFeedService.postFeedData(data).subscribe((data) => {
      this.postForm.reset();
      this.modalRefCollegeFeed.hide();
      this.submittedPost = false;
      this.getFeedData();
    });
  }

  //delete post

  deletePost() {

    let data = {
      feedId: this.deleteFeedId
    }
    this.collegeyFeedService.deleteFeedPost(data).subscribe((res) => {
      this.response = [];
      this.getFeedData();
      this.cdr.detectChanges();
      this.modalRef.hide();
    })

  }

  // post comment
  postComment(feedId) {
    if (this.commentForm.invalid) {
      return;
    }
    let datas = this.commentForm.value;
    let data = {
      text: datas.text,
      user: this.userInfo._id,
      feedAssociated: feedId,
    };
    // console.log(data, 'data');
    this.collegeyFeedService
      .createFeedComment(feedId, data)
      .subscribe((res) => {
        this.commentForm.reset();
        this.feedSize = this.feedSize * this.feedPage;
        this.feedPage = 1;
        this.skipFeed = 0;

        this.response = [];
        this.getFeedData();
      });
  }

  // readmore
  readMoreClass(feed) {
    feed.readLess = !feed.readLess;
  }
  // like feed
  likeClick(feed) {
    let data = {
      user_id: this.userInfo._id,
      collegyFeed_id: feed._id,
    };
    this.collegeyFeedService.LikeFeedData(feed._id, data).subscribe((data) => {


      this.feedSize = this.feedSize * this.feedPage;
      this.feedPage = 1;
      this.skipFeed = 0;

      this.response = [];

      this.getFeedData();
    });
  }
  //dislike feed
  dislikeClick(feed, likedata) {
    let data = {
      user_id: this.userInfo._id,
      collegyFeed_id: feed._id,
    };
    this.collegeyFeedService.DisLikeFeedData(likedata._id, data).subscribe((data) => {
      this.feedSize = this.feedSize * this.feedPage;
      this.feedPage = 1;
      this.skipFeed = 0;
      this.response = [];
      this.getFeedData();
    });
  }
  // share model
  openShareModel(template: TemplateRef<any>, feed) {
    this.currentData = feed;
    this.modalRefShareCollegeFeed = this.modalService.show(template);
    this.modalRefShareCollegeFeed.setClass('modal-width');
  }
  // share feed
  shareClick(feed) {
    let data = {
      user_id: this.userInfo._id,
      collegyFeed_id: feed._id,
      description: this.shareForm.value.descriptionFeed
    };
    this.collegeyFeedService.shareFeedData(feed._id, data).subscribe((data) => {
      //  console.log(data)
      this.shareForm.reset();
      this.currentData = undefined;
      this.modalRefShareCollegeFeed.hide();
      this.getFeedData();
    });
  }
  // open groups modal
  opentravelModal(template: TemplateRef<any>) {
    this.groupForm.reset();
    this.submittedGroup = false;
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-width');
    this.groupImage = '';
    this.addEditGroupAction = true;
  }

  openEditGroup(template: TemplateRef<any>, groupId: any) {
    this.addEditGroupAction = false;
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-width');
    this.editGroupId = groupId;
    this.collegeyFeedService.getEachGroup(groupId).subscribe((data) => {
      this.groupInfo = data;
      this.groupForm.patchValue({
        groupName: this.groupInfo?.groupName,
        description: this.groupInfo?.description,
        rules: this.groupInfo?.rules,
        groupType: this.groupInfo?.groupType,
      });
      this.groupImage = this.commonService.imagePathS3(this.groupInfo?.groupIcon);
      this.editgroupImage = this.groupInfo?.groupIcon;
    });

  }

  deleteConformationGroup(template: TemplateRef<any>, groupId: any) {
    this.editGroupId = groupId;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  deleteConformationFeed(template: TemplateRef<any>, feedId: any) {
    this.deleteFeedId = feedId;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  deleteFeedsGroup() {
    const obj = {
      group_id: this.editGroupId
    };
    this.commonService.deleteFeedsGroup(obj).subscribe(
      (response) => {
        this.modalRef.hide();
        this.toaster.success(response.message);
        this.getGroupsData();
      },
      (err) => {
        this.modalRef.hide();
        this.toaster.error('group not delete');
        this.getGroupsData();
      },
    );
  }

  // image selection for groups
  uploadFileApi(file) {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      formData.append('files', file);
      this.http.post(environment.apiEndpointNew + 'public/uploadFile', formData)
        .subscribe((res: any) => {
          this.editgroupImage = res.fileLocation;
          resolve(res.url);
        }, (err => {
          reject(err);
        }))
    })
  }


  onGroupImageSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.groupForm.get('groupIcon').setValue(file);
      this.uploadFileApi(event.target.files[0]).then((data) => {
        this.groupImage = data;
      }).catch((err) => {
        this.groupImage.error('Image upload failed');
      })
    }
  }

  // create group
  groupCreate() {

    this.submittedGroup = true;

    const descriptioncount = this.wordCounts(this.groupForm.value.description, 250)
    const rulescount = this.wordCounts(this.groupForm.value.rules, 250)

    if (this.groupForm.invalid || descriptioncount || rulescount) {
      return;
    }

    if (this.addEditGroupAction) {
      const user = { user: this.userInfo._id, userType: 'admin' }
      var data = {
        groupOwner: this.userInfo._id,
        description: this.groupForm.value.description,
        groupName: this.groupForm.value.groupName,
        groupType: this.groupForm.value.groupType,
        groupIcon: '',
        rules: this.groupForm.value.rules,
        userList: user
      };
      if (this.groupForm.value.groupIcon) {
        const fd = new FormData();
        fd.append('files', this.groupForm.value.groupIcon);
        fd.append('type', 'single');
        this.commonService
          .uploadImage(fd, ImageSource.GROUPICON)
          .subscribe((res) => {
            data['groupIcon'] = res;
            this.createGroupData(data)
          });
      }
      else {
        this.createGroupData(data)
      }
    }
    else {
      let updateObj = this.groupForm.value;
      updateObj['group_id'] = this.editGroupId;
      updateObj['groupIcon'] = this.editgroupImage;
      this.commonService.editGroupData(updateObj).subscribe(
        (response) => {
          this.modalRef.hide();
          this.getGroupsData();
        },
        (err) => {
          this.modalRef.hide();
          this.getGroupsData();
        },
      );
    }


  }
  // create group
  createGroupData(data) {
    this.commonService.onCreateGroup(data).subscribe(res => {
      let groupData = res.data.data;
      let createdGroupId = groupData._id;
      // console.log("groupData data : ", groupData);
      if (createdGroupId) {
        let creditRewardPoint = {
          "user_id": this.userInfo?._id,
          "rewardName": "Collegey Feed Group",
          "rewardCreditPoint": "50",
          "uniqueId": createdGroupId
        };
        //console.log("creditRewardPoint : ", creditRewardPoint);
        this.studentService.createCreditRewardPoint(creditRewardPoint).subscribe((result) => {
          this.toaster.info("Congratulations! 50 Reward Point.");
          // console.log("reward points credited : ",result);
          this.authService.setReward( this.userInfo?._id);
        });
      }
      this.modalRef.hide();
      this.submittedGroup = false;
      this.groupForm.reset();
      this.getGroupsData();
    })
  }
  // clicking on groups
  onClickGroup(_id, group) {
    this.selectedGroup = _id;
    this.groupFeed = true;
    this.getGroupFeedData()
    this.getEachGroup(this.selectedGroup)
    this.getFeedDataById()
  }
  // clicking on groups

  onClickGroup1(_id, group) {
    this.selectedGroup = _id;
    this.groupFeed = true;
    this.getGroupFeedData()
    this.getEachGroup(this.selectedGroup)
    this.getFeedDataById()
  }

  getGroupFeedData() {

    let obj = {
      docLimit: this.feedSize,
      feedPage: this.feedPage,
      skipFeed: this.skipFeed,
      groupId: this.selectedGroup
    }

    this.collegeyFeedService.getGroupFeedById(obj).subscribe((data) => {

      data.data.data.forEach(element => {
        element.likes.forEach(like => {
          if (like.user_id._id == this.userInfo._id) {
            element.lkedbyCurrentUser = true;
            element.likeId = like;
          }
        });
      });

      this.responseGroup = data.data.data;

      for (let j = 0; j < this.responseGroup.length; j++) {
        var postCreateAgo = this.responseGroup[j].createdAt;
        this.responseGroup[j].timeago = this.timeDifference(postCreateAgo);

        for (let k = 0; k < this.responseGroup[j].comment?.length; k++) {
          var postCommentAgo = this.responseGroup[j].comment[k].createdAt;
          this.responseGroup[j].comment[k].timeagoComment = this.timeDifference(postCommentAgo);
        }
      }

      if (this.responseGroup.length > 0) {
        this.noFeedData = false;
      } else {
        this.noFeedData = true;
      }

      if (this.responseGroup.length == data.results || data.results == undefined) {
        this.groupLoadMoreStatus = false;
      } else {
        this.groupLoadMoreStatus = true;
      }
    });
  }

  getEachGroup(id) {
    this.collegeyFeedService.getEachGroup(id).subscribe((data) => {
      this.groupInfo = data;
      this.groupInfo.userList.forEach(element => {
        if (element.user?._id == this.userInfo?._id) {
          this.groupInfo.userExist = true;
        }
        if (element.user?._id == this.userInfo._id && element.userType == 'admin' && this.groupInfo.groupType == 'private') {
          this.groupInfo.isAdmin = true;
        }

      });
      this.groupInfo.groupJoinRequest.forEach(element => {
        if (element._id == this.userInfo._id) {
          this.groupInfo.groupAlreadySent = true;
        }
      });
    });
  }
  //  
  getFeedDataById() {
    let obj = {
      docLimit: this.feedSize,
      feedPage: this.feedPage,
      skipFeed: this.skipFeed,
      groupId: this.selectedGroup
    }

    this.collegeyFeedService.getGroupFeedById(obj).subscribe((data) => {
      data.data.data.forEach(element => {
        element.likes.forEach(like => {
          if (like.user_id._id == this.userInfo._id) {
            element.lkedbyCurrentUser = true;
            element.likeId = like;
          }

        });
      });
      // console.log("data.data=======>", data.data);

      this.response = data.data;
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
        this.toaster.success('Invite Sent Successfully');
      },
      (err) => {
        this.toaster.error('Invite Sent Failed');
      },
    );

  }

  public hasErrorInviteForm = (controlName: string, errorName: string) => {
    return this.inviteFormGroup.controls[controlName].hasError(errorName);
  };
  public hasErrorFutureSelf = (controlName: string, errorName: string) => {
    return this.form1.controls[controlName].hasError(errorName);
  };
  public hasErrorUpdateComment = (controlName: string, errorName: string) => {
    return this.editFeedCommentForm.controls[controlName].hasError(errorName);
  };

  save2() {
    this.submitted = true;
    if (this.form2.invalid) {
      return;
    }

    let data = {
      name: this.form2.value.name,
      email_id: this.form2.value.email_id
    }
    this.collegeyFeedService.recommendSave(data).subscribe(
      (res: any) => {
        this.submitted = false;
        this.form2.reset();
        this.toaster.success('Recommendation Saved Successfully');
        let response = res.data.data;
      },
      (err: any) => {
        this.toaster.error('Recommendation Saved Failed');
        //console.log(err);
      }
    );
  }

  public hasErrorRecommendedForm = (controlName: string, errorName: string) => {
    return this.form2.controls[controlName].hasError(errorName);
  };
  answerArray:any=[];
  meetBox1:boolean =true;
  save1(id:any,Index:any) {
    let quetionAnsArray = [];
    
    this.submittedFutureSelf = true;
    if (this.form1.invalid) {
      return;
    }
    let data = {
      Answer: this.form1.value.answer,
      Question: this.meetBoxCollectionQuestion[this.questionIndex].question,
      responseLable:this.meetBoxCollectionQuestion[this.questionIndex]?.responseLable,
      questionId:id
    }   
    this.answerArray.push(data);
    this.form1.reset();
        this.submittedFutureSelf = false;
        this.toaster.success('Future Self Saved Successfully');
        // let response = res.data.data;
        //  console.log(response);
        // this.fetchSidebarQuetion();
        this.questionIndex=Index+1;
        this.cdr.detectChanges();
        if(this.questionIndex==this.meetBoxCollectionQuestion.length){
          var obj ={
            answerArray:this.answerArray
          }
          this.collegeyFeedService.futureSave(obj).subscribe((res: any) => {
            console.log(res);
            this.meetBox=true;
            this.meetBox1=false
            setTimeout(() => {
              this.toaster.success("You have given all Question's Answer");
            }, 1000);
            this.fetchSidebarQuetion();
          });   
        }
        else{
          this.meetBox=false;
          this.meetBox1=true;
        }

      
    // this.collegeyFeedService.futureSave(data).subscribe(
    //   (res: any) => {
    //     this.form1.reset();
    //     this.submittedFutureSelf = false;
    //     this.toaster.success('Future Self Saved Successfully');
    //     // let response = res.data.data;
    //     //  console.log(response);
    //     this.fetchSidebarQuetion();
    //     this.questionIndex=Index+1;
    //     this.cdr.detectChanges();
    //     if(this.questionIndex==this.meetBoxCollectionQuestion.length){
    //       this.meetBox=false
    //       setTimeout(() => {
    //         this.toaster.success("You have given all Question's Answer");
    //       }, 1000);
    //     }
    //     else if(this.meetBoxCollectionQuestion.length == 0){
    //       console.log(this.meetBoxCollectionQuestion.length);
    //     }
    //     else{
    //       this.meetBox=true;
    //     }
    //   },
    //   (err: any) => {
    //     //  console.log(err);
    //     this.submittedFutureSelf = false;
    //   }
    // );
   
  }
  onFileSelect1(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('files', file);
      fd.append('type', 'single');
      this.commonService.uploadImage(fd, ImageSource.COLLEGYFEED).subscribe((res) => {
        this.feedFormGroup.get('postImageUrl').setValue(res);
      });
    }
  }
  
  dynamicLernBox(){
    this.collegeyFeedService.getAcademicBoxData('').subscribe((res)=>{
      this.lernBoxCollection=res.data[0].collegeyAcademy[0]
    })
  } 
  
  dynamicMeetbox(){
    this.collegeyFeedService.getMasterQuestion('').subscribe((res)=>{
       for(let i = 0;i<=res.data.length;i++){
        if(res.data[i]?.status){
          this.meetBoxCollectionQuestion.push(res.data[i])
        }
       }
      //  if(this.meetBoxCollectionQuestion.length == 0){
      //   this.meetBox = false;
      //   this.meetBox1=false;
      // }

    if(this.collegyFeedsQuestions[0]?.answerArray?.length>0){
      this.meetBox1=false;
      this.meetBox=true;
    }
    else
    {
      this.meetBox = false;
    }
    })
  }

  reset(){
    this.questionIndex = 0;
    this.meetBox = false;
    this.meetBox1=true;
    this.answerArray=[];
    this.collegyFeedsQuestions=[];
  }

  ngOnDestroy(): void {
    this.answerArray=[];
  }
}
