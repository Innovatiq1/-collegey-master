import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMentorHosteventComponent } from './tab-mentor-hostevent.component';

describe('TabMentorHosteventComponent', () => {
  let component: TabMentorHosteventComponent;
  let fixture: ComponentFixture<TabMentorHosteventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabMentorHosteventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMentorHosteventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
