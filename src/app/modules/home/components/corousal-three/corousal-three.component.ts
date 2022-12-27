import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-corousal-three',
  templateUrl: './corousal-three.component.html',
  styleUrls: ['./corousal-three.component.css'],
})
export class CorousalThreeComponent implements OnInit {
  @Input() mobile: boolean;
  @Input() homepageContent:any;
  
  public screenWidth: any;
  mobileView: boolean;

  constructor() {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 500) {
      this.mobileView = true;
    }
    if (this.screenWidth >= 500) {
      this.mobileView = false;
    }
  }

  ngOnInit(): void {}
}
