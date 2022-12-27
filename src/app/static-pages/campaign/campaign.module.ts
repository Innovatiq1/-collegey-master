import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignComponent } from './campaign.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CampaignComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgModule,
    CoreModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CampaignModule { }
