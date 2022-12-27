import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { CorousalOneComponent } from './components/corousal-one/corousal-one.component';
import { CorousalTwoComponent } from './components/corousal-two/corousal-two.component';
import { CorousalThreeComponent } from './components/corousal-three/corousal-three.component';
import { CorousalFourComponent } from './components/corousal-four/corousal-four.component';
import { CorousalFiveComponent } from './components/corousal-five/corousal-five.component';
import { CorousalSixComponent } from './components/corousal-six/corousal-six.component';
import { CorousalSevenComponent } from './components/corousal-seven/corousal-seven.component';
import { CorousalEightComponent } from './components/corousal-eight/corousal-eight.component';
import { CorousalNineComponent } from './components/corousal-nine/corousal-nine.component';
import { CorousalFooterComponent } from './components/corousal-footer/corousal-footer.component';

import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorousalTenComponent } from './components/corousal-ten/corousal-ten.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from "swiper/angular";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    CorousalOneComponent,
    CorousalTwoComponent,
    CorousalThreeComponent,
    CorousalFourComponent,
    CorousalFiveComponent,
    CorousalSixComponent,
    CorousalSevenComponent,
    CorousalEightComponent,
    CorousalNineComponent,
    CorousalTenComponent,
    CorousalFooterComponent,
    SafePipe,
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule,NgbModule,SwiperModule,CarouselModule,SlickCarouselModule]
})
export class HomeModule {}
