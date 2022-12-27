import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { AuthWrapperComponent } from './auth-wrapper/auth-wrapper.component';
import { ModalModule } from 'ngx-bootstrap/modal';

const SHARED_COMPONENTS = [AuthModalComponent, AuthWrapperComponent];

@NgModule({
  declarations: [SHARED_COMPONENTS],
  imports: [CommonModule, SharedModule, ModalModule.forRoot()],
  exports: [SHARED_COMPONENTS],
})
export class AuthModule {}
