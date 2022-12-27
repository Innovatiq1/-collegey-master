import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessProgramComponent } from './success-program.component';

describe('SuccessProgramComponent', () => {
  let component: SuccessProgramComponent;
  let fixture: ComponentFixture<SuccessProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
