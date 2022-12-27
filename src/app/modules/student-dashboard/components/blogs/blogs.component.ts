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
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
dashboard:any;
 
currentBlog : Resource ;
currentPage  = 1;
params = {limit : 1};
totalPages = 1;
prevPage = null
nextPage = null
queryParams: { [key: string]: string | number };
queryParams1: { [key: string]: string | number };

@Input() showRecords: number;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onGettingLatestArticle: EventEmitter<any> = new EventEmitter();
  articles: Resource[] = [];
  totalBlogs: number;
  latestArticle: Resource; 
  hidePagination = false;
  show_loader: boolean = false;  
  tagarticles: any;

constructor(
  private resourcesService: ResourcesService,
  public  commonService: CommonService,
  private authService: AuthService,
  private router: Router,
  private route: Router,
  private studentDashboardService:StudentDashboardService,
  private cdr: ChangeDetectorRef,
  private activatedRoute: ActivatedRoute
) {
  this.queryParams1 = { ...AppConstants.DEFAULT_SEARCH_PARAMS };
}
 

ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe((params: Params) => {
    this.queryParams = { limit: 1,page : 1 };
    this.queryParams1 = { ...this.queryParams1, ...params };
    this.getArticles(this.queryParams);
    this.getArticles1(this.queryParams1);
  });
  this.getDashboradDetails();
  
}

getDashboradDetails() {
  this.show_loader = true;
  this.studentDashboardService.getDashboardDetail().subscribe((res) => {
       this.dashboard = res;
       this.show_loader = false;
      // console.log(res, "Dashboard Details");
  })
}

getArticles(params?: {}) {
  this.show_loader = true;
  this.resourcesService.getArticles(params).subscribe(article => {
    this.currentBlog = article.data.docs[0];
    this.cdr.detectChanges();
    this.totalPages = article.data.totalDocs;
    this.nextPage = article.data.nextPage;
    this.prevPage = article.data.prevPage;
    this.show_loader = false;
   // console.log("Blog",article,this.currentBlog,this.totalPages) 
   // console.log("Current currentBlog Page",this.currentBlog)
  });
}
getArticles1(params?: {}) {
  this.show_loader = true;
  this.resourcesService.getArticles(params).subscribe(article => {
    this.articles = article.data.docs;
    this.cdr.detectChanges();
    this.onGettingLatestArticle.emit(this.articles[0]);
    this.totalBlogs = article.data.totalDocs;
    if (this.showRecords) {
      this.articles = this.articles
        .slice(0, this.showRecords); 
    }
   // console.log("Current articles Page",this.articles);
    this.show_loader = false;
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
loadNext(event :any){
  // console.log(event);
  this.currentPage = event.page;
  this.queryParams = { limit : 1, page: this.nextPage };
  this.getArticles(this.queryParams)
}
loadPrev(event :any){
  // console.log(event);
  this.currentPage = event.page;
  this.queryParams = { limit : 1 , page: this.prevPage };
  this.getArticles(this.queryParams)
}
onNavigate(slug) {
  // console.log("Slug",slug)
  this.resourcesService.navigateToBlogDetail(slug);
}

openBlogTagList(tag){
  // let params ={
  //   "blogTag":tag
  // }
  // this.show_loader = true;
  // this.resourcesService.getBlogTagList(params).subscribe(article => {
  //   this.tagarticles = article.data;
  //   this.show_loader = false;   
  // });
  this.router.navigate(['blog/tag/'+tag]);

}


}
