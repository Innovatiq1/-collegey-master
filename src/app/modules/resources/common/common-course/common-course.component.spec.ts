import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCourseComponent } from './common-course.component';

describe('CommonCourseComponent', () => {
  let component: CommonCourseComponent;
  let fixture: ComponentFixture<CommonCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
