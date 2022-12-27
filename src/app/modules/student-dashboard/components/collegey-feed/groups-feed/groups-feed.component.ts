import { Component, Input, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { Dashboard } from 'src/app/core/models/student-dashboard.model';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CollegeyFeedService } from 'src/app/core/services/collegey-feed.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { StudentService } from 'src/app/core/services/student.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-groups-feed',
  templateUrl: './groups-feed.component.html',
  styleUrls: ['./groups-feed.component.css']
})
export class GroupsFeedComponent implements OnInit {
  @Input() selectedGroupValue: any;
  @Input() response: any;
  @Input() groupLoadMoreStatus: any;
  @Input() noFeedData: any;
  @Input() groupInfo: any;

  submitUpdateComment: boolean = false;

  modalRefCollegeFeed: any;
  userList: any;
  userInfo: User = new User();

  // Post Update
  postIsEdit: boolean = false;
  PostEditImage: any;
  postFeedId: any;

  commentForm: any;
  modalRefShareCollegeFeed: any;
  currentData: any;
  shareForm: FormGroup;
  userId: string;
  tab = 1;
  dashboard: Dashboard;

  //feed pagination
  feedSize: any = 5;
  allFeeds: any;
  feedPage: any = 1;
  skipFeed: any = 0;
  loadMoreStatus: boolean = true;
  allGroupFeeds: any[] = [];

  // noFeedData: boolean = false;
  deleteFeedId: any;

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

  // Post Submited
  postForm: FormGroup;
  submittedPost: boolean = false;
  hyperlinkArray: any = [];
  totalGroupItemsLength: any;
  showPaginationCondition: boolean = true;

  fetchcurrentImageheight: any;
  fetchcurrentImagewight: any;

  //show word limit
  wordCount: any;
  words: any;
  showWordLimitTitleError: Boolean = false;

  removeImageFile: boolean = false;
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private studentService: StudentService,
    public commonService: CommonService,
    private collegeyFeedService: CollegeyFeedService,
    private studentDashboardService: StudentDashboardService,
    private authService: AuthService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef,
    public modalRef: BsModalRef,
  ) {
    this.postForm = this.fb.group({
      postText: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      postData: [''],
      postImageUrl: [''],
    });
  }

  ngOnInit(): void {
    this.getDashboradDetails();
    this.getUserList();
    this.getUserInfo();
    this.chatsForm();
    //get comment edit form initialized
    this.commentEditFormInit();
  }

  commentEditFormInit() {
    this.editFeedCommentForm = this.fb.group({
      text: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    });
  }

  editComment(template: TemplateRef<any>, commentIndex, postIndex) {
    this.editFeedId = this.response[postIndex]?._id;
    this.editCommentIndex = commentIndex;

    this.modalRefEditComment = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    //this.modalRefEditComment.setClass('modal-width');
    this.editFeedCommentForm.patchValue({
      text: this.response[postIndex]?.comment[commentIndex]?.text
  })
  
}

