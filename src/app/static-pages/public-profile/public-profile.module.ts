import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicProfileRoutingModule } from './public-profile-routing.module';
import { PublicProfileComponent } from './public-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [PublicProfileComponent],
  imports: [
    PublicProfileRoutingModule,
    SharedModule,
    CommonModule
  ]
})
export class PublicProfileModule { }
