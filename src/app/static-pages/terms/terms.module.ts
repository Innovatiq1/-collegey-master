import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-routing.module';


@NgModule({
  declarations: [TermsRoutingModule.components],
  imports: [
    CommonModule,
    TermsRoutingModule
  ]
})
export class TermsModule { }
