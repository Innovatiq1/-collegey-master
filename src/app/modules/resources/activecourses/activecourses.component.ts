import {
  Component,
  OnInit,
} from '@angular/core';
import { Resource } from 'src/app/core/models/resources.model';
import { CommonService } from 'src/app/core/services/common.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-activecourses',
  templateUrl: './activecourses.component.html',
  styleUrls: ['./activecourses.component.css']
})
export class ActivecoursesComponent implements OnInit {

  currentPage = 1;
  queryParams: { [key: string]: string | number };
  totalCourses: number;
  Courses: Resource[];

  constructor(
    public commonService: CommonService,
    private resourcesService: ResourcesService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.queryParams = { ...AppConstants.DEFAULT_SEARCH_PARAMS };

  }

  getCourses(params?: {}) {
    this.resourcesService.getCourses(params).subscribe(courses => {
      this.Courses  = courses.data.docs;
      this.totalCourses = courses.data.totalDocs;
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
  }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.queryParams = { ...this.queryParams, ...params };
      this.currentPage = +params['page'];
      this.getCourses(this.queryParams);
    });

    if(this.route.url.includes('course')) {
    }
  }

}
