import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QaformsComponent } from './qaforms.component';

describe('QaformsComponent', () => {
  let component: QaformsComponent;
  let fixture: ComponentFixture<QaformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QaformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
