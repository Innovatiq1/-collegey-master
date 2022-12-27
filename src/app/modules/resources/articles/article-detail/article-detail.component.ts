import { Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Resource } from 'src/app/core/models/resources.model';
import { CommonService } from 'src/app/core/services/common.service';
import {Location} from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  articleDetails: Resource;
  articles: Resource[];
  similarArticles: Resource[];
  user: User;

  //newsletter
  form: FormGroup;
  submitted:boolean = false;

  modalRef: BsModalRef;

  AddReply:FormGroup;

  replyCommentId: any;
  submittedCommentReplay: boolean = false;

  // Blog Comment Form
  blogCommentForm:FormGroup
  submittedComment: boolean = false;
  Blogid:any;
  userid:any;
  blogCommentData:any;
  CommentReplyData:any;
  defaultCommentData:any[]=[];
  showAllCommentData: boolean = false;
  constructor(
    private resourcesService: ResourcesService,
    private activatedRoute: ActivatedRoute,
    public commonService: CommonService,
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private subscriptionService : SubscriptionService,
    private toastrService: ToastrService, 
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
  )
  { 
    const loggedInInfo = this.authService.getUserInfo();
    this.userid        = loggedInInfo?.user._id;
    this.blogCommentForm = this.fb.group({
      name: [loggedInInfo?.user.name, Validators.required],
      email: [loggedInInfo?.user.email, Validators.required],
      comments: ['', Validators.required],
    });

    this.AddReply = this.fb.group({
      replyText: ['',Validators.required],
    });
  }

  public hasErrorReplayComment = (controlName: string, errorName: string) => {
    return this.AddReply.controls[controlName].hasError(errorName);
  };

  public hasErrorEvent = (controlName: string, errorName: string) => {
    return this.blogCommentForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param =>{
        if(param.slug) {
          this._getArticleDetails(param.slug);
        }
    });
    this.createForm();
  }

  addReply(template: TemplateRef<any>, commentList) {
    this.replyCommentId = commentList._id;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true})
    );
  }


  getBlogsByTag(tag) {
    this.router.navigate(['/blog/tag/'+tag]);
  }

  _getArticleDetails(slug) {
    this.resourcesService.getArticleDetails(slug).subscribe(response => {
      this.articleDetails = response;
      this.Blogid = response._id;
      this._getArticles(slug);
      this.fetchBlogComment();
      // this.fetchCommentReply();
    });
  }

  _getArticles(slug) {
    this.resourcesService.getArticles().subscribe(response => {
      this.articles = response.data.docs;
      this.similarArticles = this.articles && this.articles.filter(article => article.slug !== slug);
    });
  }

  showAllComment()
  {
    this.showAllCommentData = true;
    this.cdr.detectChanges();
  }

  // fetchCommentReply()
  // {
  //   let obj = { blog_id: this.Blogid,showAllCommentData:this.showAllCommentData};
  //   this.resourcesService.getCommentReply(obj).subscribe(
  //     (response) => {
  //       // this.CommentReplyData = response.data?.blogComments;
  //       console.log("this.CommentReplyData ===>", response.data)
  //       // if (this.blogCommentData.length > 10) {
  //       //   for (let index = 0; index < 2; index++) {
  //       //     this.defaultCommentData.push(this.blogCommentData[index])
  //       //   }
  //       // }
  //     },
  //     (err) => {

  //     },
  //   );
  // }
  fetchBlogComment()
  {
    let obj = { blog_id: this.Blogid,showAllCommentData:this.showAllCommentData};
    this.resourcesService.getBlogComment(obj).subscribe(
      (response) => {
        this.blogCommentData = response.data?.blogComments;
        if (this.blogCommentData?.length <= 2) {
          this.showAllCommentData = true;
        }
      },
      (err) => {

      },
    );
  }

  onSubmitBlogComment()
  {
    this.submittedComment = true;
    let obj = this.blogCommentForm.value;
    obj['blog_id'] = this.Blogid;
    obj['user']    = this.userid;
    if (this.blogCommentForm.invalid) {
      return;
    }

    this.resourcesService.addBlogCommentData(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.blogCommentForm.reset();
        this.submittedComment = false;
        this.Blogid = this.Blogid;
        this.fetchBlogComment();
      },
      (err) => {
        this.toastrService.error('Comment not add');
        this.submittedComment = false;
      },
    );

  }

  onSubmitCommentReply() {
    this.submittedCommentReplay = true;
    let obj = this.AddReply.value;
    obj['blog_id'] = this.Blogid;
    obj['user']    = this.userid;
    obj['commentId']    = this.replyCommentId;
    if (this.AddReply.invalid) {
      return;
    }
    this.resourcesService.addCommentReplyData(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.Blogid = this.Blogid;
        this.fetchBlogComment();
        this.AddReply.reset();
        this.submittedCommentReplay = false;
        this.modalRef.hide();
      },
      (err) => {
        this.toastrService.error('Comment Reply not add');
        this.submittedCommentReplay = false;
      },
    );
  }

  onBackButtonClick() {
    this.location.back();
  }

  onNavigate(slug) {
    this.resourcesService.navigateToBlogDetail(slug);
  }


  isAuthenticated() {
    return this.authService.getToken();
  }

  createForm() {
    this.form = this.fb.group(
      {
        email: ["", [Validators.required, Validators.pattern(AppConstants.EMAIL_PATTERN)]],
      },
    );
  }

  get f(){return this.form.controls}

  markAllTouched() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
  }

  save() {
    this.submitted= true;
    if(this.form.valid){
      this.subscriptionService.newsLetter(this.form.value).subscribe((res)=>{
        if(res.status == "success"){
          this.toastrService.success(res.message);
          this.submitted= false;
          this.form.reset();
        }
      })
    } 
  }
}
