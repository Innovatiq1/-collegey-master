import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Resource } from 'src/app/core/models/resources.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-public-blog-tag',
  templateUrl: './public-blog-tag.component.html',
  styleUrls: ['./public-blog-tag.component.css'],
})
export class PublicBlogTagComponent implements OnInit {
  articles: any;
  tagTitle: any;
  tag: any;

  constructor(
    private resourcesService: ResourcesService,
    public commonService: CommonService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTagArticleData();
  }

  onNavigate(slug) {
    // console.log("Slug",slug)
    this.resourcesService.navigateToBlogDetail(slug);
  }

  getTagArticleData() {
    if (this.tag) {
      var param = this.tag;
    } else {
      param = this.activatedRoute.snapshot.params.tag;
    }

    const obj = {
      blogTag: param,
    };
    this.tagTitle = param;
    this.cdr.detectChanges();
    this.resourcesService.getTagArticleData(obj).subscribe(
      (response) => {
        this.articles = response?.data;
        this.cdr.detectChanges();
      },
      (err) => {}
    );
  }
  getBlogsByTag(tag) {
    this.tag = tag;
    this.router.navigate(['/blog/tag/' + tag]);
    this.getTagArticleData();
  }
}
