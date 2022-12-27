import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parents-profile',
  templateUrl: './parents-profile.component.html',
  styleUrls: ['./parents-profile.component.css']
})
export class ParentsProfileComponent implements OnInit {
  parentsprofile=true
  constructor() { }

  ngOnInit(): void {
    this.parentprofile();
  }
  parentprofile() {
    console.log("hii inoij")
    this.parentsprofile = true;

  }
}
