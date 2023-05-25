import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HeaderMobileMenuComponent } from './header-mobile-menu/header-mobile-menu.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HeaderMobileMenuComponent,
    
    
  ],
  imports: [
    RouterModule,
    CommonModule,
    BsDropdownModule.forRoot(),
    SlickCarouselModule
  ],
  exports: [HeaderComponent, FooterComponent],
})
export class LayoutModule {}
