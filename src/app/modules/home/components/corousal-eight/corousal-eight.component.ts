import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-corousal-eight',
  templateUrl: './corousal-eight.component.html',
  styleUrls: ['./corousal-eight.component.css'],
})
export class CorousalEightComponent implements OnInit {
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

  ngOnInit(): void {}
}
