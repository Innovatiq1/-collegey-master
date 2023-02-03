import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { StudentService } from 'src/app/core/services/student.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CommonService } from 'src/app/core/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { reset } from 'mixpanel-browser';

import { InviteeServiceService } from 'src/app/core/services/invitee-service.service';
import { CollegeyFeedService } from 'src/app/core/services/collegey-feed.service';

@Component({
  selector: 'app-qaforms',
  templateUrl: './qaforms.component.html',
  styleUrls: ['./qaforms.component.css']
})
export class QaformsComponent implements OnInit {
  currentPage: number = 1;
  myCurrentPage: number = 1;
  inviteSubmitted: boolean = false;
  modalRef: BsModalRef;
  postQaForm: FormGroup;
  answersDiv: FormGroup;
  inviteFormGroup: FormGroup;
  userInfo: User = new User();
  questionId: any
  answerData: any;
  questionsAndAnswer: any;
  dashboard: any;
  show: boolean = false;
  buttonName: any = 'Show';
  totalGroupItems: any;
  pageSrNo: number = 0;
  selectedIndex: any;
  allquestions: boolean = true;
  questionSubmitted: boolean = false;
  answerSubmitted: boolean = false;
  questionError: any;
  myQuestionsAndAnswer: any;
  totalGroupItemsMy: any;
  userId: string;
  myQARes: any;
  deleteq: any;
  deletea: any;
  createQdata: any;
  createAdata: any;
  quesError: string;
  tagError: string;
  questionTagArray: any = [];

  questionEdit: boolean = false;


  emptyError: Boolean = false;

  answerId: any;
  deleteQuestionId: any;

  //dynamic lerning Box
  lernBoxCollection:any

  // Feeds Questions
  collegyFeedsQuestions:any;
  constructor(private modalService: BsModalService,
    private fb: FormBuilder, private studentService: StudentService,
    private authService: AuthService,
    private studentDashboardService: StudentDashboardService,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
    public commonService: CommonService,
    private inviteeService: InviteeServiceService,
    private collegeyFeedService: CollegeyFeedService,
  ) { }

  ngOnInit(): void {
    this.postQaForm = this.fb.group({
      ques: ['', [Validators.required, Validators.maxLength(300), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      link: [],
      questionTag: ['', Validators.required],
    })
    this.answersDiv = this.fb.group({
      answerData: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    })
    this.getUserInfo();
    this.getQuesAnsDataAll();
    this.inviteForm();
    this.dynamicLernBox();
    this.fetchSidebarQuetion();
  }

  inviteForm() {
    this.inviteFormGroup = this.fb.group({
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
      },
    );

  }
  public hasErrorInviteForm = (controlName: string, errorName: string) => {
    return this.inviteFormGroup.controls[controlName].hasError(errorName);
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

  opentravelModal(template: TemplateRef<any>) {
    this.questionEdit = false;
    this.postQaForm.reset();
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true }));
    this.modalRef.setClass("modal-width");
  }

  questionText(event) {
    if (event.keyCode != 32) {
      if (event.target.value == '') {
        this.emptyError = true;
        this.quesError = "Question is required";
      } else {
        this.emptyError = false;
        this.quesError = "";
      }
    }

  }

  public hasErrorEvent = (controlName: string, errorName: string) => {
    return this.postQaForm.controls[controlName].hasError(errorName);
  };
  public hasErrorAnswerEvent = (controlName: string, errorName: string) => {
    return this.answersDiv.controls[controlName].hasError(errorName);
  };

  closeQuestionPopup() {
    this.emptyError = false;
    this.questionSubmitted = false;
    this.modalRef.hide();
  }

