import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-corousal-four',
  templateUrl: './corousal-four.component.html',
  styleUrls: ['./corousal-four.component.css'],
})
export class CorousalFourComponent implements OnInit {
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
    }}

  ngOnInit(): void {}
}
