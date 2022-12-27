import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsFeedComponent } from './groups-feed.component';

describe('GroupsFeedComponent', () => {
  let component: GroupsFeedComponent;
  let fixture: ComponentFixture<GroupsFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