  createQuestions() {
    this.questionSubmitted = true;
    let queschhar = this.postQaForm.value.ques;
    let tagchhar = this.postQaForm.value.questionTag;
    let queslengh = queschhar?.length;
    if (tagchhar?.length < 1) {
      this.tagError = "Tag is required";
      return false;
    }
    if (this.postQaForm.invalid) {
      return
    }
    this.quesError = "";
    this.tagError = "";
    this.questionTagArray = [];
    if (queschhar != '' && queslengh <= 300) {

      if (!this.questionEdit) {

        var data = {
          "question": this.postQaForm.value.ques,
          "link": this.postQaForm.value.link,
          "questionTag": this.postQaForm.value.questionTag,
          "createdAt": moment().format('YYYY-MM-DD HH:mm:ss'),
          "user": this.userInfo,
        }
        for (let i = 0; i < data.questionTag.length; i++) {
          this.questionTagArray.push(data.questionTag[i].value);
        }
        data['questionTag'] = this.questionTagArray;

        this.studentService.postAskAQues(data).subscribe(res => {
          if (res) {
            this.toastrService.success("Question posted successfully");
            this.createQdata = res;
            let resDetails = this.createQdata.data;
            let resData = resDetails.data;
            let createQId = resData._id;
            //console.log("resDetails : ", resDetails);
            //console.log("resData : ", resData);
            //console.log("questionData : ", createQId);
            if (createQId) {
              let creditRewardPoint = {
                "user_id": this.userInfo?._id,
                "rewardName": "Create Question",
                "rewardCreditPoint": "50",
                "uniqueId": createQId
              };
              //console.log("creditRewardPoint : ", creditRewardPoint);
              this.studentService.createCreditRewardPoint(creditRewardPoint).subscribe((result) => {
                // console.log("reward points credited : ",result);
                this.toastrService.info("Congratulations! 50 Reward Point.");
                this.postQaForm.reset();
                this.modalRef.hide();
                this.getQuesAnsDataAll();
                this.getQuesAnsData(this.userInfo._id);
                this.getQuesAnsDataAll();
                this.questionSubmitted = false;
                this.authService.setReward( this.userInfo?._id);
              });
            }
          }
        });
      } else {
        var updateData = {
          "question": this.postQaForm.value.ques,
          "link": this.postQaForm.value.link,
          "questionTag": this.postQaForm.value.questionTag,
          "createdAt": moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        for (let i = 0; i < updateData.questionTag.length; i++) {
          if (updateData.questionTag[i].value == undefined) {
            this.questionTagArray.push(updateData.questionTag[i]);
          } else {
            this.questionTagArray.push(updateData.questionTag[i].value);
          }
        }
        updateData['questionTag'] = this.questionTagArray;
        updateData['questionId'] = this.questionId;
        this.studentService.updateQuestions(updateData).subscribe(res => {
          if (res) {
            let updatedQdata = res;
            if (updatedQdata.data) {
              this.questionEdit = false;
              this.toastrService.success("Question Updated successfully");
              this.postQaForm.reset();
              this.modalRef.hide();
              this.getQuesAnsDataAll();
              this.getQuesAnsData(this.userInfo._id);
              this.getQuesAnsDataAll();
              this.questionSubmitted = false;
            }
          }
        });
      }
    } else {
      this.questionSubmitted = false;
      this.toastrService.error("Can't post the question without enter question");
      return false;
    }
  }

  getUserInfo() {
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
    this.userId = this.userInfo._id;
    //console.log(this.userId, "USER INFORMATION");


    this.getQuesAnsData(this.userInfo._id);

  }

  CheckAnswerlike(answerlikearray: any) {
    return answerlikearray?.includes(this.userId);
  }

  searchQuestion(event, questionFor) {
    let postdata;
    if (questionFor == 'all') {
      postdata = {
        questionTag: event.target.value,
        questionUserId: '',
      }

      if (postdata.questionTag != '') {
        this.studentService.getQuestionsByTagName(postdata).subscribe((data) => {
          this.totalGroupItems = data;
          this.questionsAndAnswer = this.totalGroupItems.slice(0, 5);
        })
      } else {
        this.getQuesAnsDataAll();
      }
    } else {
      postdata = {
        questionTag: event.target.value,
        questionUserId: this.userId
      }
      if (postdata.questionTag != '') {
        this.studentService.getQuestionsByTagName(postdata).subscribe((data) => {
          this.totalGroupItems = data;
          this.myQuestionsAndAnswer = this.totalGroupItems.slice(0, 5);
        })
      } else {
        this.getQuesAnsData(this.userId);
      }
    }

  }



  getQuesAnsData(id: string) {
    let postdata = {
      user_id: id,
    }
    // console.log("getQuesAnsData postdata : ",postdata);
    this.studentService.getAnswerQuesId(postdata).subscribe(data => {
      this.myQARes = data;
      if (this.myQARes.status) {
        this.totalGroupItemsMy = this.myQARes.data;
        this.myQuestionsAndAnswer = this.totalGroupItemsMy.slice(0, 5);
        this.cdr.detectChanges();
        //console.log("myQuestionsAndAnswer data res", this.myQuestionsAndAnswer);
      }
    })
  }
  getQuesAnsDataAll() {
    let obj = {
      user_id: this.userInfo._id
    }
    this.studentService.getQuesAnsDataAll(obj).subscribe(data => {
      this.questionsAndAnswer = data.data

      this.totalGroupItems = data.data;
      // console.log(" totalGroupItems : ",this.totalGroupItems);
      this.questionsAndAnswer = this.totalGroupItems.slice(0, 5);
      this.cdr.detectChanges();
    })
  }

  answerNow(el, index) {
    let messageId = el.getAttribute('data-question-id');
    this.questionId = messageId;
    this.selectedIndex = index;
    this.answerData = '';
  }

  postAnswerData() {
    this.answerSubmitted = true;

    if (this.answersDiv.invalid) {
      return;
    }
    this.answerData = this.answersDiv.value.answerData;
    if (this.questionId != undefined && this.questionId.length > 0) {
      let data = {
        answerData: this.answerData,
        questionId: this.questionId,
        type: 2,   //1: question and answers 2: side static questions 
        quesDesc: '',
        user: this.userInfo
      }


      this.studentService.postAnswers(data, this.questionId).subscribe(res => {
        // console.log("res postAnswers : ", res);
        this.createAdata = res;
        this.toastrService.success("Answer posted successfully");
        let resDetails = this.createAdata.data;
        let createAId = resDetails._id;
        // console.log("resDetails : ", resDetails);
        // console.log("AnswerData : ", createAId);
        if (createAId) {
          let creditRewardPoint = {
            "user_id": this.userInfo?._id,
            "rewardName": "Question Answer",
            "rewardCreditPoint": "50",
            "uniqueId": createAId
          };
          //console.log("creditRewardPoint : ", creditRewardPoint);
          this.studentService.createCreditRewardPoint(creditRewardPoint).subscribe((result) => {
            // console.log("reward points credited : ",result);
            this.toastrService.info("Congratulations! 50 Reward Point.");
            // window.location.reload();
            // this.getQuesAnsDataAll();
            this.getQuesAnsDataAll();
            this.getQuesAnsData(this.userInfo?._id);
            this.selectedIndex = "";
            this.authService.setReward( this.userInfo?._id);
          });
          this.answerSubmitted = false;
        }
      })
    } else {
      this.answerSubmitted = false;
      this.toastrService.error("Can't post the answer without selecting question");
    }
  }

  getDashboradDetails() {
    this.studentDashboardService.getDashboardDetail().subscribe((res) => {
      this.dashboard = res;
      //  console.log(res, "Dashboard Details");
    })
  }

  // like Dislike 
  likeDislike(ansId, type, quesId) {
    let data = {
      answer_id: ansId,
      value: type,
      user: this.userInfo
    }
    this.studentService.likeDislikeAns(data, quesId).subscribe((res) => {
      this.getQuesAnsData(this.userInfo._id);
      this.getQuesAnsDataAll();

    })
  }

  toggle() {

  }

  // pagination for groups
  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pageSrNo = startItem;
    this.questionsAndAnswer = this.totalGroupItems.slice(startItem, endItem);
    // console.log(" questionsAndAnswer pageChanged : ",this.questionsAndAnswer);
  }

