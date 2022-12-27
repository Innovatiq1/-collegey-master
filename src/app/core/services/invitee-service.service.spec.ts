import { TestBed } from '@angular/core/testing';

import { InviteeServiceService } from './invitee-service.service';

describe('InviteeServiceService', () => {
  let service: InviteeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InviteeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