editFeedCommentData(){
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
public hasErrorUpdateComment = (controlName: string, errorName: string) => {
  return this.editFeedCommentForm.controls[controlName].hasError(errorName);
};


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
  this.collegeyFeedService.deleteFeedPostComment(obj).subscribe((res)=> {
    this.modalFeedCommentDelete.hide();
    this.response = [];
    this.getFeedData();
    this.cdr.detectChanges();
  })
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

  public hasErrorEvent = (controlName: string, errorName: string) => {
    return this.postForm.controls[controlName].hasError(errorName);
  };


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

  // open feed modal
  openGroupFeedEdit(template: TemplateRef<any>, index) {
    this.showWordLimitTitleError = false;
    this.submittedPost = false;
    this.PostEditImage = null
    this.removeImageFile = false;
    this.postIsEdit = true;
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
    // console.log("updateDate=====", updateDate);

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

  //delete post

  deletePost() {

    let data = {
      feedId: this.deleteFeedId
    }
    this.collegeyFeedService.deleteFeedPost(data).subscribe((res) => {
      this.allGroupFeeds = [];
      this.getFeedData();
      this.modalRef.hide();
      this.cdr.detectChanges();
    })

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
    // this.commonService.getUserDetails().subscribe((resp) => {
    //   this.userId = resp._id;
    // });
  }
  //getUserListComments
  getUserList() {
    this.commonService.getUserListComments().subscribe((res: any) => {
      this.userList = res;
    });

  }
  // Get collegey FeedData
  getFeedData() {

    let obj = {
      docLimit: this.feedSize,
      feedPage: this.feedPage,
      skipFeed: this.skipFeed,
      groupId: this.selectedGroupValue
    }
    this.collegeyFeedService.getGroupFeedById(obj).subscribe((res) => {
      res.data.data.forEach(element => {
        element.likes.forEach(like => {
          if (like.user_id == this.userInfo._id) {
            element.lkedbyCurrentUser = true;
            element.likeId = like;
          }
        });
      });

      this.response = res.data.data;

      if (this.feedPage * this.feedSize > this.allGroupFeeds.length) {
        for (let i = 0; i < res.data.data.length; i++) {
          const singleFeed = res.data.data[i];
          this.allGroupFeeds.push(singleFeed)
        }
      }

      if (this.response.length == res.results || res.results == undefined) {
        this.groupLoadMoreStatus = false;
      } else {
        this.groupLoadMoreStatus = true;
      }

      if (this.response.length > 0) {
        this.noFeedData = false;
      } else {
        this.noFeedData = true;
      }

      for (let j = 0; j < this.allGroupFeeds.length; j++) {
        var postCreateAgo = this.allGroupFeeds[j].createdAt;
        this.allGroupFeeds[j].timeago = this.timeDifference(postCreateAgo);

        for (let k = 0; k < this.allGroupFeeds[j].comment?.length; k++) {
          var postCommentAgo = this.allGroupFeeds[j].comment[k].createdAt;
          this.allGroupFeeds[j].comment[k].timeagoComment = this.timeDifference(postCommentAgo);
        }
      }

    });
  }

  removeImage() {
    this.removeImageFile = true;
    this.postForm.get("postImageUrl").setValue(null)

  }

  loadMoreFeeds() {
    // this.feedPage++;
    this.feedSize += 5;
    this.getFeedData();
    this.cdr.detectChanges();
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
      if (this.fetchcurrentImagewight <= 520 && this.fetchcurrentImageheight <= 300) {

        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          const fd = new FormData();
          fd.append('files', file);
          fd.append('type', 'single');
          this.commonService.uploadImage(fd, ImageSource.COLLEGYFEED).subscribe((res) => {
            this.postForm.get('postImageUrl').setValue(res);
            this.PostEditImage = this.commonService.imagePathS3(res);
          });
        }

      }
      else {
        this.toaster.error('The maximum size for the 520 X 300');
        localStorage.removeItem('currentImageheight');
        localStorage.removeItem('currentImagewight');
        return;
      }
    }, 1000);

  }

  // open feed modal
  openCollegeFeedPostModal(template: TemplateRef<any>) {

    this.showWordLimitTitleError = false;
    this.submittedPost = false;
    this.postForm.reset();
    this.PostEditImage = null;
    this.postIsEdit = false;

    this.modalRefCollegeFeed = this.modalService.show(template);
    this.modalRefCollegeFeed.setClass('modal-width');
    this.postForm.patchValue({
      postData: 'https://www.',
    })

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
    const postTextlimit = this.wordCounts(this.postForm.value.postText, 200)
    if (this.postForm.invalid || postTextlimit) {
      return;
    }

    this.fetchandFindURLs(obj.postData);
    obj['user'] = this.userInfo._id;
    obj['group'] = this.selectedGroupValue;

    if (typeof this.hyperlinkArray != 'undefined' && this.hyperlinkArray.length > 0) {
      obj['post_url'] = this.hyperlinkArray[0];
    }

    if (!this.postIsEdit) {
      this.collegeyFeedService.addNewGroupFeedPost(obj).subscribe(
        (response) => {
          this.toaster.success(response.message);
          this.postForm.reset();
          this.submittedPost = false;
          this.modalRefCollegeFeed.hide();
          this.allGroupFeeds = [];
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
    } else {
      obj['feedid'] = this.postFeedId;
      if (obj['post_url']) {
        obj["postImageUrl"] = null;
      }
      this.collegeyFeedService.updateFeedPost(obj).subscribe(
        (response) => {
          this.toaster.success(response.message);
          this.postForm.reset();
          this.submittedPost = false;
          this.modalRefCollegeFeed.hide();

          this.allGroupFeeds = [];
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

  // Create Post
  postFeedData(data) {
    this.collegeyFeedService.postFeedData(data).subscribe((data) => {
      this.postForm.reset();
      this.modalRefCollegeFeed.hide();
      this.getFeedData();
    });
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
        this.allGroupFeeds = [];
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
      this.allGroupFeeds = [];
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
      this.allGroupFeeds = [];
      this.getFeedData();
    });
  }
  // share model
  openShareModel(template: TemplateRef<any>, feed) {
    this.currentData = feed;
    this.modalRefShareCollegeFeed = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
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
      this.shareForm.reset();
      this.currentData = undefined;
      this.modalRefShareCollegeFeed.hide();
      this.getFeedData();
    });
  }
  // join the public group
  joinGroup(id) {
    const data = { user: this.userInfo._id }
    this.collegeyFeedService.addMembersInGroup(id, data)
      .subscribe((res) => {
        this.commentForm.reset();
        this.getEachGroup(id);
      });
  }
  //each group
  getEachGroup(id) {
    this.collegeyFeedService.getEachGroup(id).subscribe((data) => {
      this.groupInfo = data;
      this.groupInfo.userList.forEach(element => {
        if (element.user._id == this.userInfo._id) {
          this.groupInfo.userExist = true;
        }
        // console.log(this.userInfo)
        if (element.user._id == this.userInfo._id && element.userType == 'admin' && this.groupInfo.groupType == 'private') {
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
  //request to join
  requestJoinGroup(id) {
    const data = { _id: this.userInfo._id }
    this.collegeyFeedService.requestToJoin(id, data)
      .subscribe((res) => {
        this.commentForm.reset();
        this.getEachGroup(id);
      });
  }
  requestAccepted(id, groupId) {
    const data = { _id: id }
    this.collegeyFeedService.acceptRequest(groupId, data).subscribe((res) => {
      this.getEachGroup(groupId);
    });
  }
  requestRejected(id, groupId) {
    const data = { _id: id }
    this.collegeyFeedService.rejectRequest(groupId, data).subscribe((res) => {
      this.getEachGroup(groupId);
    });
  }

  deleteConformationFeed(template: TemplateRef<any>, feedId: any) {
    this.deleteFeedId = feedId;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  // openMemberProfile(userId) {

  // }
}