import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-impact-profile',
  templateUrl: './impact-profile.component.html',
  styleUrls: ['./impact-profile.component.css']
})
export class ImpactProfileComponent implements OnInit {
  impactprofile = true;
  impactproject = false;
  isCharheStudent:number= -1;
  constructor() { }

  ngOnInit(): void {
  }
  ipprofile() {
    console.log("hii inoij")
    this.impactprofile = true;
    this.impactproject = false;

  }
  projectonboarding() {
    console.log("gugu")
    this.impactprofile = false;
    this.impactproject = true;
  }
  
  clickRadio(event){
    console.log(event.target.value,"kkkkkkkkkkk");
    if(event.target.value == 1){
     this.isCharheStudent = 1;
    }else if(event.target.value == 0){
     this.isCharheStudent = 0;
    }else{
     this.isCharheStudent = -1
    }
 }
}
