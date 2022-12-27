import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { AuthPageGuard } from '@core/guards/auth-page.guard';
import { SharedModule } from '../../shared/shared.module';
import { InviteProjectComponent } from './invite-project.component';

const routes: Routes = [
  {
    path: '',
    component: InviteProjectComponent,
   // canActivate: [AuthPageGuard],
  },
];

@NgModule({
  declarations: [InviteProjectComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class InviteProjectModule {}
