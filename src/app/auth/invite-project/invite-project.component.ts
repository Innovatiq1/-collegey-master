import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-invite-project',
  templateUrl: './invite-project.component.html',
  styleUrls: ['./invite-project.component.css'],
})
export class InviteProjectComponent implements OnInit , OnDestroy{
  isTokenValid: boolean = false;
  resetPasswordResponse: any;
  isServerResponse: boolean;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.configService.updateConfig({ headerClass: 'transparent-header' });
    const token = this.route.snapshot.queryParams['token'];
    this.checkResetUrlValidation(token);
  }

  checkResetUrlValidation(token) {
    this.authService.checkResetUrlValidation(token).subscribe(
      (res) => {
        this.resetPasswordResponse = res.data;
        this.isServerResponse = true;
        this.isTokenValid = true;
      },
      (err) => {
        this.isServerResponse = true;
      }
    );
  }

  ngOnDestroy(): void {
    this.configService.setDefaultConfigs();
  }
}
