import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivecoursesComponent } from './activecourses.component';

describe('ActivecoursesComponent', () => {
  let component: ActivecoursesComponent;
  let fixture: ComponentFixture<ActivecoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivecoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivecoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
