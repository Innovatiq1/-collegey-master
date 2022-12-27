import { Component, OnInit, Input, PLATFORM_ID, Inject, OnDestroy, OnChanges } from '@angular/core';
import { SocialUsers } from 'src/app/core/models/social-user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() socialUserInfo: SocialUsers;
  authType: AuthType;
  AUTH_TYPES = AuthType;
  returnUrl: string;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: any,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService) {
    this.title.setTitle('Collegey - SignUp');
    this.authType = AuthType.SIGN_UP;
  }

  ngOnInit(): void {
    this.configService.updateConfig({ headerClass: 'transparent-header', blueLogo: false });
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
    this.returnUrl =
    this.activatedRoute.snapshot.queryParams["returnUrl"] || "/student/profile";
  }

  loginSuccessEvent(event) {
    this.router.navigateByUrl(this.returnUrl);
  }

  ngOnChanges(): void {
    console.log(this.socialUserInfo);
    
  }

  ngOnDestroy(): void {
    this.configService.setDefaultConfigs();
  }
}
