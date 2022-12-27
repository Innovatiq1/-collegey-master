import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-corousal-footer',
  templateUrl: './corousal-footer.component.html',
  styleUrls: ['./corousal-footer.component.css'],
})
export class CorousalFooterComponent implements OnInit {
  @Input() mobile: boolean;
  footerLogoDetails: any;
  screenWidth: number;
  mobileView: boolean;

  constructor(
    public commonService: CommonService,
    private studentService: StudentService,
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
   // console.log('text =>', this.mobile);
    this.getFooterLogo();
  }
 
  getFooterLogo() {
    this.studentService.getFooterLogo().subscribe((res) => {
      this.footerLogoDetails = res.data;
     // console.log(this.footerLogoDetails)
    })
  }

}
