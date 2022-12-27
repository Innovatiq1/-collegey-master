import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorProfileidComponent } from './mentor-profileid.component';

describe('MentorProfileidComponent', () => {
  let component: MentorProfileidComponent;
  let fixture: ComponentFixture<MentorProfileidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorProfileidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorProfileidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
