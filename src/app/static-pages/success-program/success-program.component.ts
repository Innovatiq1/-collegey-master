import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-success-program',
  templateUrl: './success-program.component.html',
  styleUrls: ['./success-program.component.css']
})
export class SuccessProgramComponent implements OnInit {
  projectId: any;
  paymentAmount: any;
  userid: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentDashboardService: StudentDashboardService,
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private authService: AuthService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.projectId = params.project;
      this.paymentAmount = params.cost;
    });
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user._id;
  }
  ngOnInit(): void {
    if (this.projectId) {
      this.updateProjectPayment();
      this.UserProjectSuccess();
    }
  }
  navigateProjectSection() {
    this.router.navigateByUrl('/student-dashboard/$');
  }

  updateProjectPayment() {
    let obj = { programId: this.projectId, userId: this.userid };
    this.projectService.updateProgramPaymentStatus(obj).subscribe(
      (response) => {
        if (response.data != null) {

        }
      },
      (err) => {
        this.toastrService.error('Update faild');
      },
    );
  }

  UserProjectSuccess() {
    let obj = { programId: this.projectId, user_id: this.userid, paymentType: 'paid', paymentAmount: this.paymentAmount };
    this.projectService.UserProgramSuccess(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
      },
      (err) => {
        this.toastrService.error('Add Program faild');
      },
    );
  }


}