  // pagination for groups
  pageChangedMy(event: PageChangedEvent): void {
    this.myCurrentPage = event.page
    const mystartItem = (event.page - 1) * event.itemsPerPage;
    const myendItem = event.page * event.itemsPerPage;
    this.pageSrNo = mystartItem;
    this.myQuestionsAndAnswer = this.totalGroupItemsMy.slice(mystartItem, myendItem);
    // console.log(" myQuestionsAndAnswer pageChangedMy : ",this.myQuestionsAndAnswer);
  }

  changeTab(evt) {
    if (evt == 'all') {

      this.allquestions = true;
    } else {

      this.allquestions = false;
    }
  }

  updateQuestion(template: TemplateRef<any>, index) {
    this.questionEdit = true;
    const updateDate = this.allquestions ? this.questionsAndAnswer[index] : this.myQuestionsAndAnswer[index];
    this.questionId = updateDate?._id;
    this.postQaForm.patchValue({
      ques: updateDate?.question,
      questionTag: updateDate?.questionTag,
    });
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg', ignoreBackdropClick: true }));
    this.modalRef.setClass("modal-width");
  }

  removeQuestion() {
    let id = this.deleteQuestionId;
    this.studentService.removeQuestion(id).subscribe((res) => {
      this.deleteq = res;
      if (this.deleteq) {
        let creditRewardPoint = {
          "user_id": this.userInfo?._id,
          "rewardName": "Create Question",
          "rewardCreditPoint": "50",
          "uniqueId": id
        };
        //console.log("creditRewardPoint : ", creditRewardPoint);
        this.studentService.removeCreditRewardPoint(creditRewardPoint).subscribe((result) => {
          // console.log("reward points credited : ",result); 
          this.toastrService.success("Question deleted successfully");
        });
        this.getQuesAnsDataAll();
        this.getQuesAnsData(this.userInfo?._id);
        this.modalRef.hide();
      }
    });


  }

  deleteConformationAnswer(template: TemplateRef<any>, answerId: any) {
    this.answerId = answerId;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  deleteConformationQuestion(template: TemplateRef<any>, questionId: any) {
    this.deleteQuestionId = questionId;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  removeAnswer() {
    this.modalRef.hide();

    let id = this.answerId;
    this.studentService.removeAnswer(id).subscribe((res) => {
      this.deletea = res;
      if (this.deletea) {
        let creditRewardPoint = {
          "user_id": this.userInfo?._id,
          "rewardName": "Question Answer",
          "rewardCreditPoint": "50",
          "uniqueId": id
        };
        //console.log("creditRewardPoint : ", creditRewardPoint);
        this.studentService.removeCreditRewardPoint(creditRewardPoint).subscribe((result) => {
          // console.log("reward points credited : ",result); 

          this.toastrService.success("Answer deleted successfully");

          this.getQuesAnsDataAll();
          this.getQuesAnsData(this.userInfo?._id);
          // window.location.reload();
        });
      }
    });
  }
  
  dynamicLernBox(){
    this.collegeyFeedService.getAcademicBoxData('').subscribe((res)=>{
      this.lernBoxCollection=res.data[0].collegeyAcademy[0]
    })
  }

}
