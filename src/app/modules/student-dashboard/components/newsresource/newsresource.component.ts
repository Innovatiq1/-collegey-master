import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-newsresource',
  templateUrl: './newsresource.component.html',
  styleUrls: ['./newsresource.component.css'],
})
export class NewsresourceComponent implements OnInit {
  userInfo: User = new User();

  // Mentor Resources Tab
  resourcesData: any;
  resourcesTitle: any;
  mentorArticleData: any;
  mentorCuratedresources: any;
  mentorFileData: any;

  // pagination
  currentPage: number = 1;
  currentLimit: number = 5;
  totalRecord: number = 0;
  mentorResourcenotFound: boolean = false;
  mentorResourceLeftpagignation: boolean = false;

  // pagination for article and files
  currentArticlePage: number  = 1;
  currentArticleLimit: number = 4;
  totalArticleRecord: number  = 0;

  // Mentor Artical pagination
  mentorArticalnotFound: boolean = false;
  mentorArticalLeftpagignation: boolean = false;

  // Mentor Curated pagination
  mentorCuratedResourcenotFound: boolean = false;
  mentorCuratedLeftpagignation: boolean = false;

  // Mentor File pagination
  mentorFilenotFound: boolean = false;
  mentorFilepagignation: boolean = false;

  constructor(
    private authService: AuthService,
    public commonService: CommonService,
    private resourcesService: ResourcesService,
    public sanitizer: DomSanitizer
  ) {
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
  }

  ngOnInit(): void {
    this.getNewsResources();
    this.getNewsArticle();
    this.getStudentCurated();
    this.getStudentFileData();
    this.getResourcesTitle();
  }

  getResourcesTitle() {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
    };
    this.resourcesService.getResourcesTitle(obj).subscribe(
      (response) => {
        this.resourcesTitle = response?.data[0];
      },
      (err) => {}
    );
  }

  getNewsResources() {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
    };
    this.resourcesService.getNewsResourcesData(obj).subscribe(
      (response) => {
        this.mentorResourcenotFound = false;
        this.resourcesData = response.data;
        this.currentPage = response.page;
        if (this.resourcesData.length <= 0) {
          this.mentorResourcenotFound = true;
        }
        if (response.page == 1) {
          this.mentorResourceLeftpagignation = false;
        }
        for (let j = 0; j < this.resourcesData.length; j++) {
          var youlink = this.resourcesData[j].link;
          this.resourcesData[j].link = this.getUrl(youlink);
        }
      },
      (err) => {}
    );
  }

  onListChangePage(event: any) {
    this.currentPage = this.currentPage + 1;
    this.getNewsResources();
    this.mentorResourceLeftpagignation = true;
  }

  onResourceListPreviousPage(event: any) {
    this.currentPage = this.currentPage - 1;
    this.getNewsResources();
  }

  getNewsArticle() {
    const obj = {
      limit: this.currentArticleLimit,
      page: this.currentArticlePage,
    };
    this.resourcesService.getNewsArticle(obj).subscribe(
      (response) => {
        this.mentorArticalnotFound = false;
        this.mentorArticleData = response.data;
        this.currentArticlePage       = response.page;
        if(this.mentorArticleData.length <= 0)
        {
          this.mentorArticalnotFound = true;
        }
        if (response.page == 1) {
          this.mentorArticalLeftpagignation = false;
        }
      },
      (err) => {}
    );
  }

  onArticalChangePage(event:any)
  {
    this.currentArticlePage = this.currentArticlePage + 1;
    this.getNewsArticle();
    this.mentorArticalLeftpagignation = true;
  }

  onArticalListPreviousPage(event:any)
  {
    this.currentArticlePage = this.currentArticlePage - 1;
    this.getNewsArticle();
  }

  getStudentCurated() {
    const obj = {
      limit: this.currentArticleLimit,
      page: this.currentArticlePage,
    };
    this.resourcesService.getStudentCurated(obj).subscribe(
      (response) => {
        this.mentorCuratedResourcenotFound = false;
        this.mentorCuratedresources = response.data;
        this.currentArticlePage       = response.page;
        if(this.mentorCuratedresources.length <= 0)
        {
          this.mentorCuratedResourcenotFound = true;
        }
        if (response.page == 1) {
          this.mentorCuratedLeftpagignation = false;
        }
      },
      (err) => {}
    );
  }

  onCuratedChangePage(event:any)
  {
    this.currentArticlePage = this.currentArticlePage + 1;
    this.getStudentCurated();
    this.mentorCuratedLeftpagignation = true;
  }

  onCuratedListPreviousPage(event:any)
  {
    this.currentArticlePage = this.currentArticlePage - 1;
    this.getStudentCurated();
  }

  getStudentFileData() {
    const obj = {
      limit: 4,
      page: this.currentPage,
    };
    this.resourcesService.getStudentFileData(obj).subscribe(
      (response) => {
        this.mentorFilenotFound = false;
        this.mentorFileData = response.data;
        this.currentPage = response.page;
        if (this.mentorFileData.length <= 0) {
          this.mentorFilenotFound = true;
        }
        if (response.page == 1) {
          this.mentorFilepagignation = false;
        }
      },
      (err) => {}
    );
  }

  onFileChangePage(event: any) {
    this.currentPage = this.currentPage + 1;
    this.getStudentFileData();
    this.mentorFilepagignation = true;
  }

  onFileListPreviousPage(event: any) {
    this.currentPage = this.currentPage - 1;
    this.getStudentFileData();
  }

  getUrl(val) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(val);
  }
}
