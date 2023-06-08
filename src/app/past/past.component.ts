import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.css']
})
export class PastComponent implements OnInit {

  pastLoadmore:boolean = false;
  constructor(
    private router: Router,

  ) { }
  ngOnInit(): void {
    this.pastLoadmore = false;
  }  
  goToLoad(pagename: string): void {
    this.pastLoadmore =  true;
    // this.router.navigate([`${pagename}`])
  }
  goToCards(pagename: string): void {
    this.router.navigate([`${pagename}`])
  }

}
