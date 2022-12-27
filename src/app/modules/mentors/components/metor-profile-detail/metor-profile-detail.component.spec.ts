import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetorProfileDetailComponent } from './metor-profile-detail.component';

describe('MetorProfileDetailComponent', () => {
  let component: MetorProfileDetailComponent;
  let fixture: ComponentFixture<MetorProfileDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetorProfileDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetorProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
