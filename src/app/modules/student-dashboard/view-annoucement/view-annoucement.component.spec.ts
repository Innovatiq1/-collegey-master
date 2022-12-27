import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnnoucementComponent } from './view-annoucement.component';

describe('ViewAnnoucementComponent', () => {
  let component: ViewAnnoucementComponent;
  let fixture: ComponentFixture<ViewAnnoucementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAnnoucementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAnnoucementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
