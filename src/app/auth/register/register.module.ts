import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthPageGuard } from '@core/guards/auth-page.guard';
import { SharedModule } from '../../shared/shared.module';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    // canActivate: [AuthPageGuard],
  },
];

@NgModule({
  declarations: [RegisterComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class RegisterModule {}
