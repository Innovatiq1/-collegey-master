import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Resource } from 'src/app/core/models/resources.model';
import { CommonService } from 'src/app/core/services/common.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-collagey',
  templateUrl: './collagey.component.html',
  styleUrls: ['./collagey.component.css'],
})
export class CollageyComponent implements OnInit {

  currentPage = 1;
  queryParams: { [key: string]: string | number };
  totalProgrammes: number;
  programmes: Resource[];
  searchParams:any;
  typeOfProgramTitle:any;
  homepageContent:any=[];

  // Add Program Data
  public programBelowData:any;

  constructor(
    public commonService: CommonService,
    private resourcesService: ResourcesService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private studentDashboardService: StudentDashboardService,
  ) { 
    this.queryParams = { ...AppConstants.DEFAULT_SEARCH_PARAMS };
  }

  ngOnInit(): void {
   /* this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.queryParams = { ...this.queryParams, ...params };
      this.currentPage = +params['page'];
      this.getProgrammes(this.queryParams);
    }); */
    this.activatedRoute.queryParams.subscribe((param) => {
      this.searchParams = param?.category;
    });
    if(this.searchParams == 'student')
    {
      this.typeOfProgramTitle = 'Students';
    }
    else if(this.searchParams == 'high-schools')
    {
      this.typeOfProgramTitle = 'High Schools';
    }
    else if(this.searchParams == 'higher-ed')
    {
      this.typeOfProgramTitle = 'Higher Education';
    }
    this.getProgrammes(this.queryParams);
    this.getHomepageContentData();
  } 

  getHomepageContentData()
  {
    let obj = {};
    this.studentDashboardService.getHomepageContentData(obj).subscribe(
      (response) => { 
        this.programBelowData = response?.data?.program_content_section[0];
        this.homepageContent=response?.data?.home_fifth_section[0];        
      }, 
      (err) => {
      
      },
    );   
  }

  getProgrammes(params?: {}) {
    params['category'] = this.searchParams;
    this.resourcesService.getPrograms(params).subscribe(programme => {
      this.programmes = programme.data.docs;
      this.totalProgrammes = programme.data.totalDocs;
    });
  }
 
  loadMore(event: any) {
    console.log(event);
    this.currentPage = event.page;
    this.queryParams = { ...this.queryParams, page: this.currentPage };
    this.route.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge'
    });
    this.getProgrammes(this.queryParams)
  }

}
