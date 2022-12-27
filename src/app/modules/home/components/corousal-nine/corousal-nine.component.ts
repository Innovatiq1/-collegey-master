import { Component, OnInit,Input} from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-corousal-nine',
  templateUrl: './corousal-nine.component.html',
  styleUrls: ['./corousal-nine.component.scss'],
})
export class CorousalNineComponent implements OnInit {

  @Input() homepageContent:any;
  @Input() homepageContent1:any;
  @Input() homepageImpactImg:any;

  collegeyLogoDetails: any;
  universityLogoDetails: any;
  screenWidth: number;
  mobileView: boolean;


  constructor(
    public commonService: CommonService,
    private studentService: StudentService,
  ) {    this.screenWidth = window.innerWidth;
    //console.log(this.screenWidth);
    if (this.screenWidth < 900) {
      this.mobileView = true;
    }
    if (this.screenWidth >= 900) {
      this.mobileView = false;
    }}

  ngOnInit(): void {
    this.getCollegeyLogo();
    this.getUniversityLogo();
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

  getCollegeyLogo() {
    this.studentService.getCollegeyLogo().subscribe((res) => {
      this.collegeyLogoDetails = res.data;
     // console.log(this.collegeyLogoDetails)
    })
  }

  getUniversityLogo() {
    this.studentService.getUniversityLogo().subscribe((res) => {
      this.universityLogoDetails = res.data;
     // console.log(this.universityLogoDetails)
    })
  }

}
