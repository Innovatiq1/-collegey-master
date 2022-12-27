import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorGlobaldashboardComponent } from './mentor-globaldashboard.component';

describe('MentorGlobaldashboardComponent', () => {
  let component: MentorGlobaldashboardComponent;
  let fixture: ComponentFixture<MentorGlobaldashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorGlobaldashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorGlobaldashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
