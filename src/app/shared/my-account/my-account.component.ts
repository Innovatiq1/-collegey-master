import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';
import { ConfirmedValidator } from '../validators/confirmed.validator';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
})
export class MyAccountComponent implements OnInit {
  currentPage: number = 1;
  currentPagePayment: number = 1;
  openPasswordContainer: Boolean;
  openReviewListContainer: Boolean;
  paymentListContainer: Boolean = false;
  changePwd: FormGroup;
  userId: any;
  rewardsData: any;
  paymentHistoryData: any;
  submittedPassword: Boolean = false;
  totalGroupItems: any;
  totalPaymentHistoryData: any;
  pageSrNo: number = 0;
  pageSrNoPayment: number = 0;
  rewardView: any;
  currentLoginUser:any;
  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private studentService: StudentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService:AuthService
  ) {
    this.changePwd = this.fb.group(
      {
        oldPwd: ['', Validators.required],
        newPwd: ['', [Validators.required, Validators.minLength(8)]],
        confirmPwd: ['', Validators.required],
      },
      {
        validator: ConfirmedValidator('newPwd', 'confirmPwd'),
      }
    );

    if (this.router.getCurrentNavigation().extras.state) {
      this.rewardView = this.router.getCurrentNavigation().extras.state;
    }
  }

  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pageSrNo = startItem;
    this.rewardsData = this.totalGroupItems.data?.rewardsPointobjects.slice(
      startItem,
      endItem
    );
    // console.log(" questionsAndAnswer pageChanged : ",this.questionsAndAnswer);
  }
  pageChangedPayment(event: PageChangedEvent): void {
    this.currentPagePayment = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pageSrNoPayment = startItem;
    this.paymentHistoryData = this.totalPaymentHistoryData.data?.slice(
      startItem,
      endItem
    );
    // console.log(" questionsAndAnswer pageChanged : ",this.questionsAndAnswer);
  }
  openContainer(container) {
    if (container === 'ChangePassowrd') {
      this.openPasswordContainer = true;
      this.openReviewListContainer = false;
      this.paymentListContainer = false;
    } else if (container === 'paymentList') {
      this.openPasswordContainer = false;
      this.openReviewListContainer = false;
      this.paymentListContainer = true;
    } else {
      this.paymentListContainer = false;
      this.openPasswordContainer = false;
      this.openReviewListContainer = true;
    }
  }

  ngOnInit(): void {
    // this.commonService.getUserDetails().subscribe((resp) => {      
    //   this.userId = resp._id;
    //   this.getUserReward(resp._id);
    //   this.getPaymentHistory(resp._id);
    // });
    this.userDetail()
  }

  userDetail(){
    const loggedInInfo = this.authService.getUserInfo();
    var resp = loggedInInfo.user
      this.userId = resp._id;
      this.currentLoginUser = resp.type;
      this.getUserReward(resp._id);
      this.getPaymentHistory(resp._id);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.changePwd.controls[controlName].hasError(errorName);
  };

  getUserReward(userID) {
    let data = {
      user_id: userID,
    };
    this.studentService.getUserRewardPoints(data).subscribe((result) => {
      this.totalGroupItems = result;      
      this.rewardsData = this.totalGroupItems.data?.rewardsPointobjects.slice(
        0,
        10
      );
      if (this.rewardView) {
        this.paymentListContainer = false;
        this.openPasswordContainer = false;
        this.openReviewListContainer = true;
      }
    });

  }
  getPaymentHistory(userID) {
    let data = {
      user_id: userID,
    };
    this.studentService.getPaymentHistory(data).subscribe((result) => {
      this.totalPaymentHistoryData = result;
      this.paymentHistoryData = this.totalPaymentHistoryData.data?.slice(
        0,
        5
      );
      if (this.rewardView) {
        this.paymentListContainer = false;
        this.openPasswordContainer = false;
        this.openReviewListContainer = true;
      }
    });

  }

  onSubmitPsd() {
    this.submittedPassword = true;
    if (this.changePwd.invalid) {
      return;
    }
    let data = {
      id: this.userId,
      oldPassword: this.changePwd.value.oldPwd,
      newPassword: this.changePwd.value.newPwd,
    };
    this.studentService.changePassword(data).subscribe((result) => {
      this.toastrService.success('Password Changed Successfully');
      this.changePwd.reset();
      this.submittedPassword = false;
      this.router.navigateByUrl('student-dashboard');
    });
  }
}
