import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { CollageyComponent } from './collagey.component';


@NgModule({
  declarations: [
    CollageyComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    PaginationModule,
    SharedModule,
  ]
})
export class CollegeyModule { }
