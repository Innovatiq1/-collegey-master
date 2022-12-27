import { Component, OnInit, ViewChild, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Resource} from 'src/app/core/models/resources.model';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { CommonService } from 'src/app/core/services/common.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ResourcesRoutes } from './resources-routing.module';


@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent implements OnInit {

  articles: Resource[] = [];
  webinars: Resource[] = [];
  programmes: Resource[] = [];
  conferences: Resource[] = [];
  latestArticle: Resource;
  ResourcesRoutes = ResourcesRoutes;
  totalBlogs: number;
  currentPage = 1;
  queryParams: { [key: string]: string | number };
  currentUrl: string;

  constructor(
    private resourcesService: ResourcesService,
    public commonService: CommonService,
    private route: Router,
    ) {
    this.currentUrl = this.route.url.split('/')[2];
    }

  ngOnInit(): void {
    this.getAllResources();
  }

  getAllResources() {
    this.resourcesService.getResources().subscribe(resources => {
      this.webinars = resources.data.webinars;
      this.programmes = resources.data.programs;
      // this.conferences = resources.data.

    });
  }
  getLatestArticle(article) {
    this.latestArticle = article;
  }

  onNavigate(route) {
      this.resourcesService.navigateToResources(route);
  }
}
