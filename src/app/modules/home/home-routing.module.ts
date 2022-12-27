import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { CorousalOneComponent } from './components/corousal-one/corousal-one.component';
import { CorousalTwoComponent } from './components/corousal-two/corousal-two.component';
import { CorousalThreeComponent } from './components/corousal-three/corousal-three.component';
import { CorousalFourComponent } from './components/corousal-four/corousal-four.component';
import { CorousalFiveComponent } from './components/corousal-five/corousal-five.component';
import { CorousalSixComponent } from './components/corousal-six/corousal-six.component';
import { CorousalSevenComponent } from './components/corousal-seven/corousal-seven.component';
import { CorousalEightComponent } from './components/corousal-eight/corousal-eight.component';
import { CorousalNineComponent } from './components/corousal-nine/corousal-nine.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
