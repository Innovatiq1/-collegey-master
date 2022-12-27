import { Component, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit, OnInit } from '@angular/core';
import { AuthModalType } from './core/enums/login.enum';
import { AuthService } from './core/services/auth.service';
import { ConfigService, AppConfig } from './core/services/config.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  appConfig: AppConfig;
  onConfigChanged: Subscription;

  currentUserRole: any;
  showFooterCheck: boolean = true;
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    public router: Router,
  )
  {
    const loggedInInfo   = this.authService.getUserInfo(); 
    this.currentUserRole = localStorage.getItem('fetchcurrentUserRole');
  }

  ngOnInit() {
    
    let cc = window as any;
       cc.cookieconsent.initialise({
         palette: {
           popup: {
             background: "#ff971a87",
             text: "#000"
           },
           button: {
             background: "#3F89FC",
             text: "#fff"
           }
         },
         theme: "classic",
         content: {
           message: 'We, and third parties, use cookies for technical and analytical purposes, for marketing purposes and for integration with social media. For more information, refer to our Privacy Policy and Terms of Consent. By clicking on ‘I agree’, you consent to the use of these cookies.',
          //  dismiss: this.cookieDismiss,
          //  link: this.cookieLinkText,
          //  href: environment.Frontend + "/dataprivacy" 
         }
       });
    this.scrollOnTop();
    this.showFooterCheck = true;
    if(this.currentUserRole !== undefined)
    {
      this.checkRouteAll(); 
    }
  }

  checkRouteAll()
  {
    // CHECK ROUTE EVENTS

    this.router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
        const urlParams = new URLSearchParams(window.location.search);
        let myCuruentUrl =  val['urlAfterRedirects'];
        
        if(myCuruentUrl == '/student-dashboard/$/project' || myCuruentUrl == '/mentors/project')
        {
          this.showFooterCheck = false;
        }
        else
        {
          this.showFooterCheck = true;
        }
        
        let studentFlag  =  myCuruentUrl.includes("/student-dashboard");
        let mentorFlag   =  myCuruentUrl.includes("/mentors");
        if(studentFlag == true)
        {
          if(localStorage.getItem('fetchcurrentUserRole') == 'student')
          {
            return true;
          }
          else
          {
            this.router.navigateByUrl('/mentors/dashboard'); 
          }
        }
        else if(mentorFlag == true)
        {
          if(localStorage.getItem('fetchcurrentUserRole') == 'mentor')
          {
            return true;
          }
          else
          {
            this.router.navigateByUrl('/student-dashboard/$');
          }
        }
      }
    });
    
  }
  
  ngAfterViewInit(): void {
     // Subscribe to all the settings change events
     this.onConfigChanged = this.configService.onAppConfigChanged.subscribe(
      (config: AppConfig) => {
        this.appConfig = config;
        this.authService.closeAuthDialog();   // by default close any open auth modal
        this.cdr.detectChanges();
      }
    );
  }

  /**
   * Scroll to top on page change
   */
  scrollOnTop() {
    const navigationEndEvent = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
    navigationEndEvent.subscribe((event: NavigationEnd) => {
        // Scroll Top On Page Change
        window.scrollTo(0, 0);
    });
  }

  ngOnDestroy(): void {
    if(this.onConfigChanged) {
      this.onConfigChanged.unsubscribe();
    }
  }


}
