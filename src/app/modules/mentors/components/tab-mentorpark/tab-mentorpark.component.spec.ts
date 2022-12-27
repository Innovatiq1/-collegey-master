import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMentorparkComponent } from './tab-mentorpark.component';

describe('TabMentorparkComponent', () => {
  let component: TabMentorparkComponent;
  let fixture: ComponentFixture<TabMentorparkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabMentorparkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMentorparkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
