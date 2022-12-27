import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/core/services/nav-bar.service';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserType } from 'src/app/core/enums/user-type.enum';

@Component({
  selector: 'app-header-mobile-menu',
  templateUrl: './header-mobile-menu.component.html',
  styleUrls: ['./header-mobile-menu.component.css']
})
export class HeaderMobileMenuComponent implements OnInit {
  USER_TYPES = UserType;
  constructor(public navbarService: NavbarService,
    private authService: AuthService) {}

  ngOnInit() {}

  onRegister(userType) {
    this.navbarService.toggleMenu();
    this.authService.openAuthDialog(AuthType.SIGN_UP, userType);
  }
  openLoginModal() {
    this.navbarService.toggleMenu();
    this.authService.$selectUserLogin.next(UserType.STUDENTS);
    this.authService.openAuthDialog(AuthType.LOGIN, UserType.STUDENTS);
  }
}
