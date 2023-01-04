import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  projectId:any;
  paymentAmount:any;
  userid: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentDashboardService: StudentDashboardService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private authService: AuthService,
  )
  { 
    /* this.route.queryParams.subscribe(params => {
      this.projectId = params.project;
      this.paymentAmount = params.price;
    }); */

    this.projectId = this.activatedRoute.snapshot.paramMap.get('projectId');
    
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user._id;
  }

  ngOnInit(): void {
    if(this.projectId)
    {
      this.updateProjectPayment();    
    }
  }
  
  updateProjectPayment()
  {
    let obj = {project_id:this.projectId};
    this.projectService.updateProjectPaymentStatus(obj).subscribe(
        (response) => {
          if(response.data != null)
          {
            this.UserProjectSuccess(response.data);
          }
        },
        (err) => { 
          this.toastrService.error('Update faild');
        },
    );
  }

  UserProjectSuccess(data:any)
  {
    let obj = {project_id:data.id,user_id:this.userid,paymentType:'paid'};
          this.projectService.UserProjectSuccess(obj).subscribe(
            (response) => {
              this.toastrService.success(response.message);
              this.toastrService.info("Congratulations! 200 Reward Point.");
            },
            (err) => { 
              this.toastrService.error('Add project faild');
            },
    );
  }
  

  navigateProjectSection() {
    this.router.navigateByUrl('/student-dashboard/$/project');
  }
}
