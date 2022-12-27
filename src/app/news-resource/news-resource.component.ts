import { Component, OnInit } from '@angular/core';

// Load Services
import { CommonService } from 'src/app/core/services/common.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/models/user.model';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import { ResourcesService } from 'src/app/core/services/resources.service';

@Component({
  selector: 'app-news-resource',
  templateUrl: './news-resource.component.html',
  styleUrls: ['./news-resource.component.css']
})
export class NewsResourceComponent implements OnInit {

  userInfo: User = new User();

  // Mentor Resources Tab
  resourcesData: any;
  mentorArticleData: any;
  mentorCuratedresources: any;
  mentorFileData: any;

  // pagination
  currentPage: number  = 1;
  currentLimit: number = 5;
  totalRecord: number  = 0;
  mentorResourcenotFound: boolean = false;
  mentorResourceLeftpagignation : boolean = false;

  // Mentor Artical pagination
  mentorArticalnotFound: boolean = false;
  mentorArticalLeftpagignation : boolean = false;

  // Mentor Curated pagination
  mentorCuratedResourcenotFound: boolean = false;
  mentorCuratedLeftpagignation : boolean = false;

   // Mentor File pagination
   mentorFilenotFound: boolean = false;
   mentorFilepagignation : boolean = false;

  constructor(
    private mentorDashboardService: MentorDashboardService,
    public commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
    public sanitizer:DomSanitizer,
    private resourcesService: ResourcesService,
  )
  { 
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
  }

  ngOnInit(): void {
    this.getNewsResources();
    this.getNewsArticle();
    this.getStudentCurated();
    this.getStudentFileData();
  }

  getUrl(val){
    return  this.sanitizer.bypassSecurityTrustResourceUrl(val); 
  }

  // Mentor Resoureces

  getNewsResources()
  {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
    };
    this.resourcesService.getNewsResourcesData(obj).subscribe(
      (response) => {
        this.mentorResourcenotFound = false;
        this.resourcesData = response.data;
        this.currentPage   = response.page;
        if(this.resourcesData.length <= 0)
        {
          this.mentorResourcenotFound = true;
        }
        if(response.page == 1)
        {
          this.mentorResourceLeftpagignation = false;
        }
        for (let j = 0; j < this.resourcesData.length; j++) {
          var youlink = this.resourcesData[j].link;
          this.resourcesData[j].link = this.getUrl(youlink);
        }
      },
      (err) => {
        
      },
    );     
  }

  onListChangePage(event:any)
  {
    this.currentPage = this.currentPage + 1;
    this.getNewsResources();
    this.mentorResourceLeftpagignation = true;
  }

  onResourceListPreviousPage(event:any)
  {
    this.currentPage = this.currentPage - 1;
    this.getNewsResources();
  }

  getNewsArticle()
  {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
    };
    this.resourcesService.getNewsArticle(obj).subscribe(
      (response) => {
        this.mentorArticalnotFound = false;
        this.mentorArticleData = response.data;
        this.currentPage       = response.page;
        if(this.mentorArticleData.length <= 0)
        {
          this.mentorArticalnotFound = true;
        }
        if(response.page == 1)
        {
          this.mentorArticalLeftpagignation = false;
        }
      },
      (err) => {
        
      },
    );     
  }

  onArticalChangePage(event:any)
  {
    this.currentPage = this.currentPage + 1;
    this.getNewsArticle();
    this.mentorArticalLeftpagignation = true;
  }

  onArticalListPreviousPage(event:any)
  {
    this.currentPage = this.currentPage - 1;
    this.getNewsArticle();
  }

  getStudentCurated()
  {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
    };
    this.resourcesService.getStudentCurated(obj).subscribe(
      (response) => {
        this.mentorCuratedResourcenotFound = false;
        this.mentorCuratedresources = response.data;
        this.currentPage       = response.page;
        if(this.mentorCuratedresources.length <= 0)
        {
          this.mentorCuratedResourcenotFound = true;
        }
        if(response.page == 1)
        {
          this.mentorCuratedLeftpagignation = false;
        }
      },
      (err) => {
        
      },
    );     
  }

  onCuratedChangePage(event:any)
  {
    this.currentPage = this.currentPage + 1;
    this.getStudentCurated();
    this.mentorCuratedLeftpagignation = true;
  }

  onCuratedListPreviousPage(event:any)
  {
    this.currentPage = this.currentPage - 1;
    this.getStudentCurated();
  }


  getStudentFileData()
  {
    const obj = {
      limit: 4,
      page: this.currentPage,
    };
    this.resourcesService.getStudentFileData(obj).subscribe(
      (response) => {
        this.mentorFilenotFound = false;
        this.mentorFileData = response.data;
        this.currentPage    = response.page;
        if(this.mentorFileData.length <= 0)
        {
          this.mentorFilenotFound = true;
        } 
        if(response.page == 1)
        {
          this.mentorFilepagignation = false;
        }
      },
      (err) => {

      },
    );     
  }

  onFileChangePage(event:any)
  {
    this.currentPage = this.currentPage + 1;
    this.getStudentFileData();
    this.mentorFilepagignation = true;
  }

  onFileListPreviousPage(event:any)
  {
    this.currentPage = this.currentPage - 1;
    this.getStudentFileData();
  }

}
