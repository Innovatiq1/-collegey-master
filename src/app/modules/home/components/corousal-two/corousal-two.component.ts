import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-corousal-two',
  templateUrl: './corousal-two.component.html',
  styleUrls: ['./corousal-two.component.css'],
})
export class CorousalTwoComponent implements OnInit {
  @Input() mobile: boolean;
  @Input() homepageContent:any;

  screenWidth: number;
  mobileView: boolean;

  constructor() {
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
  }
}
