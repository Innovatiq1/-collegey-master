import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CounselorSignUpComponent } from './counselor-signup.component';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: CounselorSignUpComponent,
  },
];

@NgModule({
  declarations: [CounselorSignUpComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class CounselorSignUpModule { }
