import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerWithCollegeyComponent } from './partner-with-collegey.component';

describe('PartnerWithCollegeyComponent', () => {
  let component: PartnerWithCollegeyComponent;
  let fixture: ComponentFixture<PartnerWithCollegeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerWithCollegeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerWithCollegeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
