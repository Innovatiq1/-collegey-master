import { Component, OnInit } from '@angular/core';

// Load Services
import { CommonService } from 'src/app/core/services/common.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/models/user.model';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';

@Component({
  selector: 'app-agreement-terms-condition',
  templateUrl: './agreement-terms-condition.component.html',
  styleUrls: ['./agreement-terms-condition.component.css']
})
export class AgreementTermsConditionComponent implements OnInit {

  // Mentor Resources Tab
  agreegateData: any;
  
  constructor(
    private mentorDashboardService: MentorDashboardService,
    public commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
    public sanitizer:DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.getAgreegateData();
  }

  getAgreegateData()
  {
    let obj = {type_policy:'mentor'};
    this.mentorDashboardService.getAgreegateData(obj).subscribe(
      (response) => {
        this.agreegateData = response.data;
      },
      (err) => {
        
      },
    );
  }

}
