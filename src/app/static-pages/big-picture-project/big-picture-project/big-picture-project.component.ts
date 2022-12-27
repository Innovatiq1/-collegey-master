import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-big-picture-project',
  templateUrl: './big-picture-project.component.html',
  styleUrls: ['./big-picture-project.component.css']
})
export class BigPictureProjectComponent implements OnInit {

  program_id: any;
  userid: any;
  articleDetails: any;
  userRole:any;  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private projectService: ProjectService,
    private studentDashboardService: StudentDashboardService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: any,
  ) {
    const loggedInInfo = this.authService.getUserInfo();
    this.userRole = loggedInInfo?.user?.type;
    this.userid = loggedInInfo?.user._id;
  }

  ngOnInit(): void {
    this.program_id = this.route.snapshot.params.id;
    this.initializeFormData(this.program_id);
  }

  initializeFormData(id) {
    this.resourcesService.getProgramDetailsById(id).subscribe((data: any) => {
      this.articleDetails = data;
    }, error => {
      this.toastrService.error('Data not found');
    })
  }

  paymentForProject() {
    if(!this.userid)
    {
      this.toastrService.error("Please login first to join program");
      return; 
    }
    let data = {
      programId: this.program_id,
      userId: this.userid
    }
    this.studentDashboardService.programsPaymentDoneuser(data).subscribe((response: any) => {
      if (response.status == "success") {
        if (response.program.length > 0) {
          this.toastrService.success("This program already paid");
        }
        else {
          this.studentDashboardService.getProgramsPayment(this.program_id).subscribe((response: any) => {
            if (response.status == "success") {
              this.document.location.href = response.session.url;
            }
          })
        }
      }
    })
  }

  paymentForFree() {
    if(!this.userid)
    {
      this.toastrService.error("Please login first to join program");
      return; 
    }
    let data = {
      programId: this.program_id,
      userId: this.userid
    }
    this.studentDashboardService.programsPaymentDoneuser(data).subscribe((response: any) => {
      if (response.status == "success") {
        if (response.program.length > 0) {
          this.toastrService.success("This program already paid");
        }
        else {
          let obj = { programId: this.program_id, user_id: this.userid, paymentType: 'free', paymentAmount: 0 };
          this.projectService.UserProgramSuccess(obj).subscribe(
            (response) => {
              this.toastrService.success(response.message);
              this.router.navigate(['/success-program']);
            },
            (err) => {
              this.toastrService.error('Add Program faild');
            },
          );
        }
      }
    });

  }

}
