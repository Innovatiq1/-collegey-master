import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private router: Router) { }

  isLinkActive(url): boolean {
    const queryParamsIndex = this.router.url.indexOf('?');
    const baseUrl = queryParamsIndex === -1 ? this.router.url : 
    this.router.url.slice(0, queryParamsIndex);
    return baseUrl === url;
 }

  ngOnInit(): void {
  }

}
