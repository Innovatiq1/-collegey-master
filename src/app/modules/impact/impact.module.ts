import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImpactroutingModule} from './impact-routing.module';
import { ImpactProfileComponent } from './impact-profile/impact-profile.component';
import { IpDashboardComponent} from './ip-dashboard/ip-dashboard.component'
@NgModule({
  declarations: [IpDashboardComponent,ImpactProfileComponent],
  imports: [
    CommonModule,
    ImpactroutingModule,
    NgbModule,
    FormsModule,ReactiveFormsModule,SharedModule
  ]
})
export class ImpactModule { }
