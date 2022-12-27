import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { ConfigService } from 'src/app/core/services/config.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { Student } from 'src/app/core/models/user.model';
import { UserType } from 'src/app/core/enums/user-type.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  AUTH_TYPES = AuthType;
  @Input() authType: AuthType;
  returnUrl: string;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: any,
    private title: Title,
    private router: Router,
    public configService: ConfigService,
    private activatedRoute: ActivatedRoute

  ) {
    this.title.setTitle('Collegey - Login');
    this.authType = AuthType.LOGIN;
  }

  ngOnInit(): void {
    this.configService.updateConfig({ headerClass: 'transparent-header' });
    this.configService.configs.blueLogo = false;
    if (isPlatformBrowser(this.platformId)) {
      const blankSpace: HTMLElement = this.document.getElementById(
        'login-page-space'
      );
      const loginElement: HTMLElement = this.document.getElementById(
        'login-page-block'
      );
      loginElement.setAttribute('style', 'display: flex');
      blankSpace.remove();
    }
    
    this.returnUrl = this.activatedRoute.snapshot.queryParams["returnUrl"] || "/student/profile";
  }

  openSignUpForm() {
    this.authType = AuthType.SIGN_UP;
  }

  onLoginSuccess() {
    this.router.navigateByUrl(this.returnUrl);
  }

  ngOnDestroy(): void {
    this.configService.setDefaultConfigs();
  }
}
