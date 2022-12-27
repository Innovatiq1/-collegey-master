import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';



@NgModule({
  declarations: [
    PrivacyPolicyRoutingModule.components
  ],
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule
  ]
})
export class PrivacyPolicyModule { }
