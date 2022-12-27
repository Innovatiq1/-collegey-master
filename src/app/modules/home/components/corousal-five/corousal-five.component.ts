import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-corousal-five',
  templateUrl: './corousal-five.component.html',
  styleUrls: ['./corousal-five.component.css'],
})
export class CorousalFiveComponent implements OnInit {

  @Input() homepageContent:any;

  public screenWidth: any;
  mobileView: boolean;

  constructor() {
    this.screenWidth = window.innerWidth;
   // console.log(this.screenWidth);
    if (this.screenWidth < 500) {
      this.mobileView = true;
    }
    if (this.screenWidth >= 500) {
      this.mobileView = false;
    }
  }

  ngOnInit(): void {}
}
