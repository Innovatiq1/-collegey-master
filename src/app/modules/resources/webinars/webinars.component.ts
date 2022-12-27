import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { Resource } from 'src/app/core/models/resources.model';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-resources-webinars',
  templateUrl: './webinars.component.html',
  styleUrls: ['./webinars.component.css'],
})

export class WebinarsComponent implements OnInit {

  queryParams: { [key: string]: string | number };
  webinars: Resource[] = [];
  totalWebinars: number;
  currentPage = 1;

  constructor(
    public commonService: CommonService,
    private resourcesService: ResourcesService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  )
  {
    this.queryParams = { ...AppConstants.DEFAULT_SEARCH_PARAMS };
  }

  getWebinars(params?: {}) {
    this.resourcesService.getWebinars(params).subscribe(webinar => {
      this.webinars = webinar.data.docs;
      this.totalWebinars =  webinar.data.totalDocs;
      // console.log('hi', webinar.data.totalDocs);
      // console.log('hi2', webinar.data.docs);
    });
  }

  loadMore(event: any) {
    // console.log(event);
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
      this.getWebinars(this.queryParams);
    });
  }

}
