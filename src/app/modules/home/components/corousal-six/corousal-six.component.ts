import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-corousal-six',
  templateUrl: './corousal-six.component.html',
  styleUrls: ['./corousal-six.component.scss'],
})
export class CorousalSixComponent implements OnInit {
  @Input() homepageContent:any;
  public screenWidth: any;
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
