import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMentorResourcesComponent } from './tab-mentor-resources.component';

describe('TabMentorResourcesComponent', () => {
  let component: TabMentorResourcesComponent;
  let fixture: ComponentFixture<TabMentorResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabMentorResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMentorResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
