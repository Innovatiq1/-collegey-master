import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  University = true;
  About = false;
  Pitch = false;
  opportunities = false;
  Campuscluture = false;
  Communcation = false;
  Ambassdor = false;
  Documents = false;
  Importantdates = false
  research=false;
  internship=false;
  isCharheStudent:number= -1;
  constructor() { }

  ngOnInit(): void {
  }
  university() {
    console.log("hii inoij")
    this.University = true;
    this.About = false;
    this.Pitch = false;
    this.opportunities = false;
    this.Campuscluture = false;
    this.Communcation = false;
    this.Ambassdor = false;
    this.Documents = false;
    this.Importantdates = false;
  }
  about() {
    console.log("gugu")
    this.University = false;
    this.About = true;
    this.Pitch = false;
    this.opportunities = false;
    this.Campuscluture = false;
    this.Communcation = false;
    this.Ambassdor = false;
    this.Documents = false;
    this.Importantdates = false;
  }
  pitch() {
    this.University = false;
    this.About = false;
    this.Pitch = true;
    this.opportunities = false;
    this.Campuscluture = false;
    this.Communcation = false;
    this.Ambassdor = false;
    this.Documents = false;
    this.Importantdates = false;
  }
  Opportunities() {
    this.University = false;
    this.About = false;
    this.Pitch = false;
    this.opportunities = true;
    this.Campuscluture = false;
    this.Communcation = false;
    this.Ambassdor = false;
    this.Documents = false;
    this.Importantdates = false;
  }
  campuscluture() {
    this.University = false;
    this.About = false;
    this.Pitch = false;
    this.opportunities = false;
    this.Campuscluture = true;
    this.Communcation = false;
    this.Ambassdor = false;
    this.Documents = false;
    this.Importantdates = false;
  }
  communcation() {
    this.University = false;
    this.About = false;
    this.Pitch = false;
    this.opportunities = false;
    this.Campuscluture = false;
    this.Communcation = true;
    this.Ambassdor = false;
    this.Documents = false;
    this.Importantdates = false;
  }
  ambassdor() {
    this.University = false;
    this.About = false;
    this.Pitch = false;
    this.opportunities = false;
    this.Campuscluture = false;
    this.Communcation = false;
    this.Ambassdor = true;
    this.Documents = false;
    this.Importantdates = false;
  }
  documents() {
    this.University = false;
    this.About = false;
    this.Pitch = false;
    this.opportunities = false;
    this.Campuscluture = false;
    this.Communcation = false;
    this.Ambassdor = false;
    this.Documents = true;
    this.Importantdates = false;
  }
  importantdates() {
    this.University = false;
    this.About = false;
    this.Pitch = false;
    this.opportunities = false;
    this.Campuscluture = false;
    this.Communcation = false;
    this.Ambassdor = false;
    this.Documents = false;
    this.Importantdates = true;
  }
  insternshipbutton(){
  this.internship=true;
  this.research=false;
  }
  reseachbutton(){
    this.research=true;
    this.internship=false;
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
