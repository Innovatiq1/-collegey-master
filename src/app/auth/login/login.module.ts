import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthPageGuard } from '@core/guards/auth-page.guard';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    // canActivate: [AuthPageGuard],
  },
];
@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class LoginModule {}
