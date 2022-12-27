import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementTermsConditionComponent } from './agreement-terms-condition.component';

describe('AgreementTermsConditionComponent', () => {
  let component: AgreementTermsConditionComponent;
  let fixture: ComponentFixture<AgreementTermsConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementTermsConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementTermsConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
