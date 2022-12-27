import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';
import { StudentDashboardService } from 'src/app/core/services/student-dashboard.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  footerLogoDetails: any;
  screenWidth: number;
  mobileView: boolean;
  checkBloglink: boolean = false;
  checkCurrentRole: boolean = false;
  public footerContentData:any;
  public homepageImpactImg:any;
  public homepageUniversityLogo:any;
  constructor(
    private router: Router,
    private authService: AuthService,
    public commonService: CommonService,
    private studentService: StudentService,
    private studentDashboardService: StudentDashboardService,
  ) {
    this.screenWidth = window.innerWidth;
    //console.log(this.screenWidth);
    if (this.screenWidth < 900) {
      this.mobileView = true;
    }
    if (this.screenWidth >= 900) {
      this.mobileView = false;
    }
  }
  
  ngOnInit(): void {
    this.getHomepageContentData();
    this.getFooterLogo();
    if(localStorage.getItem('fetchcurrentUserRole') == 'mentor')
    {
      this.checkCurrentRole = true;
    }
    if(this.authService.getToken())
    {
      this.checkBloglink = true;
    }
    else
    {
      this.checkBloglink = false;
    }
  }
 
  

  slideConfig = {
    arrows: true,
    dots: false,
    slidesToScroll: 1,
    slidesToShow: 8,
    centerPadding: "15px",
    speed: 2000,
    infinite: true,
    autoplaySpeed: 0,
    autoplay: true,
    cssEase: "linear",
    draggable: false,
    pauseOnFocus: false,
    pauseOnHover: false,
    swipeToSlide: true,
  };
  
  getHomepageContentData()
  {
    let obj = {};
    this.studentDashboardService.getHomepageContentData(obj).subscribe(
      (response) => { 
        this.footerContentData  = response?.data?.home_footer_section[0];
        this.homepageImpactImg  = response?.data?.home_footer_section[0]?.imagePath;
        this.homepageUniversityLogo = response?.data?.home_bottom_second_slide_data;
      }, 
      (err) => {
      
      },
    );   
  }

  getFooterLogo() {
    this.studentService.getFooterLogo().subscribe((res) => {
      this.footerLogoDetails = res.data;
     // console.log(this.footerLogoDetails)
    })
  }

  date = new Date().getFullYear();

  onNavigateToResources() {
    this.router.navigateByUrl('blog');
    if(this.authService.getToken()){
      this.router.navigateByUrl('magazine');
    } else {
      this.router.navigateByUrl('blog');
    }
  }
}
