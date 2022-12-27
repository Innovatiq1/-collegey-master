import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BigPictureProjectRoutingModule } from './big-picture-project-routing.module';
import { BigPictureProjectComponent } from './big-picture-project/big-picture-project.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';


@NgModule({
  declarations: [BigPictureProjectComponent, BasicInfoComponent],
  imports: [
    CommonModule,
    BigPictureProjectRoutingModule
  ]
})
export class BigPictureProjectModule { }
