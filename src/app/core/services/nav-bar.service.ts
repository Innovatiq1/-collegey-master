import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  visible: boolean;
  private stateClassRef = {
    open: 'modalMenuOpen',
    closed: 'modalMenuClosed'
  };

  private menuState = 'closed';

  constructor(
    @Inject(DOCUMENT) private document: any
  ) {
    this.visible = false;
  }

  hideMenu() {
    // if (!isPlatformBrowser(this.platformId)) {
    this.visible = false;
    const body = document.getElementsByTagName('html')[0];
    body.className = this.stateClassRef['closed'];
    // }
  }

  toggleMenu() {
    // if (!isPlatformBrowser(this.platformId)) {
    const body = document.getElementsByTagName('html')[0];
    this.visible = !this.visible;
    this.menuState = this.menuState === 'open' ? 'closed' : 'open';
    body.className = this.stateClassRef[this.menuState];
    // }
  }
}
