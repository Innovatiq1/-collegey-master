import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentsProfileComponent } from './parents-profile.component';

describe('ParentsProfileComponent', () => {
  let component: ParentsProfileComponent;
  let fixture: ComponentFixture<ParentsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
