import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import fullpage from 'fullpage.js/dist/fullpage.extensions.min';
import { ConfigService } from 'src/app/core/services/config.service';
import { AuthType } from 'src/app/core/enums/auth-type.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { User } from 'src/app/core/models/user.model';
import { UserType } from 'src/app/core/enums/user-type.enum';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit, OnDestroy {

  fullPageObj: any;

  // blueLogo = false;
  constructor(
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configService.configs.header = false;
    this.configService.configs.footer = false;
    this.configService.updateConfig({ headerClass: 'transparent-header' });

    // tslint:disable-next-line:no-unused-expression
    this.fullPageObj = new fullpage('#fullpage', {
      navigation: true,
      slidesNavigation: true,
      //Scrolling
      css4: true,
      scrollingSpeed: 700,
      autoScrolling: true,
      fitToSection: true,
      fitToSectionDelay: 1000,
      scrollBar: false,
      easing: 'easeInOutCubic',
      easingcss3: 'ease',
      loopBottom: false,
      loopTop: false,
      loopHorizontal: true,
      continuousVertical: false,
      continuousHorizontal: false,
      scrollHorizontally: false,
      interlockedSlides: false,
      dragAndMove: false,
      offsetSections: false,
      resetSliders: false,
      fadingEffect: true,
      // normalScrollElements: '#element1, .element2',
      scrollOverflow: true,
      scrollOverflowReset: false,
      scrollOverflowOptions: null,
      touchSensitivity: 15,
      bigSectionsDestination: null,
      onLeave: (origin, destination, direction) => {
        // const title = $('.collegey-your-space');
        // const advantageBox = $('.advantage-box');
        const socialIcons = $('.social-icons-list li a');
        const headerScrollIndicator = $('.header-scroll-indicator > span');

        if (destination.index == 1) {
          // this.blueLogo = false;
          this.configService.configs.blueLogo = false;
          socialIcons.css('color' , '#fff');
          headerScrollIndicator.css('background', '#fff');
          const collegeyYourStoryBox = $('.collegey-your-story-box');
          collegeyYourStoryBox.addClass('animated');
          // advantageContentBox.addClass('hidden-initial');
          // advantageContentBox.show().addClass('animated');
          // advantageBox.eq(0).css('animation-delay', '.5s');
          // advantageBox.eq(1).css('animation-delay', '.1s');
          // advantageBox.eq(2).css('animation-delay', '1.5s');
          // title1.eq(1).css('animation-delay', '5s');
          // title1.show().addClass('animated full-fadeInUp');
          // title1.eq(0).css('animation-delay', '.3s');
          // title1.eq(1).css('animation-delay', '.16s');
          // title1.eq(2).css('animation-delay', '.19s');
          // title.addClass('animated fadeInUp');
          // title1.children('.collegey-your-story-content').children('.collegey-your-space').css('animation-delay', '.9s');
        }
        
        if (destination.index == 2) {
          // this.blueLogo = false;
          this.configService.configs.blueLogo = false;
          const advantageContentBox = $('.advantage-content-box');
          socialIcons.css('color' , 'black');
          headerScrollIndicator.css('background', 'black');
          advantageContentBox.addClass('animated');
          // $('.advantage-content-box').children('h2').addClass('animation-delay-2');
          // $('.advantage-content-box h2').css('visibility', 'visible');
          // advantageContentBox.show().addClass('animated fadeInUp');
          // advantageBox.eq(0).addClass('animated fadeInUp');
          // advantageBox.eq(0).css('animation-delay', '.5s');
          // advantageBox.eq(1).css('animation-delay', '2s');
          // advantageBox.eq(2).css('animation-delay', '4s');
        }
        if(destination.index == 3) {
          // this.blueLogo = true;
          this.configService.configs.blueLogo = true;
          const toolkitBox = $('.how-collegey-works-box');
          toolkitBox.addClass('animated');
          const collegeySteps = $('.border-box');
          collegeySteps.addClass('draw');
        }
        if(destination.index == 4) {
          // this.blueLogo = true;
          this.configService.configs.blueLogo = true;
          const toolkitBox = $('.toolkit-box');
          toolkitBox.addClass('animated');
        }
        if(destination.index == 5) {
          // this.blueLogo = true;
          this.configService.configs.blueLogo = true;
          const readyToBuildInner = $('.ready-to-build-inner');
          headerScrollIndicator.css('background', 'black');
          readyToBuildInner.addClass('animated');
        }

        if (destination.index == 6) {
          headerScrollIndicator.css('background', 'white');
        }


        this.cdr.detectChanges();
      },
    });
  }

  onRegister() {
    if(!this.authService.getToken()) {
      this.authService.openAuthDialog(AuthType.SIGN_UP);
      return;
    }
    const  user: User = JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA)).user;

    if(user.type === UserType.STUDENTS) {
      this.router.navigateByUrl('/student-dashboard/$');
    } else if(user.type === UserType.COUNSELOR) {
      this.router.navigateByUrl('/counselor/dashboard');
    }
  }

  ngOnDestroy(): void {
    this.configService.setDefaultConfigs();
    this.fullPageObj.destroy('all');
  }

}
