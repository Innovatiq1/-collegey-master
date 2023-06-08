import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit {

  loadmore: boolean = false;
  constructor(
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.loadmore = false;
  }
  goToLoad(pagename: string): void {
    this.loadmore = true;
    // this.router.navigate([`${pagename}`])
  }
  goToCards(pagename: string): void {
    this.router.navigate([`${pagename}`])
  }

}
