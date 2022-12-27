import { Component, OnInit } from '@angular/core';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-blog-banner',
  templateUrl: './blog-banner.component.html',
  styleUrls: ['./blog-banner.component.css']
})
export class BlogBannerComponent implements OnInit {

  constructor(
    private resourcesService: ResourcesService,
    public commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  onRegister() {
    if (!this.authService.getToken()) {
      this.router.navigateByUrl('/sign-up?returnUrl=/magazine');
      return;
    }
  }

}

