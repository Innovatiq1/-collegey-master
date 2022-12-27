import { Component, OnInit } from '@angular/core';

// Load Services
import { CommonService } from 'src/app/core/services/common.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/models/user.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tab-mentor-resources',
  templateUrl: './tab-mentor-resources.component.html',
  styleUrls: ['./tab-mentor-resources.component.css'],
})
export class TabMentorResourcesComponent implements OnInit {
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
  currentArticlePage: number = 1;
  currentArticleLimit: number = 4;
  totalArticleRecord: number = 0;

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
    private mentorDashboardService: MentorDashboardService,
    public commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
    public sanitizer: DomSanitizer
  ) {
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
  }

  ngOnInit(): void {
    this.getMentorResources();
    this.getMentorArticle();
    this.getMentorCurated();
    this.getMentorFile();
    this.getResourcesTitle();
  }

  getUrl(val) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(val);
  }

  // Mentor Resoureces

  getMentorResources() {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
    };
    this.mentorDashboardService.getMentorResources(obj).subscribe(
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

  getResourcesTitle() {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
    };
    this.mentorDashboardService.getResourcesTitle(obj).subscribe(
      (response) => {      
        this.resourcesTitle = response?.data[0];      
      },
      (err) => {}
    );
  }

  onListChangePage(event: any) {
    this.currentPage = this.currentPage + 1;
    this.getMentorResources();
    this.mentorResourceLeftpagignation = true;
  }

  onResourceListPreviousPage(event: any) {
    this.currentPage = this.currentPage - 1;
    this.getMentorResources();
  }

  getMentorArticle() {
    const obj = {
      limit: this.currentArticleLimit,
      page: this.currentArticlePage,
    };
    this.mentorDashboardService.getMentorArticle(obj).subscribe(
      (response) => {
        this.mentorArticalnotFound = false;
        this.mentorArticleData = response.data;
        this.currentArticlePage = response.page;
        if (this.mentorArticleData.length <= 0) {
          this.mentorArticalnotFound = true;
        }
        if (response.page == 1) {
          this.mentorArticalLeftpagignation = false;
        }
      },
      (err) => {}
    );
  }

  onArticalChangePage(event: any) {
    this.currentArticlePage = this.currentArticlePage + 1;
    this.getMentorArticle();
    this.mentorArticalLeftpagignation = true;
  }

  onArticalListPreviousPage(event: any) {
    this.currentArticlePage = this.currentArticlePage - 1;
    this.getMentorArticle();
  }

  getMentorCurated() {
    const obj = {
      limit: this.currentArticleLimit,
      page: this.currentArticlePage,
    };
    this.mentorDashboardService.getMentorCurated(obj).subscribe(
      (response) => {
        this.mentorCuratedResourcenotFound = false;
        this.mentorCuratedresources = response.data;
        this.currentArticlePage = response.page;
        if (this.mentorCuratedresources.length <= 0) {
          this.mentorCuratedResourcenotFound = true;
        }
        if (response.page == 1) {
          this.mentorCuratedLeftpagignation = false;
        }
      },
      (err) => {}
    );
  }

  onCuratedChangePage(event: any) {
    this.currentArticlePage = this.currentArticlePage + 1;
    this.getMentorCurated();
    this.mentorCuratedLeftpagignation = true;
  }

  onCuratedListPreviousPage(event: any) {
    this.currentArticlePage = this.currentArticlePage - 1;
    this.getMentorCurated();
  }

  getMentorFile() {
    const obj = {
      limit: this.currentArticleLimit,
      page: this.currentArticlePage,
    };
    this.mentorDashboardService.getMentorFile(obj).subscribe(
      (response) => {
        this.mentorFilenotFound = false;
        this.mentorFileData = response.data;
        this.currentArticlePage = response.page;
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
    this.currentArticlePage = this.currentArticlePage + 1;
    this.getMentorFile();
    this.mentorFilepagignation = true;
  }

  onFileListPreviousPage(event: any) {
    this.currentArticlePage = this.currentArticlePage - 1;
    this.getMentorFile();
  }
}
