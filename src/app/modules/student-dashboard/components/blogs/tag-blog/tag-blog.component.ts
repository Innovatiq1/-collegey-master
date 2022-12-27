import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef  } from '@angular/core';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service'; 
import { ConfigService } from 'src/app/core/services/config.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Resource } from 'src/app/core/models/resources.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';


@Component({
  selector: 'app-tag-blog',
  templateUrl: './tag-blog.component.html',
  styleUrls: ['./tag-blog.component.css']
})
export class TagBlogComponent implements OnInit {
  show_loader: boolean = false;  
  tagarticles: any;
  dashboard:any;

@Input() showRecords: number

  constructor(
    private resourcesService: ResourcesService,
    public commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    private route: Router,
    private studentDashboardService:StudentDashboardService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { 
    
  }

  ngOnInit(): void {

    let obj = {
      blogTag: this.activatedRoute.snapshot.params.tag
    }
    this.resourcesService.getBlogTagList(obj).subscribe((data)=> {
      this.tagarticles = data.data;
      this.show_loader = false;       
    })
  }

  onNavigate(slug) {
    this.resourcesService.navigateToBlogDetail(slug);
  }
  
getDashboradDetails() {
  this.show_loader = true;
  this.studentDashboardService.getDashboardDetail().subscribe((res) => {
       this.dashboard = res;
       this.show_loader = false;
  })
}

}
