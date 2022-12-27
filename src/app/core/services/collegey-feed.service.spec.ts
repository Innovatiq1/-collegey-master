import { TestBed } from '@angular/core/testing';

import { CollegeyFeedService } from './collegey-feed.service';

describe('CollegeyFeedService', () => {
  let service: CollegeyFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegeyFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
