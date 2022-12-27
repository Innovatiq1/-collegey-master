import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPublicProfileComponent } from './mentor-public-profile.component';

describe('MentorPublicProfileComponent', () => {
  let component: MentorPublicProfileComponent;
  let fixture: ComponentFixture<MentorPublicProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorPublicProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorPublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
