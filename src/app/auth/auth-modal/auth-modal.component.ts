import { Component, OnInit, ViewChild } from '@angular/core';
// import { ModalDirective } from 'ngx-bootstrap';
import { AuthService } from '../../core/services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit {
  @ViewChild('authModal', { static: true }) authModal: ModalDirective;

  constructor(private authService: AuthService) {
    /**
     * Show/Hide Auth Modal on Subscribe
     */
    this.authService.authModal$.subscribe(authModal => {
      if (authModal.show) {
        this.showModal();
      } else {
        this.hideModal();
      }
    });
  }

  ngOnInit() {}

  /**
   * Show Auth Modal
   */
  showModal() {
    this.authModal.show();
  }

  /**
   * Hide Auth Modal
   */
  hideModal() {
    this.authModal.hide();
  }
}
