import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { BigPictureProjectComponent } from './big-picture-project/big-picture-project.component';


const routes: Routes = [
  {
    path: '',
    component: BigPictureProjectComponent,
  },
  {
    path: 'info',
    component: BasicInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BigPictureProjectRoutingModule { }
