import {
  Component,
  OnInit,
} from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';

import { ResourcesService } from 'src/app/core/services/resources.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Resource } from 'src/app/core/models/resources.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-static-blogs',
  templateUrl: './static-blogs.component.html',
  styleUrls: ['./static-blogs.component.css'],
})

export class StaticBlogsComponent implements OnInit {
  currentBlog : Resource ;
  currentPage  = 1;
  params = {limit : 1};
  totalPages = 1;
  prevPage = null
  nextPage = null
  queryParams: { [key: string]: string | number };
  constructor(
    private resourcesService: ResourcesService,
    public commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    private route: Router,
    private activatedRoute: ActivatedRoute
  )
  {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.queryParams = { limit: 1,page : 1 };
      this.getArticles(this.queryParams);
    });
  }

  getArticles(params?: {}) {
    this.resourcesService.getArticles(params).subscribe(article => {
      this.currentBlog = article.data.docs[0];
      this.totalPages = article.data.totalDocs;
      this.nextPage = article.data.nextPage;
      this.prevPage = article.data.prevPage;
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
  loadNext(event :any){
    this.currentPage = event.page;
    this.queryParams = { limit : 1, page: this.nextPage };
    this.getArticles(this.queryParams)
  }
  loadPrev(event :any){
    this.currentPage = event.page;
    this.queryParams = { limit : 1 , page: this.prevPage };
    this.getArticles(this.queryParams)
  }
  onNavigate(slug) {
    this.resourcesService.navigateToBlogDetail(slug);
  }
  getBlogsByTag(tag) {
    this.router.navigate(['/blog/tag/'+tag]);
  }
}
