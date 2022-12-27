import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Resource } from 'src/app/core/models/resources.model';
import { CommonService } from 'src/app/core/services/common.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-common-articles',
  templateUrl: './common-articles.component.html',
  styleUrls: ['./common-articles.component.css']
})
export class CommonArticlesComponent implements OnInit {
  articles: Resource[] = [];
  totalBlogs: number;
  latestArticle: Resource;
  currentPage = 1;
  hidePagination = false;
  queryParams: { [key: string]: string | number };
  @Input() showRecords: number;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onGettingLatestArticle: EventEmitter<any> = new EventEmitter();

  constructor(
    public commonService: CommonService,
    private resourcesService: ResourcesService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private router: Router
  )
  {
    this.queryParams = { ...AppConstants.DEFAULT_SEARCH_PARAMS };
  }

  onNavigate(slug) {
    this.resourcesService.navigateToBlogDetail(slug);
  }

  getArticles(params?: {}) {
    this.resourcesService.getArticles(params).subscribe(article => {
      this.articles = article.data.docs;
      this.onGettingLatestArticle.emit(this.articles[0]);
      this.totalBlogs = article.data.totalDocs;
      if (this.showRecords) {
        this.articles = this.articles
          .slice(0, this.showRecords);
      }
    });
  }

  loadMore(event: any) {
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
      this.getArticles(this.queryParams);
    });

    if(this.route.url.includes('blog')) {
      this.hidePagination = true;
    }
  }

  getBlogsByTag(tag) {
    this.router.navigate(['/blog/tag/'+tag]);
  }

}
