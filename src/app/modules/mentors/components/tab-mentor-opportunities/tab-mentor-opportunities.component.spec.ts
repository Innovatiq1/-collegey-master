import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMentorOpportunitiesComponent } from './tab-mentor-opportunities.component';

describe('TabMentorOpportunitiesComponent', () => {
  let component: TabMentorOpportunitiesComponent;
  let fixture: ComponentFixture<TabMentorOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabMentorOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMentorOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
