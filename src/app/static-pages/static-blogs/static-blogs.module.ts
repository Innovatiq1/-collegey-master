import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticBlogsRoutingModule } from './static-blogs-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [
    StaticBlogsRoutingModule.components,
    
  ],
  imports: [
    CommonModule,
    StaticBlogsRoutingModule,
    SharedModule,
    PaginationModule.forRoot(),

  ]
})
export class StaticBlogsModule { }
